import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { LivroHistoricoUsuarioService } from 'src/services';

@Controller({
  path: 'livro-historico-usuario',
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
