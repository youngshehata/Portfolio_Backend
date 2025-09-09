import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SkillsModule } from './features/skills/skills.module';
import { PrismaService } from 'prisma/prisma.service';
import { LogsModule } from './features/logs/logs.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PersonalModule } from './features/personal/personal.module';
import { UploadService } from '@common/services/upload.service';
import { LogAndFormatInterceptor } from '@common/interceptors/logAndFormat-interceptor/logAndFormat.interceptor';
import { ContactsModule } from './features/contacts/contacts.module';
import { ProjectsModule } from './features/projects/projects.module';
import { ExperiencesModule } from './features/experiences/experiences.module';
import { MessagesModule } from './features/messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    SkillsModule,
    LogsModule,
    PersonalModule,
    ContactsModule,
    ProjectsModule,
    ExperiencesModule,
    MessagesModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UploadService,
    { provide: APP_INTERCEPTOR, useClass: LogAndFormatInterceptor },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
