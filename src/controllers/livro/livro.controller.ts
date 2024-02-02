import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { LivroService } from '../../services/livro/livro.service';

@Controller({
  path: 'livros',
})
export class LivroController {
  constructor(private readonly service: LivroService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(
    @Query('pagesize', ParseIntPipe) pagesize: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('params') params: string,
  ): Promise<any> {
    return this.service.getAllBasico(pagesize, page, params);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getId(@Param('id', ParseIntPipe) id: number): Promise<any[]> {
    return this.service.getId(id);
  }
}
