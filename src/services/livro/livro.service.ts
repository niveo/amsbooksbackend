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

  getAll(): Promise<Livro[]> {
    return this.repository.find({
      cache: true,
    });
  }

  salvar(autor: Livro) {
    return this.repository.save(autor);
  }
}
