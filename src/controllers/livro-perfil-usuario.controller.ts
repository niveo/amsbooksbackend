import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LivroPerfilUsuarioService } from '../services';
import { LivroPerfilUsuarioInputDto } from '../models/dtos';
import { JwtAuthGuard } from '../authorization/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'livros_perfil_usuarios',
})
export class LivroPerfilUsuarioController {
  constructor(
    private readonly livroPerfilUsuarioService: LivroPerfilUsuarioService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  get(@Query('livroId', ParseIntPipe) livroId: number): Promise<any> {
    return this.livroPerfilUsuarioService.get(livroId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  upsert(@Body() value: LivroPerfilUsuarioInputDto) {
    return this.livroPerfilUsuarioService.upsert(value);
  }
}
