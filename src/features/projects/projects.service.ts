import {
  BadRequestException,
  HttpException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PaginationFilter } from '@common/types/pagination.dto';
import { ProjectsRepo } from './projects.repo';
import { CreateProjectDto, UpdateProjectDto } from './dtos/project.dto';
import { ProjectSkillDto } from './dtos/project-skill.dto';
import { SkillsService } from '../skills/skills.service';
import { UploadService } from '@common/services/upload.service';
import { ProjectsImagesRepo } from './projects-images.repo';
import { of } from 'rxjs';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectRepo: ProjectsRepo,
    private readonly projectsImagesRepo: ProjectsImagesRepo,
    private readonly skillsService: SkillsService,
    private readonly uploadService: UploadService,
  ) {}

  //! ================================================= Find Many =================================================
  async findMany(query: PaginationFilter) {
    const data = await this.projectRepo.findMany(
      {},
      query.pageSize,
      query.page,
    );
    return data;
  }
  //! ================================================= Find One =================================================
  async findOne(id: number) {
    const data = await this.projectRepo.findOne({ where: { id } });
    return data;
  }
  //! ======================================== Find SKILLS FOR PROJECT =====================================
  async findSkills(id: number) {
    const projectExists = await this.projectRepo.findOne({ where: { id } });
    if (!projectExists) throw new BadRequestException('Project does not exist');
    return await this.projectRepo.getSkills(id);
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

  //! ================================================= DELETE =================================================
  async delete(id: number) {
    return await this.projectRepo.delete({ where: { id } });
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
      'projects',
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
        order: maxOrder ? maxOrder + 1 : undefined,
      },
    });
    return created;
  }
}
