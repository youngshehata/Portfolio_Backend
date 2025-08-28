import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [],
  providers: [LogsService, PrismaService],
  exports: [LogsService],
})
export class LogsModule {}
