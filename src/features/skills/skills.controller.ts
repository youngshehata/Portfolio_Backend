import {
  Body,
  Controller,
  Get,
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
  //! ============================================= EDIT with ICON =============================================
  @Put('/icon/:id')
  @UseInterceptors(FileInterceptor('file', multerValidations))
  async updateIcon(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
    @Body('name') name: string,
    @Body('showOnPortfolio') showOnPortfolio: boolean,
  ) {
    const data: Record<string, any> = {};
    if (file) data.icon = file.filename;
    if (name) data.name = name;
    if (typeof showOnPortfolio !== 'undefined')
      data.showOnPortfolio = showOnPortfolio;

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
