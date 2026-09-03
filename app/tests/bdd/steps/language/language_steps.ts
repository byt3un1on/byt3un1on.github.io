import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { COMMUNITY_SPACE } from '../../../../core/domain/constants/community_space_constants.ts';
import {
  projectRoute,
  staticRoutes,
} from '../../../../core/domain/constants/site_routes_constants.ts';
import { semDiacriticos } from '../../support/diacritics.ts';
import type { VitrineWorld } from '../../support/world.ts';

/** Tecnologia que a curadoria nao declara, para o catalogo voltar vazio. */
const TECNOLOGIA_AUSENTE = 'Cobol';

/** Texto guardado entre o passo que o recebe e o passo que o confere. */
let textoAnterior = '';
let textoDobrado = '';

interface CuradoriaLida {
  readonly projects: readonly { readonly slug: string; readonly summary: string }[];
}

async function curadoria(): Promise<CuradoriaLida> {
  return JSON.parse(await readFile('data/curation.json', 'utf8')) as CuradoriaLida;
}

/**
 * Todo o texto do documento, e nao so o que aparece na tela: RF-08 cobre
 * justamente o que o olho nao alcanca e o leitor de tela alcanca.
 */
async function textoDaPagina(mundo: VitrineWorld): Promise<string> {
  return (await mundo.browser.page.locator('body').textContent()) ?? '';
}

async function descricaoParaBuscadores(mundo: VitrineWorld): Promise<string> {
  return (
    (await mundo.browser.page.locator('meta[name="description"]').getAttribute('content')) ?? ''
  );
}

// --- onde o visitante esta --------------------------------------------------

Given('que o visitante abre a página inicial', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit('/');
});

Given(
  'que o visitante abre a página de projetos',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit('/projetos');
  },
);

Given(
  'que o visitante abre a página de um projeto do catálogo',
  async function (this: VitrineWorld): Promise<void> {
    const declarada = await curadoria();
    const slug = declarada.projects[0]?.slug ?? '';
    assert.notEqual(slug, '', 'a curadoria nao declara projeto algum');
    await this.browser.visit(projectRoute(slug));
  },
);

Given(
  'que o visitante abre a página da comunidade',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit('/comunidade');
  },
);

Given(
  'que o visitante abre a página de endereço não encontrado',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit('/404');
  },
);

Given(
  'que o visitante abre qualquer página pública',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit('/');
  },
);

When(
  'ele restringe o catálogo a uma tecnologia que nenhum projeto usa',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit(`/projetos?tecnologia=${TECNOLOGIA_AUSENTE}`);
  },
);

// --- o que a pagina escreve -------------------------------------------------

Then('a página escreve {string}', async function (this: VitrineWorld, termo: string) {
  const texto = await textoDaPagina(this);
  assert.ok(texto.includes(termo), `a pagina nao escreve ${JSON.stringify(termo)}`);
});

Then(
  'a página escreve {string} e {string}',
  async function (this: VitrineWorld, primeiro: string, segundo: string) {
    const texto = await textoDaPagina(this);
    for (const termo of [primeiro, segundo]) {
      assert.ok(texto.includes(termo), `a pagina nao escreve ${JSON.stringify(termo)}`);
    }
  },
);

Then(
  'a página escreve {string}, {string} e {string}',
  async function (this: VitrineWorld, primeiro: string, segundo: string, terceiro: string) {
    const texto = await textoDaPagina(this);
    for (const termo of [primeiro, segundo, terceiro]) {
      assert.ok(texto.includes(termo), `a pagina nao escreve ${JSON.stringify(termo)}`);
    }
  },
);

Then('a página não escreve {string}', async function (this: VitrineWorld, termo: string) {
  const texto = await textoDaPagina(this);
  assert.equal(texto.includes(termo), false, `a pagina ainda escreve ${JSON.stringify(termo)}`);
});

Then(
  'a página não escreve {string} nem {string}',
  async function (this: VitrineWorld, primeiro: string, segundo: string) {
    const texto = await textoDaPagina(this);
    for (const termo of [primeiro, segundo]) {
      assert.equal(texto.includes(termo), false, `a pagina ainda escreve ${JSON.stringify(termo)}`);
    }
  },
);

Then(
  'a página não escreve {string}, {string} nem {string}',
  async function (this: VitrineWorld, primeiro: string, segundo: string, terceiro: string) {
    const texto = await textoDaPagina(this);
    for (const termo of [primeiro, segundo, terceiro]) {
      assert.equal(texto.includes(termo), false, `a pagina ainda escreve ${JSON.stringify(termo)}`);
    }
  },
);

// --- o que so o dominio e a curadoria sabem ---------------------------------

