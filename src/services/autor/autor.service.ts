import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Autor } from '../../entities';
import { Repository } from 'typeorm';
import { AUTORES } from '../../common';

@Injectable()
export class AutorService {
  constructor(
    @InjectRepository(Autor)
    private repository: Repository<Autor>,
  ) {
    this.popularPadrao();
  }

  getAll(): Promise<Autor[]> {
    return this.repository.find({
      cache: true,
    });
  }

  async popularPadrao() {
    this.repository.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.upsert(Autor, AUTORES, {
        skipUpdateIfNoValuesChanged: true, // If true, postgres will skip the update if no values would be changed (reduces writes)
        conflictPaths: ['nome', 'userId'],
      });
    });
  }
}
