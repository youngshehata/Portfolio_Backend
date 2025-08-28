export abstract class AbstractRepo<
  TDelegate extends {
    findMany: (...args: any[]) => any;
    create: (...args: any[]) => any;
    update: (...args: any[]) => any;
    delete: (...args: any[]) => any;
  },
> {
  constructor(protected readonly delegate: TDelegate) {}

  findMany(args?: Parameters<TDelegate['findMany']>[0]) {
    return this.delegate.findMany(args);
  }

  create(args: Parameters<TDelegate['create']>[0]) {
    return this.delegate.create(args);
  }

  updateOne(args: Parameters<TDelegate['update']>[0]) {
    return this.delegate.update(args)[0];
  }

  update(args: Parameters<TDelegate['update']>[0]) {
    return this.delegate.update(args);
  }

  delete(args: Parameters<TDelegate['delete']>[0]) {
    return this.delegate.delete(args);
  }
}
