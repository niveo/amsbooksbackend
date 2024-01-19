import { Injectable } from '@nestjs/common';
import { EntityManager, QueryRunner, TableForeignKey } from 'typeorm';
import { AUTORES, CATEGORIAS, IDIOMAS, TAGS } from '../common';
import {
  Autor,
  Categoria,
  Idioma,
  Livro,
  LivroCapitulo,
  NOME_TABELA_AUTOR,
  NOME_TABELA_CATEGORIA,
  NOME_TABELA_IDIOMA,
  NOME_TABELA_LIVRO,
  NOME_TABELA_LIVRO_CAPITULO,
  NOME_TABELA_TAG,
  Tag,
} from '../entities';
import { NivelLeitura } from 'src/enuns';
import { In } from 'typeorm';
import { v4 } from 'uuid';
import { resolve } from 'node:path';
import { load } from 'cheerio';
import { readFileSync } from 'node:fs';

@Injectable()
export class SeedingService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed(): Promise<void> {
    await this.entityManager.transaction(async (tr) => {
      const existeLivros = await tr.countBy(Livro, {});
      if (existeLivros > 0) {
        return Promise.resolve();
      }

      await this.criarFk(
        tr.queryRunner,
        NOME_TABELA_LIVRO,
        NOME_TABELA_AUTOR,
        ['id'],
        ['autorId'],
      );

      await this.criarFk(
        tr.queryRunner,
        NOME_TABELA_LIVRO_CAPITULO,
        NOME_TABELA_LIVRO,
        ['id'],
        ['livroId'],
      );

      await this.criarFk(
        tr.queryRunner,
        'livros_has_tags',
        NOME_TABELA_LIVRO,
        ['id'],
        ['livrosId'],
      );

      await this.criarFk(
        tr.queryRunner,
        'livros_has_tags',
        NOME_TABELA_TAG,
        ['id'],
        ['tagsId'],
        'RESTRICT',
      );

      await this.upsert(
        tr,
        NOME_TABELA_IDIOMA,
        Idioma,
        IDIOMAS.map((m) => {
          return { nome: m };
        }),
        ['nome'],
      );

      await this.upsert(
        tr,
        NOME_TABELA_CATEGORIA,
        Categoria,
        CATEGORIAS.map((m) => {
          return { nome: m };
        }),
        ['nome'],
      );

      await this.upsert(
        tr,
        NOME_TABELA_TAG,
        Tag,
        TAGS.map((m) => {
          return { nome: m };
        }),
        ['nome'],
      );

      await this.upsert<Autor>(tr, NOME_TABELA_AUTOR, Autor, AUTORES, [
        'nome',
        'userId',
      ]);

      await tr.delete(Livro, {});

      const capitulosAlice: LivroCapitulo[] = [];

      for (let i = 0; i <= 9; i++) {
        const cps = this.carregarCapitulosFile(
          `/alice/index_split_00${i}.xhtml`,
        );
        capitulosAlice.push(...cps);
      }

      const livros: Livro[] = [
        {
          idioma: await tr.findOne(Idioma, { where: { nome: 'English' } }),
          capitulos: this.carregarCapitulosFile('capitulos_jojo.html'),
          descritivo:
            "The loss of loved ones is a hard blow for everyone. How can a child survive this? Jojo is 10 years old. Soldiers came to his village and killed everyone. The boy was playing in the field at that time. That is why he remained alive. Only the boy does not understand how to live now. The question in his mind is: 'Why wasn't I with them?'. One day Jojo meets Chris. Chris is a British journalist. Jojo leaves with Chris. During this journey, they observe a country that is suffering from terrible war. Much of what he sees helps the boy to know himself, understand his thoughts and choose his life path. This book is filled with thoughts about life, experience and bitterness. And it also has answers to many questions.",
          titulo: "Jojo's Story",
          categoria: await tr.findOne(Categoria, {
            where: { nome: 'Human interest' },
          }),
          autor: await tr.findOne(Autor, {
            where: { nome: 'Antoinette Moses' },
          }),
          nivelLeitura: NivelLeitura.B1,
          tags: await tr.findBy(Tag, {
            nome: In([
              'house',
              'family',
              'school',
              'farm',
              'cooking',
              'children',
              'writer',
              'animals',
              'fight',
              'ghost',
              'doctor',
              'university',
              'football',
            ]),
          }),
        },

        {
          idioma: await tr.findOne(Idioma, { where: { nome: 'English' } }),
          capitulos: capitulosAlice,
          descritivo:
            'The world-famous fairy tale was written by an English writer and mathematician in 1865. This book is one of the best examples of nonsense literature. In the fairy tale, the reader can see dozens of complicated philosophical, mathematical and linguistic jokes. In this story, we can find many interesting hidden meanings. The girl Alice spends her time on the river bank. She is bored. Suddenly she sees a strange white rabbit. The small animal has a big pocket watch in his paws and he is in a hurry. Alice follows the rabbit and falls into a hole. The curious girl finds herself in a phantasmagoric world inhabited by many anthropomorphic creatures. And this is only the beginning of her unusual, strange and surprising adventures.',
          titulo: 'Alice in Wonderland',
          categoria: await tr.findOne(Categoria, {
            where: { nome: 'fantasy' },
          }),
          autor: await tr.findOne(Autor, {
            where: { nome: 'Lewis Carroll' },
          }),
          nivelLeitura: NivelLeitura.B1,
          tags: await tr.findBy(Tag, {
            nome: In([
              'fairy-tale',
              'children-literature',
              'fantasy',
              'filmed',
            ]),
          }),
        },
      ];

      await tr.save(Livro, livros);
    });
  }

  private carregarCapitulosFile(fileName: string) {
    const capitulos: LivroCapitulo[] = [];
    const file = readFileSync(resolve(__dirname, '../../data/' + fileName));
    const la = load(file.toString());
    let cp = 0;
    let cpCap = 0;
    let capitulo: LivroCapitulo;
    let fim = false;
    la('p').each((index, element) => {
      const texto = la(element).text();
      if (texto.indexOf('CHAPTER') !== -1) {
        cp = 0;
        cpCap++;
        capitulo = new LivroCapitulo();
        capitulo.texto = '';
        capitulos.push(capitulo);
        capitulo.capitulo = cpCap;
      }
      if (cp === 1) {
        capitulo.titulo = texto;
      } else if (cp > 1) {
        if (texto.indexOf('THE END') !== -1) fim = true;
        if (!fim) capitulo.texto += texto.trim().replaceAll('        ', '');
      }

      cp++;
    });
    return capitulos;
  }

  private async upsert<T>(
    tr: EntityManager,
    tabela: string,
    entity: any,
    values: T[],
    paths: string[],
  ) {
    const existe = await tr.queryRunner.hasTable(tabela);
    if (existe) {
      await tr.queryRunner.manager.upsert(entity, values, {
        skipUpdateIfNoValuesChanged: true, // If true, postgres will skip the update if no values would be changed (reduces writes)
        conflictPaths: paths,
      });
    }
  }

  private async criarFk(
    queryRunner: QueryRunner,
    tabela: string,
    tabelaReferencia: string,
    camposReferencia: string[],
    campos: string[],
    onDelete: 'CASCADE' | 'RESTRICT' = 'CASCADE',
  ) {
    const tabelaExiste = await queryRunner.getTable(tabela);
    if (tabelaExiste) {
      await queryRunner.createForeignKey(
        tabela,
        new TableForeignKey({
          name: 'FK_' + v4().replaceAll('-', ''),
          referencedTableName: tabelaReferencia,
          referencedColumnNames: camposReferencia,
          columnNames: campos,
          onDelete: onDelete,
        }),
      );
    }
  }
}
