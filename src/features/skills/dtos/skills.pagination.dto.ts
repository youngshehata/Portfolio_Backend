import { PaginationFilter } from '@common/types/pagination.dto';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SkillsPaginationDto extends PaginationFilter {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showOnPortfolio?: boolean;

  @IsString()
  @IsOptional()
  @MinLength(2, {
    message: 'At least 2 character needs to be provided for search',
  })
  @MaxLength(200, {
    message: 'Seach value cannot exceed 200 characters',
  })
  search: string;
}
