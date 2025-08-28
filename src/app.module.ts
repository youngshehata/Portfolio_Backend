import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SkillsModule } from './features/skills/skills.module';
import { PrismaService } from 'prisma/prisma.service';
import { LogsModule } from './features/logs/logs.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from '@common/interceptors/logger-interceptor/logger.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SkillsModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
  ],
})
export class AppModule {}
