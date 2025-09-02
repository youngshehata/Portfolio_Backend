import { AbstractRepo } from '@common/abstracts/abstract.repo';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProjectSkillDto } from './dtos/project-skill.dto';

@Injectable()
export class ProjectsRepo extends AbstractRepo<PrismaService['projects']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.projects);
  }

  //! ================= GET SKILLS FOR A PROJECT =================
  async getSkills(id: number) {
    try {
      const skills = await this.prisma.projects_Images.findMany({
        where: { project: id },
      });
      return skills;
    } catch (error) {
      //! CHECK IF PROJECT ID WRONG
      console.log(error);
    }
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
}
