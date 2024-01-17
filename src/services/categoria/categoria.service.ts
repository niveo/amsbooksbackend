import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from '../../entities';
import { Repository } from 'typeorm';
import { CATEGORIAS } from '../../common';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private repository: Repository<Categoria>,
  ) {
    this.popularPadrao();
  }

  getAll(): Promise<Categoria[]> {
    return this.repository.find({
      cache: true,
    });
  }

  async popularPadrao() {
    this.repository.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.upsert(
        Categoria,
        CATEGORIAS.map((m) => {
          return { nome: m };
        }),
        {
          skipUpdateIfNoValuesChanged: true, // If true, postgres will skip the update if no values would be changed (reduces writes)
          conflictPaths: ['nome'],
        },
      );
    });
  }
}
