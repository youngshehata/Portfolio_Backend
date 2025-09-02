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
  async getSkills(projectID: number) {
    const skills = await this.prisma.projects_Skills.findMany({
      where: { project: projectID },
    });
    if (skills.length === 0)
      throw new BadRequestException('No skills are added to this project');
    return skills;
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
}
