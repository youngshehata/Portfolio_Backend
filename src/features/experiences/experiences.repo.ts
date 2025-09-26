import { AbstractRepo } from '@common/abstracts/abstract.repo';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ExperiencesRepo extends AbstractRepo<
  PrismaService['experiences']
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.experiences);
  }
}
