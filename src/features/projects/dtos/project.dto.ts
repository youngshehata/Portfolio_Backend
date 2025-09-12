import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100000)
  overview?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  url?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  github?: string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
