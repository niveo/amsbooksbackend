import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { LivroHistoricoUsuarioService } from '../services';

@Controller({
  path: 'livro_historico_usuario',
})
export class LivroHistoricoUsuarioController {
  constructor(
    private readonly livroHistoricoUsuarioService: LivroHistoricoUsuarioService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(@Query('livroId', ParseIntPipe) livroId: number): Promise<any> {
    return this.livroHistoricoUsuarioService.obterLivroHistoricoUsuario(
      livroId,
    );
  }
}
