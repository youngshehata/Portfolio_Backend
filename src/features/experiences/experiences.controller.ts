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
import { ExperiencesService } from './experiences.service';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from './dtos/experience.dto';
import { PaginationFilter } from '@common/types/pagination.dto';
import { Public } from '@common/decorators/public.decorator';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  //! ================================================= FIND MANY =================================================
  @Public()
  @Get('/many')
  async findMany(@Query() query: PaginationFilter) {
    return await this.experiencesService.findMany(query);
  }
  //! ================================================= FIND ONE =================================================
  @Public()
  @Get('/one/:id')
  async findOne(@Param('id') id: string) {
    if (!id) throw new HttpException('id is required', 400);
    return await this.experiencesService.findOne(+id);
  }
  //! ================================================= CREATE =================================================
  @Post()
  async create(@Body() data: CreateExperienceDto) {
    return await this.experiencesService.create(data);
  }

  //! ================================================= EDIT =================================================
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateExperienceDto) {
    const updated = await this.experiencesService.update(+id, data);
    return updated;
  }
  //! ================================================= DELETE =================================================
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const updated = await this.experiencesService.delete(+id);
    return updated;
  }
}
