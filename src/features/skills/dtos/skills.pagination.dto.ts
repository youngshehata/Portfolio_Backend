import { PaginationFilter } from '@common/types/pagination.dto';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class SkillsPaginationDto extends PaginationFilter {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showOnPortfolio?: boolean;
}
