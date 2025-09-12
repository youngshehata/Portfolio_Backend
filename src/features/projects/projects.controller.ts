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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dtos/project.dto';
import { PaginationFilter } from '@common/types/pagination.dto';
import { ProjectSkillDto } from './dtos/project-skill.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerValidations } from '@common/constraints/multer.options';
import { Public } from '@common/decorators/public.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  //! ================================================= FIND MANY =================================================
  @Public()
  @Get('/many')
  async findMany(@Query() query: PaginationFilter) {
    return await this.projectsService.findManyProjects(query);
  }
  //! ================================================= FIND ONE =================================================
  @Public()
  @Get('/one/:id')
  async findOne(@Param('id') id: string) {
    if (!id) throw new HttpException('id is required', 400);
    return await this.projectsService.findOne(+id);
  }
  //! ====================================== FIND SKILLS FOR PROJECT ==========================================
  @Public()
  @Get('/skills/:id')
  async findSkills(@Param('id') id: string, @Query() query: PaginationFilter) {
    if (!id) throw new HttpException('id is required', 400);
    return await this.projectsService.findSkills(+id, query);
  }

  //! ================================================= CREATE =================================================
  @Post()
  async create(@Body() data: CreateProjectDto) {
    return await this.projectsService.create(data);
  }

  //! ============================================== ADD SKILL ==============================================
  @Post('skill')
  async createSkill(@Body() data: ProjectSkillDto) {
    return await this.projectsService.createSkill(data);
  }

  //! ============================================== DELETE SKILL ==============================================
  @Delete('skill/:id')
  async deleteSkill(@Param('id') id: string) {
    return await this.projectsService.deleteSkill(+id);
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

  //! =========================================== UPLOAD IMAGE ==============================================
  @Post('image/:id')
  @UseInterceptors(FileInterceptor('file', multerValidations.images))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return await this.projectsService.uploadImage(file, +id);
  }

  //! ====================================== FIND IMAGES FOR PROJECT ==========================================
  @Public()
  @Get('/images/:id')
  async findImages(@Param('id') id: string, @Query() query: PaginationFilter) {
    if (!id) throw new HttpException('id is required', 400);
    return await this.projectsService.findImages(+id, query);
  }

  //! ======================================== CHANGE IMAGE ORDER ==========================================
  @Patch('imageorder/:id')
  async changeImageOrder(
    @Param('id') imageID: string,
    @Query('type') type: string,
  ) {
    if (!type || (type !== 'increase' && type !== 'decrease'))
      throw new HttpException('type is required (increase or decrease)', 400);
    return await this.projectsService.changeImageOrder(+imageID, type);
  }
}
