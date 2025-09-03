import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from '@common/services/upload.service';
import { MessagesRepo } from './messages.repo';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, MessagesRepo, UploadService],
})
export class MessagesModule {}
