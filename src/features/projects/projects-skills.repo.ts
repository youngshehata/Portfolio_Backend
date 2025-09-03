import { AbstractRepo } from '@common/abstracts/abstract.repo';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProjectsSkillsRepo extends AbstractRepo<
  PrismaService['projects_Skills']
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.projects_Skills);
  }
}
