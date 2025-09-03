import { Injectable } from '@nestjs/common';
import { PaginationFilter } from '@common/types/pagination.dto';
import { MessagesRepo } from './messages.repo';
import { CreateMessageDto, UpdateMessageDto } from './dtos/message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly messageRepo: MessagesRepo) {}

  //! ================================================= Find Many =================================================
  async findMany(query: PaginationFilter) {
    const data = await this.messageRepo.findMany(
      {},
      query.pageSize,
      query.page,
    );
    return data;
  }
  //! ================================================= Find One =================================================
  async findOne(id: number) {
    const data = await this.messageRepo.findOne({ where: { id } });
    return data;
  }

  //! ================================================= CREATE =================================================
  async create(data: CreateMessageDto) {
    return await this.messageRepo.create({ data });
  }

  //! ================================================= UPDATE =================================================
  async update(id: number, data: UpdateMessageDto) {
    const updatedMessage = await this.messageRepo.updateOne({
      where: { id },
      data,
    });
    return updatedMessage;
  }

  //! ================================================= DELETE =================================================
  async delete(id: number) {
    return await this.messageRepo.delete({ where: { id } });
  }
}
