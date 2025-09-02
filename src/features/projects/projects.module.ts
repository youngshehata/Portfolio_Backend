import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from '@common/services/upload.service';
import { ProjectsRepo } from './projects.repo';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { SkillsModule } from '../skills/skills.module';

@Module({
  imports: [SkillsModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, ProjectsRepo, UploadService],
})
export class ProjectsModule {}
