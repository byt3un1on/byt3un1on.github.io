import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import type { VitrineWorld } from '../../support/world.ts';

/** Guarda qual curadoria o cenario armou, para o passo de execucao usa-la. */
let curadoriaEscolhida = 'valida.json';

// --- Dado ------------------------------------------------------------------

Given(
  'que a curadoria declara o repositório {string}',
  async function (this: VitrineWorld, _repositorio: string): Promise<void> {
    curadoriaEscolhida = 'declara_inelegiveis.json';
    await this.process.loadStubs('organizacao_completa.json');
  },
);

Given(
  'que a curadoria declara um projeto sem resumo escrito',
  async function (this: VitrineWorld): Promise<void> {
    curadoriaEscolhida = 'sem_resumo.json';
    await this.process.loadStubs('organizacao_completa.json');
  },
);

Given(
  'que a curadoria declara um repositório que não existe mais na organização',
  async function (this: VitrineWorld): Promise<void> {
    curadoriaEscolhida = 'referencia_inexistente.json';
    await this.process.loadStubs('organizacao_completa.json');
  },
);

Given(
  'que a curadoria declara o mesmo repositório em dois projetos distintos',
  async function (this: VitrineWorld): Promise<void> {
    curadoriaEscolhida = 'repositorio_repetido.json';
    await this.process.loadStubs('organizacao_completa.json');
  },
);

Given(
  'que {string} é privado na organização',
  async function (this: VitrineWorld, _nome: string): Promise<void> {
    curadoriaEscolhida = 'declara_inelegiveis.json';
    await this.process.loadStubs('organizacao_completa.json');
  },
);

Given(
  'que {string} não possui nenhum commit',
  async function (this: VitrineWorld, _nome: string): Promise<void> {
    curadoriaEscolhida = 'declara_inelegiveis.json';
    await this.process.loadStubs('organizacao_completa.json');
  },
);

Given('que a versão atual do sítio está no ar', async function (this: VitrineWorld): Promise<void> {
  curadoriaEscolhida = 'valida.json';
  await this.process.loadStubs('organizacao_indisponivel.json');
});

Given('que uma publicação foi abortada', async function (this: VitrineWorld): Promise<void> {
  await this.process.loadStubs('questoes_sem_aberta.json');
});

Given(
  'que existe uma questão aberta por uma publicação abortada',
  async function (this: VitrineWorld): Promise<void> {
    await this.process.loadStubs('questoes_com_aberta.json');
  },
);

// --- Quando ----------------------------------------------------------------

When('o catálogo de projetos é montado', async function (this: VitrineWorld): Promise<void> {
  await this.process.generateCatalog(curadoriaEscolhida);
});

When('a publicação do sítio é executada', async function (this: VitrineWorld): Promise<void> {
  await this.process.generateCatalog(curadoriaEscolhida);
});

When(
  'a publicação é executada e o catálogo da organização não pode ser obtido integralmente',
  async function (this: VitrineWorld): Promise<void> {
    await this.process.generateCatalog(curadoriaEscolhida);
  },
);

When('o aborto é registrado', async function (this: VitrineWorld): Promise<void> {
  await this.process.reportPublication('failure', 'catalogo indisponivel');
});

When('uma publicação conclui com sucesso', async function (this: VitrineWorld): Promise<void> {
  await this.process.reportPublication('success', 'publicacao concluida');
});

// --- Então -----------------------------------------------------------------

Then(
  '{string} não aparece em lugar nenhum do sítio',
  async function (this: VitrineWorld, nome: string): Promise<void> {
    if (this.browser.active) {
      const conteudo = await this.browser.page.content();
      assert.equal(conteudo.includes(nome), false, `"${nome}" apareceu na pagina`);
      return;
    }
    const catalogo = await this.process.readCatalog();
    assert.equal(
      JSON.stringify(catalogo).includes(nome),
      false,
      `"${nome}" apareceu no catalogo gerado`,
    );
  },
);

Then(
  '{string} não aparece no catálogo',
  async function (this: VitrineWorld, nome: string): Promise<void> {
    const catalogo = await this.process.readCatalog();
    assert.equal(JSON.stringify(catalogo).includes(nome), false);
  },
);

Then(
  'os demais projetos declarados continuam sendo exibidos',
  async function (this: VitrineWorld): Promise<void> {
    const catalogo = await this.process.readCatalog();
    assert.ok(catalogo.projects.length > 0, 'nenhum projeto sobreviveu');
  },
);

Then(
  'a publicação falha indicando qual entrada de curadoria está sem resumo',
  function (this: VitrineWorld): void {
    assert.notEqual(this.process.result.exitCode, 0);
    assert.match(this.process.result.stdout, /entrada sem resumo escrito/);
  },
);

Then(
  'a publicação falha indicando qual referência está quebrada',
  function (this: VitrineWorld): void {
    assert.notEqual(this.process.result.exitCode, 0);
    assert.match(this.process.result.stdout, /referencia a repositorio inexistente/);
  },
);

Then(
  'a publicação falha indicando o repositório repetido e os dois projetos que o declaram',
  function (this: VitrineWorld): void {
    assert.notEqual(this.process.result.exitCode, 0);
    assert.match(this.process.result.stdout, /repositorio declarado em mais de um projeto/);
  },
);

Then('a publicação é abortada e informa a falha', function (this: VitrineWorld): void {
  assert.notEqual(this.process.result.exitCode, 0);
  assert.match(this.process.result.stdout, /publicacao abortada/);
});

Then(
  'a versão anterior do sítio permanece no ar, intacta',
  async function (this: VitrineWorld): Promise<void> {
    assert.equal(
      await this.process.catalogExists(),
      false,
      'catalogo foi escrito apesar do aborto',
    );
  },
);

Then(
  'existe uma questão aberta no repositório do sítio com o motivo da falha',
  function (this: VitrineWorld): void {
    assert.equal(this.process.result.exitCode, 0);
    assert.match(this.process.result.stdout, /desfecho registrado/);
  },
);

Then('essa questão é encerrada automaticamente', function (this: VitrineWorld): void {
  assert.equal(this.process.result.exitCode, 0);
  assert.match(this.process.result.stdout, /desfecho registrado/);
});

// --- Mas -------------------------------------------------------------------

Then(
  'nenhum projeto com ficha incompleta é publicado',
  async function (this: VitrineWorld): Promise<void> {
    assert.equal(await this.process.catalogExists(), false);
  },
);

Then(
  'a vitrine não é publicada omitindo silenciosamente esse projeto',
  async function (this: VitrineWorld): Promise<void> {
    assert.equal(await this.process.catalogExists(), false);
  },
);

Then(
  'nenhum catálogo com repositório duplicado é publicado',
  async function (this: VitrineWorld): Promise<void> {
    assert.equal(await this.process.catalogExists(), false);
  },
);

Then(
  'nenhuma versão com catálogo parcial ou vazio é publicada',
  async function (this: VitrineWorld): Promise<void> {
    assert.equal(await this.process.catalogExists(), false);
  },
);

Then('nenhuma mensagem de erro é exibida ao visitante', function (this: VitrineWorld): void {
  assert.equal(this.process.result.exitCode, 0);
});

Then(
  'nenhuma questão duplicada é aberta enquanto a anterior seguir em aberto',
  function (this: VitrineWorld): void {
    assert.equal(this.process.result.exitCode, 0);
  },
);

Then('nenhuma outra questão do repositório é alterada', function (this: VitrineWorld): void {
  assert.equal(this.process.result.exitCode, 0);
});
