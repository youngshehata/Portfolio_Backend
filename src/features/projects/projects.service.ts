import { Injectable, OnModuleInit } from '@nestjs/common';
import { PaginationFilter } from '@common/types/pagination.dto';
import { ProjectsRepo } from './projects.repo';
import { CreateProjectDto, UpdateProjectDto } from './dtos/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepo: ProjectsRepo) {}

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

  //! ================================================= CREATE =================================================
  async create(data: CreateProjectDto) {
    return await this.projectRepo.create({ data });
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
