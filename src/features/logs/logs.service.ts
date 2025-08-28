import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LOG_TYPES_SEEDER, LogType } from './logs.types';

@Injectable()
export class LogsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Seed Types
    let counter = 0;
    for (const type of LOG_TYPES_SEEDER) {
      const found = await this.prisma.logs_Types.findFirst({ where: { type } });
      if (!found) {
        await this.prisma.logs_Types.create({ data: { type } });
        counter++;
      }
    }
    if (counter === LOG_TYPES_SEEDER.length) {
      await this.createLog('Logs Types were successfully seeded', 'SYSTEM');
      console.log('Logs Types were successfully seeded');
    }
  }

  async createLog(text: string, type: LogType, ip?: string) {
    const typeRow = await this.prisma.logs_Types.findFirst({ where: { type } });
    if (!typeRow) {
      throw new Error('Type not found');
    }
    try {
      return await this.prisma.logs.create({
        data: { log: text, type: typeRow.id, ip },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
