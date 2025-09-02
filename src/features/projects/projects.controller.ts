import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dtos/project.dto';
import { PaginationFilter } from '@common/types/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerValidations } from '@common/constraints/multer.options';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  //! ================================================= FIND MANY =================================================
  @Get('/many')
  async findMany(@Query() query: PaginationFilter) {
    return await this.projectsService.findMany(query);
  }
  //! ================================================= FIND ONE =================================================
  @Get('/one/:id')
  async findOne(@Param('id') id: string) {
    if (!id) throw new HttpException('id is required', 400);
    return await this.projectsService.findOne(+id);
  }
  //! ================================================= CREATE =================================================
  @Post()
  async create(@Body() data: CreateProjectDto) {
    return await this.projectsService.create(data);
  }

  //! ================================================= EDIT =================================================
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateProjectDto) {
    const updated = await this.projectsService.update(+id, data);
    return updated;
  }
  //! ================================================= DELETE =================================================
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const updated = await this.projectsService.delete(+id);
    return updated;
  }
}
