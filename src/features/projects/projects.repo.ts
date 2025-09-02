import { AbstractRepo } from '@common/abstracts/abstract.repo';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProjectsRepo extends AbstractRepo<PrismaService['projects']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.projects);
  }
}
