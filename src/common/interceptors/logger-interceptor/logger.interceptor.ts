import { TResponse } from '@common/types/response.type';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, from, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { LogsService } from 'src/features/logs/logs.service';
import { polishLog } from '@common/helpers/polish-log';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, ip } = request;

    return next.handle().pipe(
      mergeMap((controllerResponse) =>
        from(
          (async () => {
            // Format response to TResponse
            const formattedResponse: TResponse = {
              data: controllerResponse || null,
              message: response.statusMessage || 'Success',
              statusCode: response.statusCode,
            };

            // Log only non-GET methods
            if (method !== 'GET') {
              await this.loggingService.createLog(
                polishLog(method, url, controllerResponse),
                response.statusCode < 400 ? 'INFO' : 'ERROR',
                ip,
              );
            }

            return formattedResponse;
          })(),
        ),
      ),
      catchError((err) =>
        from(
          (async () => {
            await this.loggingService.createLog(
              `Error on ${method} ${url}: ${err.message}`,
              'ERROR',
              ip,
            );
            return throwError(() => err);
          })(),
        ),
      ),
    );
  }

  /**
   * ✅ Type guard for TResponse check
   */
  private isTResponse(obj: any): obj is TResponse {
    return (
      obj &&
      typeof obj === 'object' &&
      'statusCode' in obj &&
      'message' in obj &&
      'data' in obj
    );
  }
}
