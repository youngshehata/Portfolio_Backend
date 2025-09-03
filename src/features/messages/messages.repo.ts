import { AbstractRepo } from '@common/abstracts/abstract.repo';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MessagesRepo extends AbstractRepo<PrismaService['messages']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.messages);
  }
}
