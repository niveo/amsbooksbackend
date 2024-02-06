import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AutorService } from '../../services';

@Controller({
  path: 'autor',
})
export class AutorController {
  constructor(private readonly service: AutorService) {}

  @Get('/autorusuario')
  @HttpCode(HttpStatus.OK)
  obterAutorUsuario(): Promise<any> {
    return this.service.obterAutorUsuario();
  }
}
