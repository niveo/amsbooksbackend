import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from 'src/services';
import { AuthService } from 'src/authorization/auth.service';

@Injectable()
export class UsuarioMiddleware implements NestMiddleware {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly authService: AuthService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['authorization']) {
      this.atualizarUsuarioToken(req);
    }
    next();
  }

  //Atualiza o usuário sempre que um novo token for gerado
  private async atualizarUsuarioToken(req: Request) {
    const dataToken = this.authService.getDataToken(req);
    if (req.session['token'] !== 'dataToken.token') {
      req.session['token'] = dataToken.token;
      if (dataToken.email_verified) {
        const ret = await this.usuarioService.replace({
          nome: dataToken.name,
          email: dataToken.email,
          userId: dataToken.sub,
        });
        console.log(ret);
        
      }
    }
  }
}
