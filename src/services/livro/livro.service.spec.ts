import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { Idioma } from '../../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivroService } from './livro.service';

describe('LivroService', () => {
  let dataSource: DataSource;
  let service: LivroService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([Idioma])],
      providers: [LivroService],
    }).compile();

    service = app.get<LivroService>(LivroService);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
