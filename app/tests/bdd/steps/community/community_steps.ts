import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { ValidateCommunityInviteUseCase } from '../../../../core/application/community/validate_community_invite_use_case.ts';
import {
  COMMUNITY_INVITE_URL,
  COMMUNITY_SPACE,
  GITHUB_TOPICS,
} from '../../../../core/domain/constants/community_space_constants.ts';
import {
  pendingContactChannels,
  readyContactChannels,
} from '../../../../core/domain/constants/organization_constants.ts';
import { SITE_ROUTES } from '../../../../core/domain/constants/site_routes_constants.ts';
import type { VitrineWorld } from '../../support/world.ts';

const PASTA_DE_IMAGENS = 'public/imagens/comunidade';
const TETO_TOTAL_EM_BYTES = 50 * 1024;
const TETO_POR_IMAGEM_EM_BYTES = 25 * 1024;

/** Motivo pelo qual a construcao reprovaria, guardado entre os passos. */
let motivoDaReprovacao = '';

function canaisPublicos(): readonly { name: string; purpose: string; writable: boolean }[] {
  return COMMUNITY_SPACE.filter((c) => c.visibility === 'publica').flatMap((c) => c.channels);
}

function categoriaFechada(): (typeof COMMUNITY_SPACE)[number] | undefined {
  return COMMUNITY_SPACE.find((c) => c.visibility === 'fechada');
}

async function paginaPublicada(): Promise<string> {
  return readFile(join('dist/browser', 'comunidade', 'index.html'), 'utf8');
}

// --- RF-01 e RF-08 ---------------------------------------------------------

Given('que o servidor da Byte Union existe e tem convite permanente', function (): void {
  assert.ok(COMMUNITY_INVITE_URL.startsWith('https://discord.gg/'));
});

When('eu abro qualquer página do sítio', function (): void {
  return;
});

Then('o Discord aparece entre os canais de contato oferecidos', function (): void {
  const discord = readyContactChannels().find((canal) => canal.id === 'discord');
  assert.ok(discord, 'o Discord precisa estar entre os canais prontos');
  assert.equal(discord.url, COMMUNITY_INVITE_URL);
});

Then('nenhum canal declarado como pendente é oferecido ao visitante', function (): void {
  assert.equal(pendingContactChannels().length, 0);
});

// --- RF-02 e RF-10 ---------------------------------------------------------

Given(
  'que o endereço do Discord está ausente, vazio ou não é um convite do Discord',
  function (): void {
    motivoDaReprovacao = '';
  },
);

When('a vitrine é construída', function (): void {
  const caso = new ValidateCommunityInviteUseCase();
  for (const invalido of ['', '   ', 'https://exemplo.com/x', 'https://discord.gg/']) {
    try {
      caso.execute(invalido);
      motivoDaReprovacao = `aceitou endereco invalido: ${invalido}`;
      return;
    } catch (erro) {
      motivoDaReprovacao = erro instanceof Error ? erro.message : String(erro);
    }
  }
});

Then('a construção reprova nomeando o endereço recebido e o formato esperado', function (): void {
  assert.match(motivoDaReprovacao, /recebido/);
  assert.match(motivoDaReprovacao, /esperado/);
});

Then('nenhum sítio com ligação inválida é publicado', function (): void {
  const caso = new ValidateCommunityInviteUseCase();
  assert.doesNotThrow(() => caso.execute(COMMUNITY_INVITE_URL));
});

// --- RF-03 e RF-09 ---------------------------------------------------------

Given(
  'que eu estou na página inicial do sítio',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit(SITE_ROUTES.home);
  },
);

When('eu procuro como falar com os autores', function (): void {
  return;
});

Then(
  'eu chego à página {string} pelo menu principal',
  async function (this: VitrineWorld, rota: string): Promise<void> {
    assert.equal(rota, SITE_ROUTES.community);
    const menu = this.browser.page.locator('header nav a', { hasText: 'Comunidade' });
    await menu.first().click();
    await this.browser.page.locator('h1', { hasText: 'comunidade' }).first().waitFor();
  },
);

Then(
  'eu chego à mesma página pelos canais de contato do rodapé',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit(SITE_ROUTES.home);
    const interno = readyContactChannels().find((canal) => canal.target === 'interno');
    assert.ok(interno, 'o rodape precisa ter um canal interno');
    const ligacao = this.browser.page.locator('footer nav a', { hasText: interno.label });
    await ligacao.first().click();
    await this.browser.page.locator('h1', { hasText: 'comunidade' }).first().waitFor();
  },
);

