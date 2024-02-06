import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AutorService } from '../../services';
import { AutorInputDto } from 'src/models/dtos';

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

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() autorInputDto: AutorInputDto) {
    return this.service.create(autorInputDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() autorInputDto: AutorInputDto,
  ): Promise<number> {
    return this.service.update(id, autorInputDto);
  }
}
