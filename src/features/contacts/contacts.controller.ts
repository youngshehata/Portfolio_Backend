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
import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto } from './dtos/contact.dto';
import { PaginationFilter } from '@common/types/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerValidations } from '@common/constraints/multer.options';
import { Public } from '@common/decorators/public.decorator';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  //! ================================================= FIND MANY =================================================
  @Public()
  @Get('/many')
  async findMany(@Query() query: PaginationFilter) {
    return await this.contactsService.findMany(query);
  }
  //! ================================================= FIND ONE =================================================
  @Public()
  @Get('/one/:id')
  async findOne(@Param('id') id: string) {
    if (!id) throw new HttpException('id is required', 400);
    return await this.contactsService.findOne(+id);
  }
  //! ================================================= CREATE =================================================
  @Post()
  async create(@Body() data: CreateContactDto) {
    return await this.contactsService.create(data);
  }

  //! ================================================= EDIT =================================================
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateContactDto) {
    const updated = await this.contactsService.update(+id, data);
    return updated;
  }
  //! ================================================= DELETE =================================================
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const updated = await this.contactsService.delete(+id);
    return updated;
  }
  //! ============================================= EDIT with ICON =============================================
  @Put('/icon/:id')
  @UseInterceptors(FileInterceptor('file', multerValidations.images))
  async updateIcon(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
    @Body() body: Omit<UpdateContactDto, 'icon'>,
  ) {
    const data: Record<string, any> = {};
    if (file) data.icon = file.filename;
    if (body.name) data.name = body.name;
    if (body.value) data.value = body.value;
    if (typeof body.showOnContact !== 'undefined')
      data.showOnContact = body.showOnContact;
    if (typeof body.showOnHome !== 'undefined')
      data.showOnHome = body.showOnHome;

    const updated = await this.contactsService.updateWithIcon(
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
