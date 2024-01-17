import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Idioma } from '../../entities';
import { Repository } from 'typeorm';
import { IDIOMAS } from '../../common';

@Injectable()
export class IdiomaService {
  constructor(
    @InjectRepository(Idioma)
    private repository: Repository<Idioma>,
  ) {
    this.popularPadrao();
  }

  getAll(): Promise<Idioma[]> {
    return this.repository.find({
      cache: true,
    });
  }

  async popularPadrao() {
    this.repository.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.upsert(
        Idioma,
        IDIOMAS.map((m) => {
          return { nome: m };
        }),
        ['nome'],
      );
    });
  }
}
