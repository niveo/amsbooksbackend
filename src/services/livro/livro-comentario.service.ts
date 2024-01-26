import { LivroService, UsuarioService } from 'src/services';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LivroComentario } from 'src/entities';
import { Repository } from 'typeorm';
import { LivroComentarioInputDto } from 'src/models/dtos';

@Injectable()
export class LivroComentarioService {
  constructor(
    @Inject(forwardRef(() => LivroService))
    private readonly livroService: LivroService,
    private readonly usuarioService: UsuarioService,

    @InjectRepository(LivroComentario)
    private readonly repository: Repository<LivroComentario>,
  ) {}

  async create(comentarioInput: LivroComentarioInputDto) {
    const livro = await this.livroService.findOneOrFail(
      comentarioInput.livroId,
    );
    const usuario = await this.usuarioService.findOneOrFail(
      comentarioInput.usuarioId,
    );
    const comentario = new LivroComentario();
    comentario.livro = livro;
    comentario.usuario = usuario;
    comentario.texto = comentarioInput.texto;
    comentario.rate = comentarioInput.rate;
    comentario.displayTime = new Date();
    return this.repository.insert(comentario);
  }

  getComentariosLivro(livroId: number): Promise<any[]> {
    return this.repository
      .createQueryBuilder('livroComentario')
      .select()
      .where('livroComentario.livroId = :livroId', { livroId: livroId })
      .innerJoinAndSelect('livroComentario.usuario', 'usuario')
      .limit(10)
      .orderBy('livroComentario.displayTime', 'DESC')
      .getRawMany();
  }
}
