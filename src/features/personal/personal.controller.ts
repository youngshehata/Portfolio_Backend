import {
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalUpdateDto } from './dtos/personal-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerValidations } from '@common/constraints/multer.options';

@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  //! ================= GET PERSONAL DATA =================
  @Get('data')
  async getPersonalData() {
    return await this.personalService.getPersonalData();
  }

  //! ================= EDIT (NAME || TITLE || ABOUT) =================
  @Patch('edit')
  async editPersonalData(@Body() body: PersonalUpdateDto) {
    return await this.personalService.editPersonalData(body);
  }

  //! ================= EDIT (CV) =================
  @Put('cv')
  @UseInterceptors(FileInterceptor('file', multerValidations.documents))
  async editCV(@UploadedFile() file: Express.Multer.File) {
    return await this.personalService.editCV(file);
  }
}
