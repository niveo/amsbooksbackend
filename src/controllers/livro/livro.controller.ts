import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { LivroService } from '../../services/livro/livro.service';
import { Livro } from '../../entities';

@Controller({
  path: 'livros',
})
export class LivroController {
  constructor(private readonly service: LivroService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<Livro[]> {
    return this.service.getAll();
  }
}
