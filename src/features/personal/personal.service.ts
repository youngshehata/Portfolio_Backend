import { Injectable, OnModuleInit } from '@nestjs/common';
import { PersonalRepo } from './personal.repo';
import { logInvalidPersonalData } from './helpers/invalid-personal-data';
import { defaultPersonalData } from './helpers/default-personal-data';
import { PersonalUpdateDto } from './dtos/personal-update.dto';
import { LogsService } from '../logs/logs.service';
import { UploadService } from '@common/services/upload.service';
import * as path from 'path';

@Injectable()
export class PersonalService implements OnModuleInit {
  constructor(
    private readonly personalRepo: PersonalRepo,
    private readonly loggingService: LogsService,
    private readonly uploadService: UploadService,
  ) {}

  //! ================= ON MODULE INIT =================
  async onModuleInit() {
    await this.validatePersonal();
    await this.seedDefaultPersonalData();
  }

  //! ================= VALIDATE PERSONAL TABLE HAS ONLY ONE RECORD =================
  async validatePersonal() {
    const data = await this.personalRepo.findMany({}, 10, 1);
    if (data.data.length > 1) {
      logInvalidPersonalData();
      process.exit();
    }
    return true;
  }

  //! ================= SEED DEFAULT PERSONAL =================
  async seedDefaultPersonalData() {
    const alreadySeeded = await this.personalRepo.findMany({}, 10, 1);
    if (alreadySeeded.data.length === 0) {
      await this.personalRepo.create({ data: defaultPersonalData });
    } else {
      return true;
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

  //! ================= GET HOME PAGE =================
  async getHomePage() {
    return await this.personalRepo.getHomePage();
  }

  //! ================= UPDATE PERSONAL DATA =================
  async editPersonalData(data: PersonalUpdateDto) {
    return await this.personalRepo.updateOne({ where: { id: 1 }, data });
  }

  //! ================= UPDATE CV =================
  async editCV(file: Express.Multer.File) {
    const oldCv = (await this.personalRepo.getPersonalData()).cv;
    const uploaded = await this.uploadService.uploadFile(
      file,
      'Document',
      'personal',
      `personal/${oldCv}`,
    );
    return await this.personalRepo.updateOne({
      where: { id: 1 },
      data: { cv: uploaded },
    });
  }

  //! ================= UPDATE IMAGE =================
  async editImage(file: Express.Multer.File) {
    const oldImage = (await this.personalRepo.getPersonalData()).image;
    const uploaded = await this.uploadService.uploadFile(
      file,
      'Image',
      'personal',
      `personal/${oldImage}`,
      'Image',
    );
    return await this.personalRepo.updateOne({
      where: { id: 1 },
      data: { image: uploaded },
    });
  }

  //! ================= DOWNLOAD CV =================
  async getCvPath() {
    const data = (await this.getPersonalData()).cv;
    const filePath = path.join(process.cwd(), 'public/personal', data);
    console.log(filePath);

    return filePath;
  }
}
