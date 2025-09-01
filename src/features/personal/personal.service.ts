import { Injectable, OnModuleInit } from '@nestjs/common';
import { PersonalRepo } from './personal.repo';
import { logInvalidPersonalData } from './helpers/invalid-personal-data';
import { defaultPersonalData } from './helpers/default-personal-data';
import { PersonalUpdateDto } from './dtos/personal-update.dto';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class PersonalService implements OnModuleInit {
  constructor(
    private readonly personalRepo: PersonalRepo,
    private readonly loggingService: LogsService,
  ) {}

  //! ================= ON MODULE INIT =================
  async onModuleInit() {
    await this.validatePersonal();
    await this.seedDefaultPersonalData();
  }

  //! ================= VALIDATE PERSONAL TABLE HAS ONLY ONE RECORD =================
  async validatePersonal() {
    const data = await this.personalRepo.findMany({}, 10, 1);
    if (data.length > 1) {
      logInvalidPersonalData();
      process.exit();
    }
    return true;
  }

  //! ================= SEED DEFAULT PERSONAL =================
  async seedDefaultPersonalData() {
    const alreadySeeded = await this.personalRepo.findMany({}, 10, 1);
    if (alreadySeeded.length === 0) {
      await this.personalRepo.create({ data: defaultPersonalData });
    }
    await this.loggingService.createLog(
      'Default personal data were successfully seeded',
      'SYSTEM',
    );
    return true;
  }

  //! ================= GET PERSONAL DATA =================
  async getPersonalData() {
    return await this.personalRepo.getPersonalData();
  }

  //! ================= UPDATE PERSONAL DATA =================
  async editPersonalData(data: PersonalUpdateDto) {
    return await this.personalRepo.updateOne({ where: { id: 1 }, data });
  }
}
