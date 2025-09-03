import { AbstractRepo } from '@common/abstracts/abstract.repo';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProjectSkillDto } from './dtos/project-skill.dto';
import { deleteMultipleFiles } from '@common/helpers/delete-multiple-files';
import { PROJECTS_IMAGES_PATH } from '@common/constraints/images.paths';

@Injectable()
export class ProjectsRepo extends AbstractRepo<PrismaService['projects']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.projects);
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
