import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { TagService } from '../../services';

@Controller({
  path: 'tags',
})
export class TagController {
  constructor(private readonly service: TagService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<any[]> {
    return this.service.getAll();
  }
}
