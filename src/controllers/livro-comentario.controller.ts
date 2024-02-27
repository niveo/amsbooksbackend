import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { LivroComentarioInputDto } from '../models/dtos';
import { LivroComentarioService } from '../services';

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
    return this.service.create(livroComentarioInputDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.service.delete(id);
  }

  /**
   * Obterm o id do comentario do usuario em um livro
   * @param livroId
   * @returns
   */
  @Get('/comentarioidusuario')
  @HttpCode(HttpStatus.OK)
  async getComentarioIdLivroUsuario(
    @Query('livroId', ParseIntPipe) livroId: number,
  ): Promise<number> {
    return (await this.service.getComentarioIdLivroUsuario(livroId))?.id;
  }
}
