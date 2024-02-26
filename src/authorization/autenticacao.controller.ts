import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioService } from 'src/services';

@Controller({
  path: 'autenticacao',
})
export class AutenticacaoController {
  constructor(
    private readonly service: UsuarioService,
    private readonly authService: AuthService,
  ) {}

  @Post('/registrar')
  @HttpCode(HttpStatus.OK)
  async registrar(@Body() body: any): Promise<any> {
    const dataToken = this.authService.decodeToken(body.token);
    if (!dataToken) throw 'Nenhum token informado';
    await this.service.replace({
      nome: dataToken.name,
      email: dataToken.email,
      userId: dataToken.sub,
    });
    return true;
  }
}
