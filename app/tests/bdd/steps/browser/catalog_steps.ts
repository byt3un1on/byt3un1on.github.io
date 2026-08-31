import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import type { CurationDto } from '../../../../core/domain/dtos/curation_dto.ts';
import type { VitrineWorld } from '../../support/world.ts';

let slugObservado = '';
let enderecoAntes: string[] = [];

async function curadoria(): Promise<CurationDto> {
  return JSON.parse(await readFile('data/curation.json', 'utf8')) as CurationDto;
}

interface CatalogoGerado {
  readonly projects: readonly {
    readonly slug: string;
    readonly technologies: readonly string[];
    readonly homepage: string | null;
    readonly lastActivityAt: string;
  }[];
}

async function catalogoGerado(): Promise<CatalogoGerado> {
  return JSON.parse(await readFile('data/catalog.generated.json', 'utf8')) as CatalogoGerado;
}

async function cartoes(mundo: VitrineWorld): Promise<readonly string[]> {
  return mundo.browser.page
    .locator('article h3 a')
    .evaluateAll((elementos) => elementos.map((e) => e.textContent?.trim() ?? ''));
}

// --- Dado ------------------------------------------------------------------

Given('que a organização possui repositórios públicos com commits', function (): void {
  // Estado do mundo real: a organizacao tem repositorios publicos com commits.
});

Given(
  'que o catálogo exibe um projeto declarado na curadoria',
  async function (this: VitrineWorld): Promise<void> {
    const declarada = await curadoria();
    slugObservado = declarada.projects[0]?.slug ?? '';
    assert.notEqual(slugObservado, '', 'a curadoria nao declara projeto algum');
  },
);

Given('que a organização possui o repositório público {string}', function (nome: string): void {
  slugObservado = nome;
});

Given('que a curadoria não declara esse repositório', async function (): Promise<void> {
  const declarada = await curadoria();
  const declarados = declarada.projects.flatMap((p) => p.repositories);
  assert.equal(declarados.includes(slugObservado), false, `${slugObservado} esta na curadoria`);
});

Given(
  'que a curadoria declara um projeto composto pelos repositórios {string}, {string}, {string}, {string} e {string}',
  async function (a: string, b: string, c: string, d: string, e: string): Promise<void> {
    const declarada = await curadoria();
    const projeto = declarada.projects.find((p) => p.repositories.includes(a));
    assert.ok(projeto, `nenhum projeto da curadoria declara ${a}`);
    assert.deepEqual([...projeto.repositories].sort(), [a, b, c, d, e].sort());
    slugObservado = projeto.slug;
  },
);

Given(
  'que o catálogo exibe um projeto cujas tecnologias são {string} e {string}',
  async function (this: VitrineWorld, uma: string, outra: string): Promise<void> {
    await this.browser.visit('/projetos');
    const tecnologias = await this.browser.page
      .locator('article ul[aria-label="Tecnologias"]')
      .evaluateAll((listas) => listas.map((l) => l.textContent ?? ''));
    assert.ok(
      tecnologias.some((t) => t.includes(uma) && t.includes(outra)),
      `nenhum projeto emprega ${uma} e ${outra}`,
    );
  },
);

Given('que o catálogo está exibindo projetos', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit('/projetos');
  assert.ok((await cartoes(this)).length > 0, 'o catalogo esta vazio');
});

Given(
  'que eu percorro o catálogo com leitor de tela',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit('/projetos');
  },
);

Given('que estou no catálogo de projetos', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit('/projetos');
});

Given(
  'que o projeto exibido possui endereço publicado próprio além do repositório',
  async function (): Promise<void> {
    const catalogo = JSON.parse(await readFile('data/catalog.generated.json', 'utf8')) as {
      projects: readonly { slug: string; homepage: string | null }[];
    };
    const comEndereco = catalogo.projects.find((p) => p.homepage !== null);
    assert.ok(comEndereco, 'nenhum projeto do catalogo tem endereco publicado');
    slugObservado = comEndereco.slug;
  },
);