Then(
  'a descrição de cada canal público aparece acentuada como no domínio',
  async function (this: VitrineWorld): Promise<void> {
    const texto = await textoDaPagina(this);
    const canais = COMMUNITY_SPACE.filter((c) => c.visibility === 'publica').flatMap(
      (c) => c.channels,
    );
    assert.ok(canais.length > 0, 'o dominio nao declara canal publico algum');
    for (const canal of canais) {
      assert.ok(
        texto.includes(canal.purpose),
        `a pagina nao traz o proposito de ${canal.name} como o dominio o escreve`,
      );
    }
  },
);

Then(
  'o resumo de cada projeto aparece acentuado como na curadoria',
  async function (this: VitrineWorld): Promise<void> {
    const texto = await textoDaPagina(this);
    const declarada = await curadoria();
    assert.ok(declarada.projects.length > 0, 'a curadoria nao declara projeto algum');
    for (const projeto of declarada.projects) {
      assert.ok(
        texto.includes(projeto.summary),
        `o resumo de ${projeto.slug} nao aparece como a curadoria o escreve`,
      );
    }
  },
);

// --- titulo, descricao e idioma ---------------------------------------------

Then('o título do documento escreve {string}', async function (this: VitrineWorld, termo: string) {
  const titulo = await this.browser.page.title();
  assert.ok(titulo.includes(termo), `o titulo e ${JSON.stringify(titulo)}`);
});

Then(
  'a descrição entregue aos buscadores escreve {string}',
  async function (this: VitrineWorld, termo: string) {
    const descricao = await descricaoParaBuscadores(this);
    assert.ok(descricao.includes(termo), `a descricao e ${JSON.stringify(descricao)}`);
  },
);

Then(
  'a descrição entregue aos buscadores não escreve {string}',
  async function (this: VitrineWorld, termo: string) {
    const descricao = await descricaoParaBuscadores(this);
    assert.equal(
      descricao.includes(termo),
      false,
      `a descricao ainda escreve ${JSON.stringify(termo)}`,
    );
  },
);

Then('o documento declara o idioma {string}', async function (this: VitrineWorld, idioma: string) {
  const declarado = await this.browser.page.locator('html').getAttribute('lang');
  assert.equal(declarado, idioma);
});

// --- o texto que so o leitor de tela alcanca --------------------------------

Then(
  'toda imagem tem descrição alternativa preenchida',
  async function (this: VitrineWorld): Promise<void> {
    const descricoes = await this.browser.page
      .locator('img')
      .evaluateAll((imagens) => imagens.map((imagem) => imagem.getAttribute('alt') ?? ''));
    assert.ok(descricoes.length > 0, 'a pagina nao tem imagem alguma');
    for (const descricao of descricoes) {
      assert.notEqual(descricao.trim(), '', 'ha imagem sem descricao alternativa');
    }
  },
);

Then(
  'nenhuma descrição alternativa escreve {string}, {string} nem {string}',
  async function (this: VitrineWorld, primeiro: string, segundo: string, terceiro: string) {
    const descricoes = await this.browser.page
      .locator('img')
      .evaluateAll((imagens) => imagens.map((imagem) => imagem.getAttribute('alt') ?? ''));
    for (const descricao of descricoes) {
      for (const termo of [primeiro, segundo, terceiro]) {
        assert.equal(
          descricao.includes(termo),
          false,
          `a descricao ${JSON.stringify(descricao)} ainda escreve ${JSON.stringify(termo)}`,
        );
      }
    }
  },
);

// --- o que nao pode receber acento ------------------------------------------

Then('nenhuma rota pública declarada contém caractere acentuado', function (): void {
  for (const rota of staticRoutes()) {
    assert.equal(semDiacriticos(rota), rota, `a rota ${rota} carrega acento`);
  }
});

Then(
  'todo endereço interno da página está em ASCII',
  async function (this: VitrineWorld): Promise<void> {
    const enderecos = await this.browser.page
      .locator('a[href]')
      .evaluateAll((ligacoes) => ligacoes.map((ligacao) => ligacao.getAttribute('href') ?? ''));
    const internos = enderecos.filter((endereco) => endereco.startsWith('/'));
    assert.ok(internos.length > 0, 'a pagina nao tem ligacao interna alguma');
    for (const endereco of internos) {
      assert.equal(semDiacriticos(endereco), endereco, `o endereco ${endereco} carrega acento`);
    }
  },
);

// --- RF-11: so a grafia mudou -----------------------------------------------

Given('o texto publicado antes da correção {string}', function (texto: string): void {
  textoAnterior = texto;
});

When(
  'os diacríticos são removidos do texto publicado agora {string}',
  function (texto: string): void {
    textoDobrado = semDiacriticos(texto);
  },
);

Then('o resultado é idêntico ao texto anterior', function (): void {
  assert.equal(textoDobrado, textoAnterior);
});
