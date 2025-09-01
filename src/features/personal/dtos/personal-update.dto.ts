import { IsOptional, IsString, MinLength } from 'class-validator';

export class PersonalUpdateDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;
  @IsString()
  @MinLength(4)
  @IsOptional()
  about?: string;
}
