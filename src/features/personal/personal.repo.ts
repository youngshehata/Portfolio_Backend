import { AbstractRepo } from '@common/abstracts/abstract.repo';
import {
  CONTACTS_IMAGES_PATH,
  PERSONAL_IMAGES_PATH,
  SKILLS_IMAGES_PATH,
} from '@common/constraints/images.paths';
import { addCorrectPathToObject } from '@common/helpers/add-correct-path';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PersonalRepo extends AbstractRepo<PrismaService['personal']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.personal);
  }

  //! ================= GET PERSONAL DATA =================
  async getPersonalData() {
    const data = await this.findMany({}, 10, 1);
    return addCorrectPathToObject(data.data[0], 'image', PERSONAL_IMAGES_PATH);
  }

  //! ================= GET HOME PAGE =================
  async getHomePage() {
    // ============> Personal Data
    const personal = await this.getPersonalData();

    const withCorrectPDF = addCorrectPathToObject(
      personal,
      'cv',
      PERSONAL_IMAGES_PATH,
    );

    // ========================> Skills
    const skills = await this.prisma.skills.findMany({
      where: { showOnPortfolio: true },
    });

    // ========================> Contacts
    const contacts = await this.prisma.contacts.findMany({
      where: { showOnHome: true },
    });

    return {
      personal: withCorrectPDF,
      skills: skills.map((skill) => {
        return addCorrectPathToObject(skill, 'icon', SKILLS_IMAGES_PATH);
      }),
      contacts: contacts.map((contact) => {
        return addCorrectPathToObject(contact, 'icon', CONTACTS_IMAGES_PATH);
      }),
    };
  }
}
