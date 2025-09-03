import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateExperienceDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  challenge: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  solution: string;
}

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}
