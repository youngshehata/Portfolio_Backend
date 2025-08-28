import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto, UpdateSkillDto } from './dtos/skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(@Body() data: CreateSkillDto) {
    return this.skillsService.create(data);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() data: UpdateSkillDto) {
    return this.skillsService.update(id, data);
  }
}
