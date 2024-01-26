import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/services';

@Injectable()
export class UsuarioMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usuarioService: UsuarioService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['authorization']) {
      this.atualizarUsuarioToken(
        req,
        req.headers['authorization'].replace('Bearer ', ''),
      );
    }
    next();
  }

  //Atualiza o usuário sempre que um novo token for gerado
  private async atualizarUsuarioToken(req: Request, token: string) {
    if (req.session['token'] !== token) {
      req.session['token'] = token;
      const { sub, name, email, email_verified } =
        this.jwtService.decode(token);
      if (email_verified) {
        this.usuarioService.replace({
          nome: name,
          email: email,
          userId: sub,
        });
      }
    }
  }
}
