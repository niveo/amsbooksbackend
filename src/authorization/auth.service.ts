import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Gera um erro caso o token não esteja no header authorization
   * @param request
   * @returns { sub, name, email, email_verified }
   */
  getDataToken(request: Request): {
    sub: string;
    name: string;
    email: string;
    email_verified: boolean;
    token: string;
  } {
    console.log(
      request.method +
        ' ' +
        request.baseUrl +
        request.url +
        ' Autorizado: ' +
        String(!(request.headers.authorization === undefined)),
    );

    if (request.headers.authorization) {
      const token = request.headers.authorization.replace('Bearer ', '');
      const { sub, name, email, email_verified } =
        this.jwtService.decode(token);
      return { sub, name, email, email_verified, token };
    } else return null;
  }
}
