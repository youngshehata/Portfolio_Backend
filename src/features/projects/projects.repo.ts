import { AbstractRepo } from '@common/abstracts/abstract.repo';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProjectSkillDto } from './dtos/project-skill.dto';
import { PaginationFilter } from '@common/types/pagination.dto';
import { addCorrectPathToObject } from '@common/helpers/add-correct-path';
import {
  PROJECTS_IMAGES_PATH,
  SKILLS_IMAGES_PATH,
} from '@common/constraints/images.paths';
import { DEFAULT_PAGE_SIZE } from '@common/constraints/constraints.common';

@Injectable()
export class ProjectsRepo extends AbstractRepo<PrismaService['projects']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.projects);
  }

  //! ================= GET ORDERS WITH IMAGES AND SKILLS ========================
  async findManyProjects(query: PaginationFilter) {
    const data = await this.prisma.projects.findMany({
      take: Number(query.pageSize || DEFAULT_PAGE_SIZE),
      skip: Number((query.page || 1) - 1) * Number(query.pageSize || 1),
      include: {
        Projects_Images: { select: { path: true } },
        Projects_Skills: {
          select: { skills: { select: { name: true, icon: true } } },
        },
      },
    });
    const formatted = data.map((project) => {
      return {
        ...project,
        images: project.Projects_Images.map(
          (image) => `${PROJECTS_IMAGES_PATH}${image.path}`,
        ),
        skills: project.Projects_Skills.map((skill) =>
          addCorrectPathToObject(skill.skills, 'icon', SKILLS_IMAGES_PATH),
        ),
        Projects_Skills: undefined,
        Projects_Images: undefined,
      };
    });
    const totalResults = await this.prisma.projects.count();

    return { data: formatted, totalResults };
  }

  //! ================= GET SKILLS FOR A PROJECT =================
  async findOneProjectSkill(data: ProjectSkillDto) {
    return await this.prisma.projects_Skills.findFirst({
      where: { project: data.projectId, skill: data.skillId },
    });
  }

  //! ================= ADD SKILL ====================
  async createSkill(data: ProjectSkillDto) {
    return await this.prisma.projects_Skills.create({
      data: { project: data.projectId, skill: data.skillId },
    });
  }

  //! ================= DELETE SKILL ====================
  async deleteSkill(id: number) {
    try {
      return await this.prisma.projects_Skills.delete({ where: { id } });
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }

  //! ================= DELETE IMAGES OF PROJECT ====================
  async deleteImagesOfProject(id: number) {
    const images = await this.prisma.projects_Images.findMany({
      where: { project: id },
    });
    if (images.length === 0)
      throw new BadRequestException('No images are added to this project');
    const deleted = await this.prisma.projects.delete({ where: { id } });
    if (deleted) {
    }
  }
}
