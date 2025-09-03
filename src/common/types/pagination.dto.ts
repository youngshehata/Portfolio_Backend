import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  isRead?: 0 | 1;
}
