import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CATEGORIAS, IDIOMAS, TAGS } from '../common';
import {
  Autor,
  Categoria,
  ColecaoLivro,
  Idioma,
  Livro,
  LivroCapitulo,
  NOME_TABELA_CATEGORIA,
  NOME_TABELA_IDIOMA,
  NOME_TABELA_TAG,
  NOME_TABELA_USUARIO,
  Tag,
  Usuario,
} from '../entities';
import { NivelLeitura } from 'src/enuns';
import { In } from 'typeorm';
import { resolve } from 'node:path';
import { load } from 'cheerio';
import { readFileSync } from 'node:fs';

@Injectable()
export class SeedingService {
  constructor(private readonly entityManager: EntityManager) {}

  async iniciar(): Promise<void> {
    await this.entityManager.transaction(async (tr) => {
      const existeLivros = await tr.countBy(Livro, {});
      if (existeLivros > 0) {
        return Promise.resolve();
      }

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

      const AUTORES: Autor[] = [
        {
          nome: 'Antoinette Moses',
          url: 'https://www.cambridge.org/tj/cambridgeenglish/authors/antoinette-moses',
          descricao:
            'Antoinette Moses is a writer and playwright. Her plays have won several competitions and have been produced or received rehearsed readings in Norwich, Cambridge, Ipswich, London and Paris. Her books range from media studies and poetry to a guidebook to Athens, where she lived for four years.',
        },
        {
          nome: 'Lewis Carroll',
          url: 'https://pt.wikipedia.org/wiki/Lewis_Carroll',
          descricao:
            'Charles Lutwidge Dodgson, mais conhecido pelo seu pseudônimo Lewis Carroll, foi um romancista, contista, fabulista, poeta, desenhista, fotógrafo, matemático e reverendo anglicano britânico. Lecionou matemática no Christ College, em Oxford.',
        },
        {
          nome: 'H. G. Wells',
          url: 'https://pt.wikipedia.org/wiki/H._G._Wells',
          descricao:
            'Herbert George Wells, conhecido como H. G. Wells, foi um escritor britânico e membro da Sociedade Fabiana.',
        },
      ];

      await tr.insert(Autor, AUTORES);

      await this.upsert<Usuario>(
        tr,
        NOME_TABELA_USUARIO,
        Usuario,
        [
          {
            nome: 'TESTE 1',
            email: 'teste1@gmail.com',
            userId: '1',
            autor: AUTORES[0],
          },
          {
            nome: 'TESTE 2',
            email: 'teste2@gmail.com',
            userId: '2',
            autor: AUTORES[1],
          },
          {
            nome: 'TESTE 3',
            email: 'teste3@gmail.com',
            userId: '3',
            autor: AUTORES[2],
          },
        ],
        ['userId'],
      );

      await tr.delete(Livro, {});

      const livros: Livro[] = [
        {
          identificador: '26ad542f-d41d-4661-bc1a-afe5532f9c34',
          idioma: await tr.findOne(Idioma, { where: { nome: 'English' } }),
          capitulos: this.carregarCapitulosJson('jojo_capitulos.json'),
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
          identificador: '6b346137-aa0a-4dd5-a509-132ff5219636',
          idioma: await tr.findOne(Idioma, { where: { nome: 'English' } }),
          capitulos: this.carregarCapitulosJson('alice_capitulos.json'),
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
              'children',
              'fairy-tale',
              'children-literature',
              'fantasy',
              'filmed',
            ]),
          }),
        },
        {
          identificador: 'd1b4f565-ce14-40a6-816a-b69419a3076d',
          idioma: await tr.findOne(Idioma, { where: { nome: 'English' } }),
          capitulos: [
            {
              capitulo: 1,
              titulo: 'CHAPTER 1',
              texto: readFileSync(
                resolve(__dirname, '../../data/' + 'stolen_body_capitulos.txt'),
              ).toString(),
            },
          ],
          descritivo:
            "Mr. Bessel has been involved in psychic research for many years. He was especially interested in the idea of manifesting an image and thoughts at a distance to others. In 1896, he carried out the first experiments with his companion Mr. Vincent. The researchers had to be miles apart to make the experiment accurate. Mr. Bessel had to hypnotize himself and mentally transmit his image to his companion, who at that time was trying to see the 'living ghost'. The first attempts were unsuccessful. But one night Mr. Bessel managed to make his spirit leave the body. One evil entity took advantage of this situation. It took possession of the body. Mr. Bessel finds himself in the company of disembodied souls.",
          titulo: 'The Stolen Body',
          categoria: await tr.findOne(Categoria, {
            where: { nome: 'horror' },
          }),
          autor: await tr.findOne(Autor, {
            where: { nome: 'H. G. Wells' },
          }),
          nivelLeitura: NivelLeitura.B1,
          tags: await tr.findBy(Tag, {
            nome: In([
              'space',
              'ghost',
              'photograph',
              'house',
              'dream',
              'office',
              'missing',
              'police',
              'court',
              'disappearance',
              'work',
              'madness',
              'doctor',
            ]),
          }),
        },
      ];

      await tr.save(Livro, [...livros]);

      await tr.delete(ColecaoLivro, {});

      const us1 = await tr.find(Usuario, {});
      us1[0].colecoesLivros = [
        {
          descricao: 'A',
          livros: livros,
          usuario: us1[0],
        },
      ];
      await tr.save(Usuario, us1);
    });
  }

  private carregarCapitulosJson(fileName: string): any {
    return JSON.parse(
      readFileSync(resolve(__dirname, '../../data/' + fileName)).toString(),
    ).map((m) => {
      const cap = new LivroCapitulo();
      cap.texto = m.texto;
      cap.capitulo = m.capitulo;
      cap.titulo = m.titulo;
      return cap;
    });
  }

  /**
   *
   *  const capitulosAlice: LivroCapitulo[] = [];
   *
   *  for (let i = 0; i <= 9; i++) {
   *     const cps = this.carregarCapitulosFile(
   *       `/alice/index_split_00${i}.xhtml`,
   *     );
   *     capitulosAlice.push(...cps);
   *   }
   * @param fileName
   * @returns
   */
  private carregarCapitulosFileHTML(fileName: string) {
    const capitulos: LivroCapitulo[] = [];
    const file = readFileSync(resolve(__dirname, '../../data/' + fileName));
    const la = load(file.toString());
    let cp = 0;
    let cpCap = 0;
    let capitulo: LivroCapitulo;
    let fim = false;
    la('p').each((index, element) => {
      const texto = la(element).text();
      console.log(texto);

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
}
