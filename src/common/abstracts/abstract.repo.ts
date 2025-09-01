import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from '@common/constraints/constraints.common';
import { HttpException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

export abstract class AbstractRepo<
  TDelegate extends {
    findMany: (...args: any[]) => any;
    create: (...args: any[]) => any;
    update: (...args: any[]) => any;
    delete: (...args: any[]) => any;
    findUnique: (...args: any[]) => any;
  },
> {
  constructor(protected readonly delegate: TDelegate) {}

  //! ===============================>   FIND MANY   <===============================
  async findMany(
    args?: Parameters<TDelegate['findMany']>[0],
    pageSize: number = DEFAULT_PAGE_SIZE,
    pageNumber: number = DEFAULT_PAGE_NUMBER,
  ): Promise<ReturnType<TDelegate['findMany']>> {
    try {
      return await this.delegate.findMany({
        ...args,
        take: Number(pageSize),
        skip: Number((pageNumber - 1) * pageSize),
      });
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
      // return this.delegate.findUnique(args);
      const found = await this.delegate.findUnique(args);
      if (!found) {
        throw new HttpException('Entity Not found', 404);
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
      return await this.delegate.create(args);
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
    imageSize?: 'icon' | 'image',
  ): Promise<ReturnType<TDelegate['update']>> {
    let filePath: string | null = null;

    const IMAGE_CONFIG = {
      icon: { width: 64, height: 64, quality: 80 },
      image: { width: 800, height: 600, quality: 100 },
    };

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

      const { width, height, quality } = IMAGE_CONFIG[imageSize];

      const uploadDir = path.join(process.cwd(), 'public', type);
      await this.ensureDirectory(uploadDir);

      const ext = path.extname(file.originalname).toLowerCase();
      const baseName = path.parse(file.originalname).name;
      const fileName = `${Date.now()}-${baseName}${ext === '.svg' || ext === '.ico' ? ext : '.webp'}`;
      filePath = path.join(uploadDir, fileName);

      if (ext === '.svg' || ext === '.ico') {
        // Keep original for SVG/ICO
        await fs.promises.writeFile(filePath, file.buffer);
      } else {
        const processedImageBuffer = await sharp(file.buffer)
          .resize(width, height, { fit: 'inside' })
          .webp({ quality, alphaQuality: 100, effort: 4 })
          .toBuffer();
        await fs.promises.writeFile(filePath, processedImageBuffer);
      }

      const oldRecord = await this.delegate.findUnique({ where: args.where });

      const updated = await this.delegate.update({
        ...args,
        data: { ...args.data, icon: fileName },
      });

      if (oldRecord?.icon) {
        await this.safeDelete(
          path.join(process.cwd(), 'public', type, oldRecord.icon),
        );
      }

      return updated;
    } catch (error) {
      if (filePath) await this.safeDelete(filePath);
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }

  private async ensureDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
  }

  private async safeDelete(file: string) {
    if (fs.existsSync(file)) {
      await fs.promises.unlink(file);
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
      return deleted;
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }
}
