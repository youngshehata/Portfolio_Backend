import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AbstractRepo } from 'src/common/abstracts/abstract.repo';

const prisma = new PrismaClient();

@Injectable()
export class SkillRepo extends AbstractRepo<typeof prisma.skills> {
  constructor() {
    super(prisma.skills); // Passing the delegate
  }

  // You can add custom methods here:
  findVisible() {
    return this.findMany({ where: { showOnPortfolio: true } });
  }
}
