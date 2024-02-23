import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../authorization/jwt-auth.guard';
import { ColecaoLivroVinculoService } from '../services/colecao-livro-vinculo.service';
import { ColecaoLivroVinculoInputDto } from '../models/dtos/colecao-livro-vinculo-input.dto';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'colecoes_livros_vinculos',
})
export class ColecaoLivroVinculoController {
  constructor(private readonly service: ColecaoLivroVinculoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(@Query('livroId', ParseIntPipe) livroId: number): Promise<any[]> {
    return this.service.getAll(livroId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() colecaoLivroVinculoInputDto: ColecaoLivroVinculoInputDto) {
    return this.service.create(colecaoLivroVinculoInputDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  delete(
    @Body() colecaoLivroVinculoInputDto: ColecaoLivroVinculoInputDto,
  ): Promise<any> {
    return this.service.delete(colecaoLivroVinculoInputDto);
  }
}
