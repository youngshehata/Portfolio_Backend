import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { SkillRepo } from './skills.repo';
import { CreateSkillDto, UpdateSkillDto } from './dtos/skill.dto';
import { seederToData } from '@common/helpers/seeder-to-data';
import { SkillsPaginationDto } from './dtos/skills.pagination.dto';
import { addCorrectPathToObject } from '@common/helpers/add-correct-path';
import { SKILLS_IMAGES_PATH } from '@common/constraints/images.paths';

@Injectable()
export class SkillsService implements OnModuleInit {
  constructor(private readonly skillRepo: SkillRepo) {}

  //! ================================================= SEEDING =================================================
  async onModuleInit() {
    const data = await seederToData<CreateSkillDto>('skills');
    // Check if skills already seeded
    const existing = await this.skillRepo.findMany();
    if (existing.data.length === 0) {
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
  async findMany(query: SkillsPaginationDto) {
    const data = await this.skillRepo.findMany(
      {
        where: {
          ...(query.showOnPortfolio !== undefined && {
            showOnPortfolio: { equals: query.showOnPortfolio },
          }),

          ...(query.search && {
            name: { contains: query.search, mode: 'insensitive' },
          }),
        },
      },
      query.pageSize,
      query.page,
    );
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

    let updated = await this.skillRepo.updateWithIcon(
      args,
      file,
      type,
      type,
      oldFileToDelete?.icon ? `${type}/${oldFileToDelete.icon}` : null,
      'Icon',
    );
    if (!file) {
      updated = addCorrectPathToObject(updated, 'icon', SKILLS_IMAGES_PATH);
    }

    return updated;
  }

  //! ================================================= DELETE =================================================
  async delete(id: number) {
    try {
      return await this.skillRepo.delete({ where: { id } });
    } catch (error) {
      if (error.message.includes('constraint violated')) {
        throw new HttpException('Some projects are using this skill', 400);
      }
    }
  }
}