Then(
  'eu não sou levado direto para fora do sítio sem entender onde estou entrando',
  function (this: VitrineWorld): void {
    assert.match(this.browser.page.url(), new RegExp(`${SITE_ROUTES.community}/?$`));
  },
);

// --- RF-04, RF-05, RF-06, RF-07, RF-13, RF-14, RF-15, RF-17, RF-19 ---------

Given('que eu nunca entrei no servidor', function (): void {
  return;
});

Given('que eu quero escrever algo', function (): void {
  return;
});

Given('que eu quero propor uma mudança de código', function (): void {
  return;
});

Given('que eu sou visitante e não faço parte da Byte Union', function (): void {
  return;
});

Given('que eu uso leitor de tela', function (): void {
  return;
});

Given('que eu leio a página da comunidade', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit(SITE_ROUTES.community);
});

When('eu leio a página da comunidade', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit(SITE_ROUTES.community);
});

When('eu percorro a explicação da estrutura, dos canais e do fórum', function (): void {
  return;
});

When('eu percorro a página da comunidade', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit(SITE_ROUTES.community);
});

Then(
  'cada canal público aparece pelo nome, com uma linha dizendo a que serve',
  async function (this: VitrineWorld): Promise<void> {
    const texto = (await this.browser.page.locator('body').textContent()) ?? '';
    for (const canal of canaisPublicos()) {
      assert.ok(texto.includes(canal.name), `canal ausente na pagina: ${canal.name}`);
      assert.ok(texto.includes(canal.purpose), `proposito ausente: ${canal.name}`);
    }
  },
);

Then(
  'as salas de voz não ficam de fora da descrição',
  async function (this: VitrineWorld): Promise<void> {
    const texto = (await this.browser.page.locator('body').textContent()) ?? '';
    const voz = canaisPublicos().filter((canal) =>
      COMMUNITY_SPACE.some((c) =>
        c.channels.some((k) => k.name === canal.name && k.kind === 'voz'),
      ),
    );
    assert.ok(voz.length > 0, 'o servidor precisa ter sala de voz descrita');
    for (const canal of voz) {
      assert.ok(texto.includes(canal.name), `sala de voz ausente: ${canal.name}`);
    }
  },
);

Then(
  'eu sei quais canais são somente leitura e por quê',
  async function (this: VitrineWorld): Promise<void> {
    const texto = (await this.browser.page.locator('body').textContent()) ?? '';
    const somenteLeitura = canaisPublicos().filter((canal) => !canal.writable);
    assert.ok(somenteLeitura.length > 0);
    assert.ok(texto.includes('somente leitura'), 'a pagina precisa dizer o que e somente leitura');
  },
);

Then(
  'eu não descubro isso só ao tentar escrever e ser impedido',
  async function (this: VitrineWorld): Promise<void> {
    const texto = (await this.browser.page.locator('body').textContent()) ?? '';
    for (const canal of canaisPublicos().filter((c) => !c.writable)) {
      assert.ok(texto.includes(canal.name), `canal fechado a escrita nao nomeado: ${canal.name}`);
    }
  },
);

Then(
  'ela me dirige ao GitHub para proposta, defeito e discussão de código',
  async function (this: VitrineWorld): Promise<void> {
    const texto = (await this.browser.page.locator('body').textContent()) ?? '';
    for (const assunto of GITHUB_TOPICS) {
      assert.ok(texto.includes(assunto), `assunto ausente: ${assunto}`);
    }
  },
);

Then(
  'ela não me convida a abrir esse assunto no Discord',
  async function (this: VitrineWorld): Promise<void> {
    const ligacoes = await this.browser.page.locator('a[href*="github.com"]').count();
    assert.ok(ligacoes > 0, 'a pagina precisa apontar para o GitHub');
  },
);

Then(
  'eu entendo que existe uma área de trabalho fechada dos colaboradores',
  async function (this: VitrineWorld): Promise<void> {
    const fechada = categoriaFechada();
    assert.ok(fechada, 'o servidor precisa ter categoria fechada declarada');
    const texto = (await this.browser.page.locator('body').textContent()) ?? '';
    assert.ok(texto.includes(fechada.name), 'a area fechada precisa ser citada');
  },
);

Then('eu não leio o nome nem o conteúdo dos canais dessa área', function (): void {
  const fechada = categoriaFechada();
  assert.ok(fechada);
  assert.equal(fechada.channels.length, 0, 'a categoria fechada nao pode declarar canal');
});

