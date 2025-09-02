import { AbstractRepo } from '@common/abstracts/abstract.repo';
import { SKILLS_IMAGES_PATH } from '@common/constraints/images.paths';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SkillRepo extends AbstractRepo<PrismaService['skills']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.skills, 'icon', SKILLS_IMAGES_PATH);
  }
}
