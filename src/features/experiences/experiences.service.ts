import { Injectable } from '@nestjs/common';
import { PaginationFilter } from '@common/types/pagination.dto';
import { ExperiencesRepo } from './experiences.repo';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from './dtos/experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private readonly experienceRepo: ExperiencesRepo) {}

  //! ================================================= Find Many =================================================
  async findMany(query: PaginationFilter) {
    const data = await this.experienceRepo.findMany(
      {},
      query.pageSize,
      query.page,
    );
    // return data;

    return data;
  }
  //! ================================================= Find One =================================================
  async findOne(id: number) {
    const data = await this.experienceRepo.findOne({ where: { id } });
    return data;
  }

  //! ================================================= CREATE =================================================
  async create(data: CreateExperienceDto) {
    return await this.experienceRepo.create({ data });
  }

  //! ================================================= UPDATE =================================================
  async update(id: number, data: UpdateExperienceDto) {
    const updatedExperience = await this.experienceRepo.updateOne({
      where: { id },
      data,
    });
    return updatedExperience;
  }

  //! ================================================= DELETE =================================================
  async delete(id: number) {
    return await this.experienceRepo.delete({ where: { id } });
  }
}
