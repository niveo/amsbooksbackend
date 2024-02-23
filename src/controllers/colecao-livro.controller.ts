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
  Put,
  UseGuards,
} from '@nestjs/common';
import { ColecaoLivroInputDto } from '../models/dtos';
import { ColecaoLivroService } from '../services/colecao-livro.service';
import { JwtAuthGuard } from 'src/authorization/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'colecoes_livros',
})
export class ColecaoLivroController {
  constructor(private readonly service: ColecaoLivroService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<any[]> {
    return this.service.getAll();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() colecaoLivroInputDto: ColecaoLivroInputDto) {
    return this.service.create(colecaoLivroInputDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() colecaoLivroInputDto: ColecaoLivroInputDto,
  ) {
    return this.service.update(id, colecaoLivroInputDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.service.delete(id);
  }
}
