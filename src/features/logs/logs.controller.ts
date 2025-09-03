import { Controller, Get, Query } from '@nestjs/common';
import { LogsService } from './logs.service';
import { PaginationFilter } from '@common/types/pagination.dto';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  //! ================================================= FIND MANY =================================================
  @Get()
  async findMany(@Query() query: PaginationFilter) {
    return await this.logsService.findMany(query);
  }
}
