import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Livro } from '../../entities';
import { Repository } from 'typeorm';
@Injectable()
export class LivroService {
  constructor(
    @InjectRepository(Livro)
    private repository: Repository<Livro>,
  ) {}

  async getAllBasico(): Promise<any[]> {
    const r1 = await this.repository
      .createQueryBuilder('livro')
      .select('livro.id', 'id')
      .addSelect('livro.titulo', 'titulo')
      .addSelect('autor.nome', 'autor')
      .innerJoin('livro.autor', 'autor')
      .cache(true)
      .getRawMany();

    return Promise.all([...r1, ...r1, ...r1, ...r1, ...r1]);
  }

  getId(id: number): Promise<any> {
    console.log(id);

    return this.repository
      .createQueryBuilder('livro')
      .where('livro.id = :id', { id: id })
      .leftJoinAndSelect('livro.tags', 'tags')
      .leftJoinAndSelect('livro.categoria', 'categoria')
      .leftJoinAndSelect('livro.idioma', 'idioma')
      .cache(true)
      .getOneOrFail();
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
