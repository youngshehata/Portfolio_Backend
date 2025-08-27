import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'colors';
import { GlobalExceptionsRecorderFilter } from './common/filters/global-exceptions-recorder.filter';
import { PrismaService } from 'prisma/prisma.service';

async function bootstrap() {
  //! Password is a must , therefore it should be set
  const password = process.env.PASSWORD;
  if (!password) {
    console.log(
      `Please set the 'PASSWORD' environment variable.`.bgRed.white.bold,
    );
    process.exit(1);
  }
  //! ==============================================

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new GlobalExceptionsRecorderFilter(app.get(PrismaService)),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
