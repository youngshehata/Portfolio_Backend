import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from '@common/constraints/constraints.common';
import { addCorrectPathToObject } from '@common/helpers/add-correct-path';
import { UploadService } from '@common/services/upload.service';
import { HttpException, Inject } from '@nestjs/common';

export abstract class AbstractRepo<
  TDelegate extends {
    findMany: (...args: any[]) => any;
    create: (...args: any[]) => any;
    update: (...args: any[]) => any;
    delete: (...args: any[]) => any;
    findUnique: (...args: any[]) => any;
    count: (...args: any[]) => any;
  },
> {
  constructor(
    protected readonly delegate: TDelegate,
    private readonly pathKey?: string,
    private readonly PathEnvVariable?: string,
  ) {}

  @Inject(UploadService)
  protected uploadService: UploadService;

  //! ===============================>   FIND MANY   <===============================
  async findMany(
    args?: Parameters<TDelegate['findMany']>[0],
    pageSize: number = DEFAULT_PAGE_SIZE,
    pageNumber: number = DEFAULT_PAGE_NUMBER,
  ): Promise<{
    data: Awaited<ReturnType<TDelegate['findMany']>>;
    totalCount: number;
  }> {
    try {
      const where = args?.where;

      const [data, totalCount] = await Promise.all([
        this.delegate.findMany({
          ...args,
          take: Number(pageSize),
          skip: Number((pageNumber - 1) * pageSize),
        }),
        this.delegate.count({ where }),
      ]);

      if (this.pathKey && this.PathEnvVariable) {
        data.forEach((entity: any) =>
          addCorrectPathToObject(entity, this.pathKey!, this.PathEnvVariable!),
        );
      }

      return { data, totalCount };
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }

  //! ===============================>   FIND ONE   <===============================
  async findOne(
    args: Parameters<TDelegate['findUnique']>[0],
  ): Promise<ReturnType<TDelegate['findUnique']>> {
    try {
      const found = await this.delegate.findUnique(args);
      if (!found) {
        throw new HttpException(`Entity Not found`, 404);
      }
      if (this.pathKey && this.PathEnvVariable) {
        return addCorrectPathToObject(
          found,
          this.pathKey!,
          this.PathEnvVariable!,
        );
      }
      return found;
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }

  //! ===============================>   Create   <===============================
  async create(
    args: Parameters<TDelegate['create']>[0],
  ): Promise<ReturnType<TDelegate['create']>> {
    try {
      const created = await this.delegate.create(args);
      if (this.pathKey && this.PathEnvVariable) {
        return addCorrectPathToObject(
          created,
          this.pathKey!,
          this.PathEnvVariable!,
        );
      }
      return created;
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }

  //! ===============================>   Update One   <===============================
  async updateOne(
    args: Parameters<TDelegate['update']>[0],
  ): Promise<ReturnType<TDelegate['update']>> {
    try {
      const result = await this.delegate.update(args);
      if (this.pathKey && this.PathEnvVariable) {
        return addCorrectPathToObject(
          result,
          this.pathKey!,
          this.PathEnvVariable!,
        );
      }
      return result;
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }

  //! ===============================>   Update With Icon   <===============================

  async updateWithIcon(
    args: Parameters<TDelegate['update']>[0],
    file?: Express.Multer.File,
    type?: string,
    savePathInsidePublic?: string,
    oldFileToDelete?: string | null,
    imageSize?: 'Icon' | 'Image',
  ): Promise<ReturnType<TDelegate['update']>> {
    try {
      if (!file) return await this.delegate.update(args);

      if (!type) {
        throw new HttpException('Type is required when uploading an icon', 400);
      }

      if (!imageSize) {
        throw new HttpException(
          'Image size type is required (icon or image)',
          400,
        );
      }
      const uploadedFile = await this.uploadService.uploadFile(
        file,
        'Image',
        savePathInsidePublic!,
        oldFileToDelete!,
        imageSize,
      );

      const updated = await this.delegate.update({
        ...args,
        data: { ...args.data, icon: uploadedFile },
      });

      if (this.pathKey && this.PathEnvVariable) {
        return addCorrectPathToObject(
          updated,
          this.pathKey!,
          this.PathEnvVariable!,
        );
      }
      return updated;
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }

  //! ===============================>   Delete One   <===============================
  async delete(
    args: Parameters<TDelegate['delete']>[0],
  ): Promise<ReturnType<TDelegate['delete']>> {
    try {
      const deleted = await this.delegate.delete(args);
      if (!deleted) {
        throw new HttpException('Entity Not found', 404);
      }
      if (this.pathKey && this.PathEnvVariable) {
        return addCorrectPathToObject(
          deleted,
          this.pathKey!,
          this.PathEnvVariable!,
        );
      }
      return deleted;
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }
}
