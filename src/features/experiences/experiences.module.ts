import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from '@common/services/upload.service';
import { ExperiencesRepo } from './experiences.repo';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';

@Module({
  controllers: [ExperiencesController],
  providers: [
    ExperiencesService,
    PrismaService,
    ExperiencesRepo,
    UploadService,
  ],
})
export class ExperiencesModule {}
