import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1500)
  value: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  icon?: string;

  @IsOptional()
  @IsBoolean()
  showOnContact: boolean;

  @IsOptional()
  @IsBoolean()
  showOnHome: boolean;
}

export class UpdateContactDto extends PartialType(CreateContactDto) {}
