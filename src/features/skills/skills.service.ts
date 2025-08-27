import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SkillRepo } from './skills.repo';

@Injectable()
export class SkillsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly skillRepo: SkillRepo,
  ) {}
  async create() {
    //!TEST
    return await this.skillRepo.create({ data: { name: 'test' } });
  }

  async update() {
    //!TEST
    return await this.skillRepo.update({
      where: { id: 1 },
      data: { name: 'test2' },
    });
  }

  async findOne() {
    return await this.skillRepo.delete({ where: { id: 1 } });
  }
}
