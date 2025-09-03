import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { LogType } from 'src/features/logs/logs.types';

export class PaginationFilter {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  pageSize?: number;

  @IsOptional()
  @IsString()
  sort?: 'newest' | 'oldest';

  // for messages
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  isRead?: 0 | 1;

  // for logs
  @IsOptional()
  @IsString()
  type?: LogType;
}
