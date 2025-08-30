import { Module } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalController } from './personal.controller';
import { PersonalRepo } from './personal.repo';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [PersonalController],
  providers: [PersonalService, PersonalRepo, PrismaService],
})
export class PersonalModule {}
