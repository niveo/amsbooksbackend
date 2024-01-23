import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriaService } from '../../services';

@Controller({
  path: 'categorias',
})
export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<any[]> {
    return this.service.getAll();
  }
}
