import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Idioma } from '../entities';
import { Repository } from 'typeorm';
import { IDIOMAS } from '../common';

@Injectable()
export class IdiomaService {
  constructor(
    @InjectRepository(Idioma)
    private idiomaRepository: Repository<Idioma>,
  ) {
    this.popularIdiomasPadrao();
  }

  getAll() {
    return this.idiomaRepository.find({
      cache: true,
    });
  }

  create(entity: Idioma): Promise<Idioma> {
    return this.idiomaRepository.save(entity);
  }

  async popularIdiomasPadrao() {
    this.idiomaRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.upsert(
          Idioma,
          IDIOMAS.map((m) => {
            return { nome: m };
          }),
          ['nome'],
        );
      },
    );
  }
}
