import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { Idioma } from '../../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutorService } from './autor.service';

describe('AutorService', () => {
  let dataSource: DataSource;
  let service: AutorService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([Idioma])],
      providers: [AutorService],
    }).compile();

    service = app.get<AutorService>(AutorService);
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
