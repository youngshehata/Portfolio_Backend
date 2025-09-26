import { Injectable, OnModuleInit } from '@nestjs/common';
import { seederToData } from '@common/helpers/seeder-to-data';
import { PaginationFilter } from '@common/types/pagination.dto';
import { ContactsRepo } from './contacts.repo';
import { CreateContactDto, UpdateContactDto } from './dtos/contact.dto';

@Injectable()
export class ContactsService implements OnModuleInit {
  constructor(private readonly contactRepo: ContactsRepo) {}

  //! ================================================= SEEDING =================================================
  async onModuleInit() {
    const data = await seederToData<CreateContactDto>('contacts');
    // Check if contacts already seeded
    const existing = await this.contactRepo.findMany();
    if (existing.data.length === 0) {
      console.log(`Seeding ${data.length} contacts...`);

      // Insert all records
      for (const contact of data) {
        await this.contactRepo.create({
          data: {
            name: contact.name,
            value: contact.value,
            icon: contact.icon,
            showOnContact: contact.showOnContact,
            showOnHome: contact.showOnHome,
          },
        });
      }

      console.log('Contacts were successfully seeded');
    }
  }

  //! ================================================= Find Many =================================================
  async findMany(query: PaginationFilter) {
    const data = await this.contactRepo.findMany(
      {},
      query.pageSize,
      query.page,
    );
    return data;
  }
  //! ================================================= Find One =================================================
  async findOne(id: number) {
    const data = await this.contactRepo.findOne({ where: { id } });
    return data;
  }

  //! ================================================= CREATE =================================================
  async create(data: CreateContactDto) {
    return await this.contactRepo.create({ data });
  }

  //! ================================================= UPDATE =================================================
  async update(id: number, data: UpdateContactDto) {
    const updatedContact = await this.contactRepo.updateOne({
      where: { id },
      data,
    });
    return updatedContact;
  }

  //! ================================================= UPDATE WITH ICON =================================================
  async updateWithIcon(args: any, file: Express.Multer.File, type: string) {
    const oldFileToDelete = await this.contactRepo.findOne({
      where: { id: args.where.id },
    });

    const updated = await this.contactRepo.updateWithIcon(
      args,
      file,
      type,
      type,
      oldFileToDelete?.icon ? `${type}/${oldFileToDelete.icon}` : null,
      'Icon',
    );
    return updated;
  }

  //! ================================================= DELETE =================================================
  async delete(id: number) {
    return await this.contactRepo.delete({ where: { id } });
  }
}
