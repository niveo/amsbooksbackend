import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base-entity';

export const NOME_TABELA_IDIOMA = 'idiomas';

@Entity({
  name: NOME_TABELA_IDIOMA,
})
export class Idioma extends BaseEntity {
  @Index({
    unique: true,
  })
  @Column('text', {
    nullable: false,
  })
  nome: string;
}
