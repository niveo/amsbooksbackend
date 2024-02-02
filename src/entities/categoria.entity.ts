import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base-entity';

export const NOME_TABELA_CATEGORIA = 'categorias';

@Entity({
  name: NOME_TABELA_CATEGORIA,
})
export class Categoria extends BaseEntity {
  @Index()
  @Column('text', {
    nullable: false,
    unique: true,
  })
  nome: string;
}
