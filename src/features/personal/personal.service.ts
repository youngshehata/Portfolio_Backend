import { Injectable } from '@nestjs/common';
import { PersonalRepo } from './personal.repo';
import { logInvalidPersonalData } from './helpers/invalid-personal-data';

@Injectable()
export class PersonalService {
  constructor(private readonly personalRepo: PersonalRepo) {}

  //! ================= VALIDATE PERSONAL TABLE HAS ONLY ONE RECORD =================
  async validatePersonal() {
    const data = await this.personalRepo.findMany({}, 10, 1);
    if (data.length > 1) {
      logInvalidPersonalData();
      process.exit();
    }
    return true;
  }
}
