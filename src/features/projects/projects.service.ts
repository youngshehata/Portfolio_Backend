import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PaginationFilter } from '@common/types/pagination.dto';
import { ProjectsRepo } from './projects.repo';
import { CreateProjectDto, UpdateProjectDto } from './dtos/project.dto';
import { ProjectSkillDto } from './dtos/project-skill.dto';
import { SkillsService } from '../skills/skills.service';
import { UploadService } from '@common/services/upload.service';
import { ProjectsImagesRepo } from './projects-images.repo';
import { ProjectsSkillsRepo } from './projects-skills.repo';
import { rm } from 'fs/promises';
import { PROJECTS_IMAGES_PATH } from '@common/constraints/images.paths';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectRepo: ProjectsRepo,
    private readonly projectsImagesRepo: ProjectsImagesRepo,
    private readonly projectsSkillsRepo: ProjectsSkillsRepo,
    private readonly skillsService: SkillsService,
    private readonly uploadService: UploadService,
    private readonly loggingService: LogsService,
  ) {}

  // //! ================================================= Find Many =================================================
  // async findMany(query: PaginationFilter) {
  //   const data = await this.projectRepo.findMany(
  //     {},
  //     query.pageSize,
  //     query.page,
  //   );
  //   return data;
  // }
  //! ============================================= Find Many Projects ==============================================
  async findManyProjects(query: PaginationFilter) {
    const data = await this.projectRepo.findManyProjects(query);
    return data;
  }
  //! ================================================= Find One =================================================
  async findOne(id: number) {
    const data = await this.projectRepo.findOne({ where: { id } });
    return data;
  }
  //! ======================================== Find SKILLS FOR PROJECT =====================================
  async findSkills(id: number, query: PaginationFilter) {
    const projectExists = await this.projectRepo.findOne({ where: { id } });
    if (!projectExists) throw new BadRequestException('Project does not exist');
    return await this.projectsSkillsRepo.findMany(
      { where: { project: id } },
      query.pageSize,
      query.page,
    );
  }
  //! ======================================== Find IMAGES FOR PROJECT =====================================
  async findImages(id: number, query: PaginationFilter) {
    const projectExists = await this.projectRepo.findOne({ where: { id } });
    if (!projectExists) throw new BadRequestException('Project does not exist');
    return await this.projectsImagesRepo.findMany(
      { where: { project: id } },
      query.pageSize,
      query.page,
    );
  }

  //! ================================================= CREATE =================================================
  async create(data: CreateProjectDto) {
    return await this.projectRepo.create({ data });
  }

  //! ============================================== CREATE SKILL ==============================================
  async createSkill(data: ProjectSkillDto) {
    const projectExists = await this.projectRepo.findOne({
      where: { id: data.projectId },
    });
    if (!projectExists) throw new BadRequestException('Project does not exist');

    const skillExists = await this.skillsService.findOne(data.skillId);
    if (!skillExists) throw new BadRequestException('Skill does not exist');

    const alreadyExists = await this.projectRepo.findOneProjectSkill(data);
    if (alreadyExists) {
      throw new HttpException('This skill already added to this project', 409);
    }

    return await this.projectRepo.createSkill(data);
  }

  //! ================================================= DELETE SKILL =================================================
  async deleteSkill(id: number) {
    return await this.projectRepo.deleteSkill(id);
  }

  //! ================================================= UPDATE =================================================
  async update(id: number, data: UpdateProjectDto) {
    const updatedProject = await this.projectRepo.updateOne({
      where: { id },
      data,
    });
    return updatedProject;
  }

  //! ================================================= DELETE PROJECT =================================================
  async delete(id: number) {
    const deleted = await this.projectRepo.delete({ where: { id } });
    if (deleted) {
      try {
        await rm(
          `${process.cwd()}/public${PROJECTS_IMAGES_PATH}${deleted.id}`,
          { recursive: true, force: true },
        );
      } catch (error) {
        console.log(error);
        this.loggingService.createLog(
          `Error deleting project images folder, project id = ${deleted.id} - error message = ${error.message}`,
          'ERROR',
        );
      }
    }
    return deleted;
  }

  //! =============================================  UPLOAD IMAGE  ================================================
  async uploadImage(file: Express.Multer.File, id: number) {
    if (!id) {
      throw new HttpException('Project ID required', 400);
    }
    if (!file) {
      throw new HttpException('Invalid file', 400);
    }

    const projectExists = await this.projectRepo.findOne({ where: { id } });
    if (!projectExists) {
      throw new HttpException('Invalid project id', 400);
    }

    const uploaded = await this.uploadService.uploadFile(
      file,
      'Image',
      `projects/${id}/`,
      null,
      'Image',
    );
    if (!uploaded) {
      throw new HttpException('Error uploading the image', 500);
    }
    const maxOrder = await this.projectsImagesRepo.getMaxOrder(id);
    const created = await this.projectsImagesRepo.create({
      data: {
        path: uploaded,
        project: id,
        order: maxOrder ? maxOrder + 1 : 1,
      },
    });
    return created;
  }

  //! =============================================  CHANGE IMAGE ORDER  ================================================
  async changeImageOrder(imageID: number, type: string) {
    const image = await this.projectsImagesRepo.findOne({
      where: { id: imageID },
    });
    if (!image) {
      throw new HttpException('Invalid image id', 400);
    }
    if (!type || (type !== 'increase' && type !== 'decrease')) {
      throw new HttpException('type is required (increase or decrease)', 400);
    }
    const adjacentImage = await this.projectsImagesRepo.findMany({
      where: {
        project: image.project,
        order: type === 'increase' ? image.order + 1 : image.order - 1,
      },
    });
    if (!adjacentImage) {
      return await this.projectsImagesRepo.updateOne({
        where: { id: imageID },
        data: {
          order: type === 'increase' ? image.order + 1 : image.order - 1,
        },
      });
    }

    await this.projectsImagesRepo.updateOne({
      where: { id: adjacentImage[0].id },
      data: {
        order: image.order,
      },
    });
    return await this.projectsImagesRepo.updateOne({
      where: { id: imageID },
      data: {
        order: adjacentImage[0].order,
      },
    });
  }
}
