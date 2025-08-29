import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from '@common/constraints/constraints.common';
import { HttpException } from '@nestjs/common';

export abstract class AbstractRepo<
  TDelegate extends {
    findMany: (...args: any[]) => any;
    create: (...args: any[]) => any;
    update: (...args: any[]) => any;
    delete: (...args: any[]) => any;
  },
> {
  constructor(protected readonly delegate: TDelegate) {}

  //! ===============================>   FindMany   <===============================
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
