import { AbstractRepo } from '@common/abstracts/abstract.repo';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PROJECTS_IMAGES_PATH } from '@common/constraints/images.paths';

@Injectable()
export class ProjectsImagesRepo extends AbstractRepo<
  PrismaService['projects_Images']
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.projects_Images, 'path', PROJECTS_IMAGES_PATH);
  }

  //! ============================ GET MAX ORDER ========================
  async getMaxOrder(projectID: number) {
    const max = await this.prisma.projects_Images.aggregate({
      where: { project: projectID },
      _max: { order: true },
    });
    return max._max.order;
  }
}
