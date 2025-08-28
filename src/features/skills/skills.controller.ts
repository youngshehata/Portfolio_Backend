import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto, UpdateSkillDto } from './dtos/skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  async create(@Body() data: CreateSkillDto) {
    return await this.skillsService.create(data);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() data: UpdateSkillDto) {
    const updated = await this.skillsService.update(id, data);
    console.log('FIX THIS');
    console.log('FIX THIS');
    console.log('FIX THIS');
    console.log('FIX THIS');
    console.log('FIX THIS');
    console.log('FIX THIS');
    console.log('FIX THIS');
    console.log('FIX THIS');
    console.log('FIX THIS');
    console.log('FIX THIS');
    console.log('FIX THIS');
    return updated;
  }
}
