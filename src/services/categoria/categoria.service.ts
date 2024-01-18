import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from '../../entities';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private repository: Repository<Categoria>,
  ) {}

  getAll(): Promise<Categoria[]> {
    return this.repository.find({
      cache: true,
    });
  }
}
