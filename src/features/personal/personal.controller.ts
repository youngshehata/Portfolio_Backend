import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalUpdateDto } from './dtos/personal-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerValidations } from '@common/constraints/multer.options';
import { Public } from '@common/decorators/public.decorator';
import { Response } from 'express';

@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  //! ================= GET PERSONAL DATA =================
  @Public()
  @Get('homepage')
  async getHomePage() {
    return await this.personalService.getHomePage();
  }
  //! ================= GET PERSONAL DATA =================
  @Public()
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

  //! ================= EDIT (IMAGE) =================
  @Put('image')
  @UseInterceptors(FileInterceptor('file', multerValidations.images))
  async editImage(@UploadedFile() file: Express.Multer.File) {
    return await this.personalService.editImage(file);
  }

  //! ================= DOWNLOAD CV =================
  @Public()
  @Get('cv')
  async downloadCV(@Res() res: Response) {
    const path = await this.personalService.getCvPath();
    return res.download(path);
  }
}
