import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto, UpdateSkillDto } from './dtos/skill.dto';
import { PaginationFilter } from '@common/types/pagination.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  //! ================================================= FIND MANY =================================================
  @Get('/find')
  async findMany(@Query() query: PaginationFilter) {
    return await this.skillsService.findMany(query);
  }
  //! ================================================= CREATE =================================================
  @Post()
  async create(@Body() data: CreateSkillDto) {
    return await this.skillsService.create(data);
  }

  //! ================================================= EDIT =================================================
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateSkillDto) {
    const updated = await this.skillsService.update(+id, data);
    return updated;
  }
}
