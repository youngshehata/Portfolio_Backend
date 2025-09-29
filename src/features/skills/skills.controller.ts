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
import { FileInterceptor } from '@nestjs/platform-express';
import { multerValidations } from '@common/constraints/multer.options';
import { Public } from '@common/decorators/public.decorator';
import { SkillsPaginationDto } from './dtos/skills.pagination.dto';
import { UpdateSkillWithIconDto } from './dtos/updateSkillWithIcon.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  //! ================================================= FIND MANY =================================================
  @Public()
  @Get('/many')
  async findMany(@Query() query: SkillsPaginationDto) {
    return await this.skillsService.findMany(query);
  }
  //! ================================================= FIND ONE =================================================
  @Public()
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
  @UseInterceptors(FileInterceptor('file', multerValidations.images))
  async updateIcon(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
    @Body() body: UpdateSkillWithIconDto,
  ) {
    const data: Record<string, any> = {};
    if (file) data.icon = file.filename;
    if (body.name) data.name = body.name;
    if (typeof body.showOnPortfolio !== 'undefined') {
      data.showOnPortfolio = body.showOnPortfolio;
    }

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
