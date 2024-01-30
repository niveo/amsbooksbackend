import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Livro } from '../../entities';
import { Repository } from 'typeorm';

@Injectable()
export class LivroService {
  constructor(
    @InjectRepository(Livro)
    private readonly repository: Repository<Livro>,
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
      'livro.capaUrl',
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
    }

    qb.cache(true);

    qb.take(pagesize);

    qb.skip(pagesize * page);

    const rs = await qb.getManyAndCount();

    return { results: rs[0], count: rs[1] };
  }

  async getAllBasico2(pagesize, page): Promise<any[]> {
    console.log(pagesize);
    console.log(page);

    const r1 = await this.repository
      .createQueryBuilder('livro')
      .select('livro.id', 'id')
      .addSelect('livro.titulo', 'titulo')
      .addSelect('livro.capaUrl', 'capaUrl')
      .addSelect('autor.nome', 'autor')
      .innerJoin('livro.autor', 'autor')
      .cache(true)
      //.limit(pagesize)
      .offset(page * pagesize)
      .getRawMany();

    console.log(r1);

    return r1; //Promise.all([...r1, ...r1, ...r1, ...r1, ...r1]);
  }

  getId(id: number): Promise<any> {
    return this.repository
      .createQueryBuilder('livros')

      .select([
        'livros.id',
        'livros.identificador',
        'livros.descritivo',
        'livros.titulo',
        'livros.capaUrl',
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
