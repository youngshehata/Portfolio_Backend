import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TResponse } from '@common/types/response.type';
import { classValidatorFormatter } from './class-validator-formatter';

@Catch()
export class GlobalExceptionsRecorderFilter implements ExceptionFilter {
  constructor(private readonly prisma: PrismaService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    let errorId = 'Undefined';

    if (status === 500) {
      // Log error to DB
      const errorRecord = await this.prisma.errors.create({
        data: {
          message: (exception as Error).message,
          path: request.url,
          method: request.method,
          stack: (exception as Error).stack,
          isHttp: exception instanceof HttpException ? true : false,
          ip: request.ip,
        },
      });
      errorId = errorRecord.id.toString();

      console.error(errorRecord);

      const serverResponse: TResponse = {
        data: null,
        message: (exception as Error).message,
        statusCode: status,
      };

      // ✅ Check before sending
      if (!response.headersSent) {
        response.status(status).send(serverResponse);
      } else {
        // optional: just log if already sent
        console.warn(
          `Headers already sent for ${request.url}. Skipping error response.`,
        );
      }
      return;
    } else {
      const isClassValidatorError = classValidatorFormatter(exception);
      if (isClassValidatorError && !response.headersSent) {
        return response.status(status).send(isClassValidatorError);
      }

      const serverResponse: TResponse = {
        data: null,
        message: (exception as Error).message,
        statusCode: status,
      };

      // ✅ Check before sending
      if (!response.headersSent) {
        response.status(status).send(serverResponse);
      } else {
        console.warn(
          `Headers already sent for ${request.url}. Skipping error response.`,
        );
      }
    }
  }
}
