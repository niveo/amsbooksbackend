import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { LivroComentarioService } from './livro-comentario.service';

@Injectable()
export class LivroHistoricoUsuarioService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly livroComentarioService: LivroComentarioService,
  ) {}
  async obterLivroHistoricoUsuario(livroId: number): Promise<any> {
    const comentario =
      await this.livroComentarioService.getIdComentarioLivroUsuario(livroId);
    return {
      comentarioId: comentario?.id || null,
    };
  }
}
