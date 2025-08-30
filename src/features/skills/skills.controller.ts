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
import { SkillsService } from './skills.service';
import { CreateSkillDto, UpdateSkillDto } from './dtos/skill.dto';
import { PaginationFilter } from '@common/types/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerValidations } from '@common/constraints/multer.options';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  //! ================================================= FIND MANY =================================================
  @Get('/many')
  async findMany(@Query() query: PaginationFilter) {
    return await this.skillsService.findMany(query);
  }
  //! ================================================= FIND ONE =================================================
  @Get('/one/:id')
  async findOne(@Param('id') id: string) {
    if (!id) throw new HttpException('id is required', 400);
    return await this.skillsService.findOne(+id);
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
  //! ================================================= DELETE =================================================
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const updated = await this.skillsService.delete(+id);
    return updated;
  }
  //! ============================================= EDIT with ICON =============================================
  @Put('/icon/:id')
  @UseInterceptors(FileInterceptor('file', multerValidations))
  async updateIcon(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
    @Body() body: Omit<UpdateSkillDto, 'icon'>,
  ) {
    const data: Record<string, any> = {};
    if (file) data.icon = file.filename;
    if (body.name) data.name = body.name;
    if (typeof body.showOnPortfolio !== 'undefined')
      data.showOnPortfolio = body.showOnPortfolio;

    const updated = await this.skillsService.updateWithIcon(
      {
        where: { id: Number(id) },
        data,
      },
      file,
      type,
    );

    return updated;
  }
}
