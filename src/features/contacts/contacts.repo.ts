import { AbstractRepo } from '@common/abstracts/abstract.repo';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ContactsRepo extends AbstractRepo<PrismaService['contacts']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.contacts);
  }
}
