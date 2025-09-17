import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  @IsEmail()
  from: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20000)
  message: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
