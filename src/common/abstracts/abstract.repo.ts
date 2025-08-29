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
  findMany(
    args?: Parameters<TDelegate['findMany']>[0],
    pageSize: number = DEFAULT_PAGE_SIZE,
    pageNumber: number = DEFAULT_PAGE_NUMBER,
  ): ReturnType<TDelegate['findMany']> {
    try {
      return this.delegate.findMany({
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
  findOne(
    args: Parameters<TDelegate['findUnique']>[0],
  ): ReturnType<TDelegate['findUnique']> {
    try {
      return this.delegate.findUnique(args);
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }

  //! ===============================>   Create   <===============================
  create(
    args: Parameters<TDelegate['create']>[0],
  ): ReturnType<TDelegate['create']> {
    try {
      return this.delegate.create(args);
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
    try {
      if (!file) {
        return await this.delegate.update(args);
      }

      if (!type) {
        throw new HttpException('Type is required when uploading an icon', 400);
      }

      const uploadDir = path.join(process.cwd(), 'public', type);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${path.parse(file.originalname).name}.webp`;
      filePath = path.join(uploadDir, fileName);

      const fileBuffer = Buffer.from(file.buffer);

      const processedImageBuffer = await sharp(fileBuffer)
        .resize(
          imageSize === 'icon' ? 64 : 800,
          imageSize === 'icon' ? 64 : 600,
          { fit: 'inside' },
        )
        .webp({
          quality: imageSize === 'icon' ? 80 : 100,
          alphaQuality: 100,
          effort: 4,
        })
        .toBuffer();

      await fs.promises.writeFile(filePath, processedImageBuffer);

      const oldRecord = await this.delegate.findUnique({ where: args.where });

      const updated = await this.delegate.update({
        ...args,
        data: {
          ...args.data,
          icon: `${fileName}`,
        },
      });

      if (oldRecord?.icon) {
        const oldIconPath = path.join(
          process.cwd(),
          'public',
          type,
          oldRecord.icon,
        );
        if (fs.existsSync(oldIconPath)) {
          fs.unlinkSync(oldIconPath);
        }
      }

      return updated;
    } catch (error) {
      // on error delete file if uploaded
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }

  //! ===============================>   Delete One   <===============================
  delete(
    args: Parameters<TDelegate['delete']>[0],
  ): ReturnType<TDelegate['delete']> {
    try {
      return this.delegate.delete(args);
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }
}
