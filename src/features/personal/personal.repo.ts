import { AbstractRepo } from '@common/abstracts/abstract.repo';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PersonalRepo extends AbstractRepo<PrismaService['personal']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.personal);
  }
}
