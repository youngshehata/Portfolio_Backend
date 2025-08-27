import { Controller, Post } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create() {
    return this.skillsService.create();
  }

  @Post('update')
  update() {
    return this.skillsService.update();
  }
}
