import { Injectable, OnModuleInit } from '@nestjs/common';
import { SkillRepo } from './skills.repo';
import { CreateSkillDto, UpdateSkillDto } from './dtos/skill.dto';
import { seederToData } from '@common/helpers/seeder-to-data';
import { PaginationFilter } from '@common/types/pagination.dto';

@Injectable()
export class SkillsService implements OnModuleInit {
  constructor(private readonly skillRepo: SkillRepo) {}

  //! ================================================= SEEDING =================================================
  async onModuleInit() {
    const data = await seederToData<CreateSkillDto>('skills');
    // Check if skills already seeded
    const existing = await this.skillRepo.findMany();
    if (existing.length === 0) {
      console.log(`Seeding ${data.length} skills...`);

      // Insert all records
      for (const skill of data) {
        await this.skillRepo.create({
          data: {
            name: skill.name,
            icon: skill.icon,
            showOnPortfolio: skill.showOnPortfolio,
          },
        });
      }

      console.log('Skills were successfully seeded');
    }
  }

  //! ================================================= Find Many =================================================
  async findMany(query: PaginationFilter) {
    const data = await this.skillRepo.findMany({}, query.pageSize, query.page);
    return data;
  }
  //! ================================================= Find One =================================================
  async findOne(id: number) {
    const data = await this.skillRepo.findOne({ where: { id } });
    return data;
  }

  //! ================================================= CREATE =================================================
  async create(data: CreateSkillDto) {
    return await this.skillRepo.create({ data });
  }

  //! ================================================= UPDATE =================================================
  async update(id: number, data: UpdateSkillDto) {
    const updatedSkill = await this.skillRepo.updateOne({
      where: { id },
      data,
    });
    return updatedSkill;
  }

  //! ================================================= UPDATE WITH ICON =================================================
  async updateWithIcon(args: any, file: Express.Multer.File, type: string) {
    const oldFileToDelete = await this.skillRepo.findOne({
      where: { id: args.where.id },
    });

    const updated = await this.skillRepo.updateWithIcon(
      args,
      file,
      type,
      type,
      oldFileToDelete?.icon ? `${type}/${oldFileToDelete.icon}` : null,
      'Icon',
    );
    return updated;
  }

  //! ================================================= DELETE =================================================
  async delete(id: number) {
    return await this.skillRepo.delete({ where: { id } });
  }
}
