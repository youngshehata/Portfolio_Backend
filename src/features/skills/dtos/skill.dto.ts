import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSkillDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  icon?: string;

  @IsOptional()
  @IsBoolean()
  showOnPortfolio?: boolean;
}

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}
