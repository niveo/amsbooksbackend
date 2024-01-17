import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base-entity';

@Entity({
  name: 'idiomas',
})
export class Idioma extends BaseEntity {
  @Index()
  @Column('text', {
    nullable: false,
    unique: true,
  })
  nome: string;
}
