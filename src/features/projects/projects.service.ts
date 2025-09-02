import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { PaginationFilter } from '@common/types/pagination.dto';
import { ProjectsRepo } from './projects.repo';
import { CreateProjectDto, UpdateProjectDto } from './dtos/project.dto';
import { ProjectSkillDto } from './dtos/project-skill.dto';
import { SkillsService } from '../skills/skills.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectRepo: ProjectsRepo,
    private readonly skillsService: SkillsService,
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
    const data = await this.projectRepo.getSkills(id);
    return data;
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
}
