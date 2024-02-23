import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Livro } from '../entities';
import { Repository } from 'typeorm';
import { LivroPerfilUsuarioService } from './livro-perfil-usuario.service';
import { ColecaoLivroVinculoService } from './colecao-livro-vinculo.service';
import { ColecaoLivroService } from './colecao-livro.service';

@Injectable()
export class LivroService {
  constructor(
    @InjectRepository(Livro)
    private readonly repository: Repository<Livro>,

    private readonly livroPerfilUsuarioService: LivroPerfilUsuarioService,

    private readonly colecaoLivroService: ColecaoLivroService,
  ) {}

  async getAllBasico(
    pagesize: number,
    page: number,
    params: any = null,
  ): Promise<any> {
    const qb = this.repository.createQueryBuilder('livro');

    qb.select([
      'livro.id',
      'livro.titulo',
      'autor.nome',
      'livro.identificador',
    ]);
    qb.innerJoin('livro.autor', 'autor');
    qb.where('1 = 1');

    if (params) {
      const obParams = JSON.parse(params);
      if (obParams['categoria']) {
        qb.leftJoin('livro.categoria', 'categoria');
        qb.andWhere('categoria.id  = :categoridId', {
          categoridId: obParams['categoria'],
        });
      }
      if (obParams['tag']) {
        qb.innerJoin('livro.tags', 'tags', 'tags.id = :idTag', {
          idTag: obParams['tag'],
        });
      }
      if (obParams['leitura']) {
        const livrosIds = await this.livroPerfilUsuarioService.obterLivrosIds(
          obParams['leitura'],
        );
        qb.whereInIds(livrosIds);
      }
      if (obParams['colecao']) {
        const livrosIds = await this.colecaoLivroService.obterLivrosIds(
          obParams['colecao'],
        );
        qb.whereInIds(livrosIds);
      }
    }

    //console.log(qb.getSql());

    qb.cache(true);

    qb.take(pagesize);

    qb.skip(pagesize * page);

    const rs = await qb.getManyAndCount();

    return { results: rs[0], count: rs[1] };
  }

  getId(id: number): Promise<any> {
    return this.repository
      .createQueryBuilder('livros')

      .select([
        'livros.id',
        'livros.identificador',
        'livros.descritivo',
        'livros.titulo',
        'autor.nome',
        'categoria.id',
        'categoria.nome',
        'idioma.nome',
      ])

      .leftJoinAndSelect('livros.tags', 'tags')
      .leftJoin('livros.categoria', 'categoria')
      .leftJoin('livros.idioma', 'idioma')
      .leftJoin('livros.autor', 'autor')

      .where('livros.id = :id', { id: id })
      .cache(true)
      .getOneOrFail();
  }

  findOneOrFail(id: number) {
    return this.repository.findOneOrFail({
      where: {
        id: id,
      },
    });
  }

  getAll(): Promise<Livro[]> {
    return this.repository.find({
      cache: true,
    });
  }

  salvar(autor: Livro) {
    return this.repository.save(autor);
  }
}
