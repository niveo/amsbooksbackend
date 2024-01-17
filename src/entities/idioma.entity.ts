import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base-entity';

@Entity()
export class Idioma extends BaseEntity {
  @Index()
  @Column('text', {
    nullable: false,
  })
  nome: string;
}
