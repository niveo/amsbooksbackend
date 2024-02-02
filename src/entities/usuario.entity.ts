import { Exclude } from 'class-transformer';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base-entity';

export const NOME_TABELA_USUARIO = 'usuarios';

@Entity({
  name: NOME_TABELA_USUARIO,
})
export class Usuario extends BaseEntity {
  @Index()
  @Column('text', {
    nullable: false,
  })
  nome: string;

  @Index()
  @Column('text', {
    nullable: false,
    unique: true,
  })
  email: string;

  @Exclude()
  @Index()
  @Column('text', {
    nullable: false,
    unique: true,
  })
  userId?: string;
}
