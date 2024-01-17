import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base-entity';

@Entity({ name: 'tags' })
export class Tag extends BaseEntity {
  @Index()
  @Column('text', {
    nullable: false,
    unique: true,
  })
  nome: string;
}
