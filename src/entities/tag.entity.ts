import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base-entity';

export const NOME_TABELA_TAG = 'tags';

@Entity({ name: NOME_TABELA_TAG })
export class Tag extends BaseEntity {
  @Index()
  @Column('text', {
    nullable: false,
    unique: true,
  })
  nome: string;
}
