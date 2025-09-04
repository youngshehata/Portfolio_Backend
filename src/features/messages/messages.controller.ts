import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto, UpdateMessageDto } from './dtos/message.dto';
import { PaginationFilter } from '@common/types/pagination.dto';
import { Public } from '@common/decorators/public.decorator';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  //! ================================================= FIND MANY =================================================
  @Get('/many')
  async findMany(@Query() query: PaginationFilter) {
    return await this.messagesService.findMany(query);
  }
  //! ================================================= FIND ONE =================================================
  @Get('/one/:id')
  async findOne(@Param('id') id: string) {
    if (!id) throw new HttpException('id is required', 400);
    return await this.messagesService.findOne(+id);
  }
  //! ================================================= CREATE =================================================
  @Public()
  @Post()
  async create(@Body() data: CreateMessageDto) {
    return await this.messagesService.create(data);
  }

  //! ================================================= EDIT =================================================
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateMessageDto) {
    const updated = await this.messagesService.update(+id, data);
    return updated;
  }
  //! ================================================= DELETE =================================================
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const updated = await this.messagesService.delete(+id);
    return updated;
  }
}
