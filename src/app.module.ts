import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SkillsModule } from './features/skills/skills.module';
import { PrismaService } from 'prisma/prisma.service';
import { LogsModule } from './features/logs/logs.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PersonalModule } from './features/personal/personal.module';
import { UploadService } from '@common/services/upload.service';
import { LogAndFormatInterceptor } from '@common/interceptors/logAndFormat-interceptor/logAndFormat.interceptor';
import { ContactsModule } from './features/contacts/contacts.module';
import { ProjectsModule } from './features/projects/projects.module';
import { ExperiencesModule } from './features/experiences/experiences.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SkillsModule,
    LogsModule,
    PersonalModule,
    ContactsModule,
    ProjectsModule,
    ExperiencesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_INTERCEPTOR, useClass: LogAndFormatInterceptor },
    UploadService,
  ],
})
export class AppModule {}