Given(
  'que eu tenho o endereço da página de um projeto, recebido por terceiro',
  async function (): Promise<void> {
    const declarada = await curadoria();
    slugObservado = declarada.projects[0]?.slug ?? '';
  },
);

Given(
  'que a curadoria declara um projeto como destaque e primeiro da ordem',
  async function (): Promise<void> {
    const declarada = await curadoria();
    const primeiro = declarada.projects[0];
    assert.ok(primeiro?.highlighted, 'o primeiro projeto da curadoria nao esta em destaque');
    slugObservado = primeiro.slug;
  },
);

Given(
  'que o repositório {string} não tem descrição preenchida no GitHub',
  function (repositorio: string): void {
    slugObservado = repositorio;
  },
);

Given('que a curadoria declara um resumo para esse repositório', async function (): Promise<void> {
  const declarada = await curadoria();
  const projeto = declarada.projects.find((p) => p.repositories.includes(slugObservado));
  assert.ok(
    projeto,
    `a curadoria nao declara "${slugObservado}": o exemplo do cenario nao corresponde a curadoria vigente`,
  );
  slugObservado = projeto.slug;
});

// --- Quando ----------------------------------------------------------------

When('eu abro o catálogo de projetos', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit('/projetos');
});

When(
  'eu observo o item desse projeto no catálogo',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit('/projetos');
  },
);

When('eu observo esse projeto no catálogo', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit('/projetos');
});

When('eu abro um projeto do catálogo', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit('/projetos');
  await this.browser.page.locator('article h3 a').first().click();
  await this.browser.page.waitForLoadState('load');
});

When('eu abro a página desse projeto', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit(`/projetos/${slugObservado}`);
});

When(
  'eu abro esse endereço diretamente, sem passar pela página inicial',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit(`/projetos/${slugObservado}`);
  },
);

When(
  'eu restrinjo o catálogo à tecnologia {string}',
  async function (this: VitrineWorld, tecnologia: string): Promise<void> {
    enderecoAntes = await this.browser.page
      .locator('article h3 a')
      .evaluateAll((links) =>
        links.map((l) => (l as HTMLAnchorElement).getAttribute('href') ?? ''),
      );
    await this.browser.page.getByRole('button', { name: tecnologia, exact: true }).click();
  },
);

When(
  'eu aplico uma restrição que não corresponde a nenhum projeto',
  async function (this: VitrineWorld): Promise<void> {
    const botoes = await this.browser.page
      .getByRole('button')
      .evaluateAll((b) => b.map((x) => x.textContent?.trim() ?? ''));
    const tecnologias = botoes.filter((t) => t !== 'Todas');
    const catalogo = JSON.parse(await readFile('data/catalog.generated.json', 'utf8')) as {
      projects: readonly { technologies: readonly string[] }[];
    };
    const rara = tecnologias.find(
      (t) => catalogo.projects.filter((p) => p.technologies.includes(t)).length === 0,
    );
    await this.browser.page
      .getByRole('button', { name: rara ?? tecnologias[0] ?? 'Todas', exact: true })
      .click();
  },
);

When('eu altero a restrição por tecnologia', async function (this: VitrineWorld): Promise<void> {
  const botoes = this.browser.page.getByRole('button');
  await botoes.nth(1).click();
});

// --- Então -----------------------------------------------------------------

Then(
  'cada projeto exibido corresponde a repositório existente da organização',
  async function (this: VitrineWorld): Promise<void> {
    const repos = await this.browser.page
      .getByRole('link', { name: 'Ver o repositorio' })
      .evaluateAll((links) => links.map((l) => (l as HTMLAnchorElement).href));
    assert.ok(repos.length > 0, 'nenhum projeto exibido');
    const forasteiros = repos.filter((r) => !r.startsWith('https://github.com/byt3un1on/'));
    assert.deepEqual(forasteiros, [], 'ha projeto apontando para fora da organizacao');
  },
);

