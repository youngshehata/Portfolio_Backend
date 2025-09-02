import { IsNotEmpty, IsPositive } from 'class-validator';

export class ProjectSkillDto {
  @IsNotEmpty()
  @IsPositive()
  projectId: number;
  @IsNotEmpty()
  @IsPositive()
  skillId: number;
}
