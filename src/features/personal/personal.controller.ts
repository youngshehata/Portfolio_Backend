import { Body, Controller, Get, Patch } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalUpdateDto } from './dtos/personal-update.dto';

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
}
