import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { LivroComentarioInputDto } from 'src/models/dtos';
import { LivroComentarioService } from 'src/services';

@Controller({
  path: 'livros_comentarios',
})
export class LivroComentarioController {
  constructor(private readonly service: LivroComentarioService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(@Query('livroId', ParseIntPipe) livroId: number): Promise<any> {
    return this.service.getComentariosLivro(livroId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() livroComentarioInputDto: LivroComentarioInputDto) {
    this.service.create(livroComentarioInputDto);
  }
}