Then(
  'nenhum projeto exibido tem origem em texto desvinculado de um repositório',
  async function (this: VitrineWorld): Promise<void> {
    const totalCartoes = (await cartoes(this)).length;
    const totalRepos = await this.browser.page
      .getByRole('link', { name: 'Ver o repositorio' })
      .count();
    assert.equal(totalRepos, totalCartoes, 'ha cartao sem ligacao para repositorio de origem');
  },
);

Then(
  'eu vejo seu nome legível, um resumo do que ele faz, as tecnologias que ele emprega e um sinal de sua atividade',
  async function (this: VitrineWorld): Promise<void> {
    const cartao = this.browser.page.locator('article').first();
    assert.ok(((await cartao.locator('h3').textContent()) ?? '').trim().length > 0, 'sem nome');
    assert.ok(
      ((await cartao.locator('p').first().textContent()) ?? '').trim().length > 0,
      'sem resumo',
    );
    await cartao.locator('ul[aria-label="Tecnologias"]').waitFor();
    assert.match((await cartao.textContent()) ?? '', /Atividade mais recente em/);
  },
);

Then(
  'eu vejo uma ligação que leva ao repositório de origem',
  async function (this: VitrineWorld): Promise<void> {
    const ligacao = this.browser.page.getByRole('link', { name: 'Ver o repositorio' }).first();
    assert.match((await ligacao.getAttribute('href')) ?? '', /^https:\/\/github\.com\/byt3un1on\//);
  },
);

Then(
  'eu não vejo campo obrigatório exibido em branco ou com texto de preenchimento',
  async function (this: VitrineWorld): Promise<void> {
    const textos = await this.browser.page
      .locator('article')
      .evaluateAll((artigos) => artigos.map((a) => a.textContent ?? ''));
    const suspeitos = textos.filter(
      (t) => t.trim() === '' || /lorem|TODO|preencher|em breve/i.test(t),
    );
    assert.deepEqual(suspeitos, [], 'ha cartao vazio ou com texto de preenchimento');
  },
);

Then(
  'os projetos declarados na curadoria continuam sendo exibidos',
  async function (this: VitrineWorld): Promise<void> {
    const declarada = await curadoria();
    assert.equal((await cartoes(this)).length, declarada.projects.length);
  },
);

Then(
  'eu vejo um único item de catálogo para esse projeto',
  async function (this: VitrineWorld): Promise<void> {
    const nomes = await cartoes(this);
    const declarada = await curadoria();
    const projeto = declarada.projects.find((p) => p.slug === slugObservado);
    assert.equal(nomes.filter((n) => n === projeto?.name).length, 1);
  },
);

Then(
  'esse item exibe a união das tecnologias dos cinco repositórios',
  async function (this: VitrineWorld): Promise<void> {
    const catalogo = await catalogoGerado();
    const projeto = catalogo.projects.find((p) => p.slug === slugObservado);
    assert.ok(
      (projeto?.technologies.length ?? 0) > 1,
      'o item nao reune tecnologias de varios repositorios',
    );
    // Localiza o cartao DO projeto, e nao o primeiro do catalogo: o primeiro e o
    // que a curadoria destaca, e nao necessariamente o que o cenario examina.
    const declarada = await curadoria();
    const nome = declarada.projects.find((p) => p.slug === slugObservado)?.name ?? '';
    const cartao = this.browser.page.locator('article').filter({ hasText: nome }).first();
    const exibidas = (await cartao.locator('ul[aria-label="Tecnologias"]').textContent()) ?? '';
    for (const tecnologia of projeto?.technologies ?? []) {
      assert.match(exibidas, new RegExp(tecnologia));
    }
  },
);

Then(
  'esse item exibe a data de atividade mais recente entre os cinco',
  async function (this: VitrineWorld): Promise<void> {
    const declarada = await curadoria();
    const nome = declarada.projects.find((p) => p.slug === slugObservado)?.name ?? '';
    const catalogo = await catalogoGerado();
    const esperada = catalogo.projects.find((p) => p.slug === slugObservado)?.lastActivityAt ?? '';
    const formatada = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(
      new Date(esperada),
    );
    const texto =
      (await this.browser.page
        .locator('article')
        .filter({ hasText: nome })
        .first()
        .textContent()) ?? '';
    assert.match(texto, new RegExp(`Atividade mais recente em ${formatada}`));
  },
);

Then(
  'ao abri-lo eu vejo os cinco repositórios que o compõem, cada um com sua ligação',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit(`/projetos/${slugObservado}`);
    const declarada = await curadoria();
    const projeto = declarada.projects.find((p) => p.slug === slugObservado);
    const ligacoes = await this.browser.page
      .locator('article ul li a')
      .evaluateAll((links) => links.map((l) => l.textContent?.trim() ?? ''));
    for (const repositorio of projeto?.repositories ?? []) {
      assert.ok(ligacoes.includes(repositorio), `repositorio ${repositorio} ausente na pagina`);
    }
  },
);

