import { IsString } from 'class-validator';
import { UpdateSkillDto } from './skill.dto';

export class UpdateSkillWithIconDto extends UpdateSkillDto {
  @IsString()
  type: string;
}
