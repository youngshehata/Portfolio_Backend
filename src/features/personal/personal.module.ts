import { Module } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalController } from './personal.controller';
import { PersonalRepo } from './personal.repo';
import { PrismaService } from 'prisma/prisma.service';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [PersonalController],
  providers: [PersonalService, PersonalRepo, PrismaService],
})
export class PersonalModule {}
