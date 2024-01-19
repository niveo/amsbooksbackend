import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LivroService } from '../../services/livro/livro.service';

@Controller({
  path: 'livros',
})
export class LivroController {
  constructor(private readonly service: LivroService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<any[]> {
    return this.service.getAllBasico();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getId(@Param('id', ParseIntPipe) id: number): Promise<any[]> {
    return this.service.getId(id);
  }
}
