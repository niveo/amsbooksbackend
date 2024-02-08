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
  UseGuards,
} from '@nestjs/common';
import { AutorService } from '../../services';
import { AutorInputDto } from '../../models/dtos';
import { JwtAuthGuard } from 'src/authorization/jwt-auth.guard';

@Controller({
  path: 'autor',
})
export class AutorController {
  constructor(private readonly service: AutorService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/autorusuario')
  @HttpCode(HttpStatus.OK)
  obterAutorUsuario(): Promise<any> {
    return this.service.obterAutorUsuario();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() autorInputDto: AutorInputDto) {
    return this.service.create(autorInputDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/createWithUser')
  @HttpCode(HttpStatus.OK)
  createWithUser(@Body() autorInputDto: AutorInputDto) {
    return this.service.createWithUser(autorInputDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() autorInputDto: AutorInputDto,
  ): Promise<number> {
    return this.service.update(id, autorInputDto);
  }
}
