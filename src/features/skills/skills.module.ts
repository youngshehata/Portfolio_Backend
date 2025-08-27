import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { PrismaService } from 'prisma/prisma.service';
import { SkillRepo } from './skills.repo';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService, PrismaService, SkillRepo],
})
export class SkillsModule {}