Then(
  'eu não vejo cinco itens separados no catálogo',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit('/projetos');
    const nomes = await cartoes(this);
    const declarada = await curadoria();
    const projeto = declarada.projects.find((p) => p.slug === slugObservado);
    const separados = nomes.filter((n) => (projeto?.repositories ?? []).includes(n));
    assert.deepEqual(separados, [], 'os repositorios aparecem como itens separados');
  },
);

Then(
  'eu chego a uma página dedicada a esse projeto, com endereço próprio e estável',
  function (this: VitrineWorld): void {
    assert.match(this.browser.page.url(), /\/projetos\/[a-z0-9-]+$/);
  },
);

Then(
  'vejo o detalhamento do projeto e a ligação para o seu repositório',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.page.getByRole('heading', { level: 2, name: 'Repositorios' }).waitFor();
    assert.ok((await this.browser.page.locator('article ul li a').count()) > 0);
  },
);

Then(
  'eu não sou levado para fora do sítio sem que eu tenha escolhido a ligação',
  function (this: VitrineWorld): void {
    assert.match(this.browser.page.url(), /^http:\/\/127\.0\.0\.1:8080\//);
  },
);

Then(
  'eu vejo duas ligações distintas e rotuladas: uma para o repositório e outra para o endereço publicado',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.page.getByRole('link', { name: 'Abrir o endereco publicado' }).waitFor();
    assert.ok((await this.browser.page.locator('article ul li a').count()) > 0);
  },
);

Then(
  'as duas ligações não apontam para o mesmo destino',
  async function (this: VitrineWorld): Promise<void> {
    const publicado = await this.browser.page
      .getByRole('link', { name: 'Abrir o endereco publicado' })
      .getAttribute('href');
    const repositorio = await this.browser.page
      .locator('article ul li a')
      .first()
      .getAttribute('href');
    assert.notEqual(publicado, repositorio);
  },
);

Then(
  'a página do projeto é exibida integralmente',
  async function (this: VitrineWorld): Promise<void> {
    const titulo = (await this.browser.page.getByRole('heading', { level: 1 }).textContent()) ?? '';
    assert.ok(titulo.trim().length > 0);
    await this.browser.page.getByRole('heading', { level: 2, name: 'Repositorios' }).waitFor();
  },
);

Then(
  'eu não recebo erro de endereço não encontrado nem sou redirecionado à página inicial',
  async function (this: VitrineWorld): Promise<void> {
    const titulo = (await this.browser.page.getByRole('heading', { level: 1 }).textContent()) ?? '';
    assert.equal(/nao encontrado/i.test(titulo), false);
    assert.match(this.browser.page.url(), new RegExp(`/projetos/${slugObservado}$`));
  },
);

Then('esse projeto continua visível', async function (this: VitrineWorld): Promise<void> {
  assert.ok((await cartoes(this)).length > 0, 'a restricao ocultou o projeto multi-tecnologia');
});

