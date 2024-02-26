import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private repository: Repository<Tag>,
    private dataSource: DataSource,
  ) {}

  getAll(): Promise<any[]> {
    return this.dataSource.query(`
      WITH livrosTags AS (
        SELECT livros_has_tags."tagsId", count(*) contalivros
        FROM livros_has_tags group by livros_has_tags."tagsId"
      )
      SELECT tags.id, tags.nome, livrosTags.contalivros FROM tags
      left outer join livrosTags ON livrosTags."tagsId" = tags.id
      order by tags.nome
    `);
  }
}