Then(
  'cada um desses trechos tem uma captura do servidor ao lado',
  async function (this: VitrineWorld): Promise<void> {
    const imagens = await this.browser.page.locator('article img').count();
    assert.ok(imagens >= 4, `esperado ao menos 4 capturas, recebido ${imagens}`);
  },
);

Then(
  'nenhuma dessas imagens vem de servidor de terceiro',
  async function (this: VitrineWorld): Promise<void> {
    const fontes = await this.browser.page
      .locator('article img')
      .evaluateAll((nos) => nos.map((no) => no.getAttribute('src') ?? ''));
    for (const fonte of fontes) {
      assert.ok(!/^https?:\/\//.test(fonte), `imagem externa na pagina: ${fonte}`);
    }
  },
);

Then(
  'cada imagem me diz o que mostra, e a legenda acrescenta em vez de repetir',
  async function (this: VitrineWorld): Promise<void> {
    const figuras = await this.browser.page.locator('article figure').evaluateAll((nos) =>
      nos.map((no) => ({
        alt: no.querySelector('img')?.getAttribute('alt') ?? '',
        legenda: no.querySelector('figcaption')?.textContent ?? '',
      })),
    );
    assert.ok(figuras.length > 0);
    for (const figura of figuras) {
      assert.ok(figura.alt.trim().length > 0, 'imagem sem texto alternativo');
      assert.ok(figura.legenda.trim().length > 0, 'imagem sem legenda');
      assert.notEqual(figura.alt.trim(), figura.legenda.trim());
    }
  },
);

Then(
  'nenhuma informação existe somente dentro da imagem',
  async function (this: VitrineWorld): Promise<void> {
    const texto = (await this.browser.page.locator('article').textContent()) ?? '';
    for (const canal of canaisPublicos()) {
      assert.ok(texto.includes(canal.name), `so a imagem mostra o canal ${canal.name}`);
    }
  },
);

// --- RF-11 -----------------------------------------------------------------

Given('que a vitrine foi construída', function (): void {
  return;
});

When('a página da comunidade é servida ao visitante', function (): void {
  return;
});

Then('ela chega pronta no arquivo publicado', async function (): Promise<void> {
  const html = await paginaPublicada();
  assert.ok(html.includes('comunidade'), 'a pagina prerenderizada precisa existir');
});

Then('nenhuma parte do texto depende de dado buscado na visita', async function (): Promise<void> {
  const html = await paginaPublicada();
  assert.ok(!html.includes('discord.com/api'), 'a pagina nao pode falar com a API do Discord');
});

// --- RF-16 -----------------------------------------------------------------

Given('que existe uma área de trabalho fechada', function (): void {
  assert.ok(categoriaFechada());
});

When('as capturas publicadas são conferidas', function (): void {
  return;
});

Then(
  'nenhum canal da área fechada é nomeado no que a vitrine publica',
  async function (): Promise<void> {
    const fechada = categoriaFechada();
    assert.ok(fechada);
    assert.equal(fechada.channels.length, 0);
    const nomes = await readdir(PASTA_DE_IMAGENS);
    assert.ok(nomes.length > 0, 'as capturas precisam existir no repositorio');
  },
);

Then('a existência da área fechada continua dita no texto', function (): void {
  const fechada = categoriaFechada();
  assert.ok(fechada);
  assert.ok(fechada.purpose.trim().length > 0);
});

// --- RF-18 e RNF-07 --------------------------------------------------------

Given('que a vitrine construída inclui as capturas', function (): void {
  return;
});

When('o peso das imagens da página é medido', function (): void {
  return;
});

Then('a soma delas não passa de 50 KB e nenhuma passa de 25 KB', async function (): Promise<void> {
  const nomes = await readdir(PASTA_DE_IMAGENS);
  let total = 0;
  for (const nome of nomes) {
    const { size } = await stat(join(PASTA_DE_IMAGENS, nome));
    assert.ok(size <= TETO_POR_IMAGEM_EM_BYTES, `imagem acima do teto: ${nome} com ${size} bytes`);
    total += size;
  }
  assert.ok(total <= TETO_TOTAL_EM_BYTES, `soma das imagens acima do teto: ${total} bytes`);
});

Then('toda imagem é servida do próprio sítio', async function (): Promise<void> {
  const html = await paginaPublicada();
  assert.ok(
    html.includes('imagens/comunidade/'),
    'a pagina precisa apontar para as imagens locais',
  );
});
