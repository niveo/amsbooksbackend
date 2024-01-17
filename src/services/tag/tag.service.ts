import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../../entities';
import { Repository } from 'typeorm';
import { TAGS } from '../../common';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private repository: Repository<Tag>,
  ) {
    this.popularPadrao();
  }

  getAll(): Promise<Tag[]> {
    return this.repository.find({
      cache: true,
    });
  }

  async popularPadrao() {
    this.repository.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.upsert(
        Tag,
        TAGS.map((m) => {
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
