import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { Idioma } from '../../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TAGS } from '../../common';
import { TagService } from './tag.service';

describe('TagService', () => {
  let dataSource: DataSource;
  let service: TagService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([Idioma])],
      providers: [TagService],
    }).compile();

    service = app.get<TagService>(TagService);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Ler Tags', () => {
    it('Deve retornar um registro', async () => {
      const registros = await service.getAll();
      expect(registros).not.toBeNull();
      expect(registros).toHaveLength(TAGS.length);
    });
  });
});