Then(
  'o critério aplicado permanece visível para mim',
  async function (this: VitrineWorld): Promise<void> {
    const pressionados = await this.browser.page
      .getByRole('button')
      .evaluateAll((b) => b.filter((x) => x.getAttribute('aria-pressed') === 'true').length);
    assert.equal(pressionados, 1, 'o criterio aplicado nao esta sinalizado');
  },
);

Then(
  'a restrição não altera o endereço dos projetos nem impede que eu a remova',
  async function (this: VitrineWorld): Promise<void> {
    const depois = await this.browser.page
      .locator('article h3 a')
      .evaluateAll((links) =>
        links.map((l) => (l as HTMLAnchorElement).getAttribute('href') ?? ''),
      );
    for (const endereco of depois) {
      assert.ok(enderecoAntes.includes(endereco), `endereco mudou apos a restricao: ${endereco}`);
    }
    await this.browser.page.getByRole('button', { name: 'Todas', exact: true }).waitFor();
  },
);

Then(
  'eu vejo uma mensagem que explica que nenhum projeto atende ao critério',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.page
      .getByText('Nenhum projeto atende ao criterio escolhido.')
      .waitFor({ timeout: 3000 });
  },
);

Then('eu vejo como remover a restrição', async function (this: VitrineWorld): Promise<void> {
  await this.browser.page
    .getByRole('button', { name: 'Remover a restricao' })
    .waitFor({ timeout: 3000 });
});

Then(
  'eu não vejo uma área vazia sem explicação',
  async function (this: VitrineWorld): Promise<void> {
    assert.equal(await this.browser.page.locator('article').count(), 0);
    await this.browser.page
      .getByText('Nenhum projeto atende ao criterio escolhido.')
      .waitFor({ timeout: 3000 });
  },
);

Then(
  'a quantidade de projetos resultante me é anunciada',
  async function (this: VitrineWorld): Promise<void> {
    const anuncio = this.browser.page.getByRole('status');
    assert.equal(await anuncio.getAttribute('aria-live'), 'polite');
    assert.match((await anuncio.textContent()) ?? '', /\d+ projetos? encontrados?/);
  },
);

Then(
  'o meu foco permanece onde estava, no controle de restrição',
  async function (this: VitrineWorld): Promise<void> {
    const foco = await this.browser.page.evaluate(() => document.activeElement?.tagName ?? '');
    assert.equal(foco, 'BUTTON', 'o foco saiu do controle de restricao');
  },
);

Then(
  'esse projeto aparece em primeiro lugar e sinalizado como destaque',
  async function (this: VitrineWorld): Promise<void> {
    const declarada = await curadoria();
    const primeiro = declarada.projects[0];
    assert.equal((await cartoes(this))[0], primeiro?.name);
    const selo = await this.browser.page
      .locator('article')
      .first()
      .getByText('Em destaque')
      .count();
    assert.equal(selo, 1);
  },
);

Then(
  'nenhuma alteração de ordem ou destaque exigiu mudança em código de apresentação',
  async function (this: VitrineWorld): Promise<void> {
    const declarada = await curadoria();
    assert.deepEqual(
      await cartoes(this),
      declarada.projects.map((p) => p.name),
    );
  },
);

Then(
  'eu vejo o resumo declarado pela curadoria',
  async function (this: VitrineWorld): Promise<void> {
    const declarada = await curadoria();
    const projeto = declarada.projects.find((p) => p.slug === slugObservado);
    const conteudo = await this.browser.page.content();
    assert.ok(conteudo.includes(projeto?.summary ?? ' '), 'o resumo da curadoria nao aparece');
  },
);

Then(
  'eu não vejo resumo vazio nem o nome do repositório repetido no lugar do resumo',
  async function (): Promise<void> {
    const declarada = await curadoria();
    for (const projeto of declarada.projects) {
      assert.ok(projeto.summary.trim().length > 0);
      assert.notEqual(projeto.summary.trim(), projeto.repositories[0]);
    }
  },
);
