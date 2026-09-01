import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import type { VitrineWorld } from '../../support/world.ts';
import type { WorkflowJob } from '../../support/workflow_driver.ts';

/**
 * Passos que afirmam sobre a **forma** da esteira. Nao ha como executar o
 * GitHub Actions dentro da suite, e nem seria util: o que o diagrama desenha e
 * a declaracao, e e a declaracao que estes cenarios leem do disco.
 */

const VALIDAR = 'validar.yml';
const PROMOVER_DEVELOP = 'promover-develop.yml';
const PROMOVER_RELEASE = 'promover-release.yml';
const PUBLICAR_MASTER = 'publicar-master.yml';
const PUBLICAR_CATALOGO = 'publicar-catalogo.yml';

/** As sete verificacoes de `make validate`, do nome do job ao alvo que ele roda. */
const VERIFICACOES: ReadonlyArray<readonly [string, string]> = [
  ['Formatação', 'fmt'],
  ['Análise estática', 'lint'],
  ['Testes unitários', 'test'],
  ['Cobertura 90%', 'cover'],
  ['Integração', 'it'],
  ['Auditoria', 'audit-only'],
  ['Comportamento', 'bdd-only'],
];

const LIMITE_NOME = 20;
const LIMITE_PASSOS = 6;
const LIMITE_MINUTOS = 30;

function acha(jobs: readonly WorkflowJob[], nome: string): WorkflowJob {
  const job = jobs.find((candidato) => candidato.name === nome);
  assert.ok(job, `job ausente: recebido [${jobs.map((j) => j.name).join(', ')}], esperado ${nome}`);
  return job;
}

function rodaAlvo(job: WorkflowJob, alvo: string): boolean {
  return new RegExp(`make\\s+(-s\\s+)?${alvo}(\\s|$)`, 'm').test(job.script);
}

Given(
  'que existe uma branch de feature com um commit cuja descrição é conhecida',
  function (): void {
    return;
  },
);

Given('que a esteira de validação foi disparada por push em branch de feature', function (): void {
  return;
});

Given('que a esteira de validação foi disparada', function (): void {
  return;
});

Given(
  'que todos os jobs de verificação aprovaram na branch {string}',
  function (this: VitrineWorld, branch: string): void {
    this.esteiraBranch = branch;
    for (const [nome] of VERIFICACOES) {
      this.pipeline.stageResult(nome, 'sucesso');
    }
  },
);

Given(
  'que já existe Pull Request aberta da branch {string} para develop',
  function (this: VitrineWorld, branch: string): void {
    this.esteiraBranch = branch;
  },
);

Given(
  'que a Pull Request {string} foi mergeada',
  function (this: VitrineWorld, titulo: string): void {
    this.esteiraPullRequest = titulo;
  },
);

Given(
  'que a Pull Request {string} foi fechada sem merge',
  function (this: VitrineWorld, titulo: string): void {
    this.esteiraPullRequest = titulo;
  },
);

Given('que o estágio anterior construiu e auditou o sítio', function (): void {
  return;
});

Given('que o repositório declara seus proprietários de código', function (): void {
  return;
});

Given('que as ações da esteira estão definidas', function (): void {
  return;
});

Given('que um job da esteira deixou de responder', function (): void {
  return;
});

Given('que a publicação agendada do catálogo foi disparada', function (): void {
  return;
});

When('um push é feito nessa branch', function (): void {
  return;
});

When('eu observo o diagrama da execução', function (): void {
  return;
});

When('eu observo as dependências declaradas entre os jobs de verificação', function (): void {
  return;
});

When('um novo push é feito nessa mesma branch e a validação aprova', function (): void {
  return;
});

/** Da acao nomeada pelo cenario ao arquivo que a declara. */
const FLUXO_DA_ACAO: Readonly<Record<string, string>> = {
  develop: PROMOVER_DEVELOP,
  release: PROMOVER_RELEASE,
  master: PUBLICAR_MASTER,
};

When(
  'a ação {string} é executada',
  async function (this: VitrineWorld, acao: string): Promise<void> {
    const destino = acao.slice(acao.lastIndexOf('> ') + 2).split('/')[0] ?? '';
    const arquivo = FLUXO_DA_ACAO[destino];
    assert.ok(
      arquivo,
      `acao desconhecida: recebido ${acao}, esperado destino em [develop, release, master]`,
    );
    this.esteiraFluxo = await this.workflow.byFile(arquivo);
  },
);

When('a publicação no GitHub Pages acontece', function (): void {
  return;
});

When('uma Pull Request da esteira aguarda revisão', function (): void {
  return;
});

When('eu leio o nome de cada job', function (): void {
  return;
});

When('eu observo o gatilho de cada estágio de promoção', function (): void {
  return;
});

When('eu conto os passos de cada job', function (): void {
  return;
});

When('o tempo máximo declarado para esse job se esgota', function (): void {
  return;
});

When('eu observo o diagrama dessa execução', function (): void {
  return;
});

Then('a esteira de validação é disparada', async function (this: VitrineWorld): Promise<void> {
  const fluxo = await this.workflow.byFile(VALIDAR);
  assert.ok(fluxo.triggers.includes('push'), `gatilho ausente: esperado push em ${VALIDAR}`);
  assert.deepEqual(fluxo.pushBranches, ['feature/**']);
});

Then(
  'a execução é identificada pela descrição desse commit',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile(VALIDAR);
    assert.ok(
      fluxo.runName !== null && fluxo.runName.includes('head_commit.message'),
      `nome de execucao invalido: recebido ${String(fluxo.runName)}, esperado a mensagem do commit`,
    );
  },
);

Then(
  'a execução não é identificada por um nome fixo, igual para toda execução',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile(VALIDAR);
    assert.ok(fluxo.runName !== null && fluxo.runName.includes('${{'));
  },
);

Then(
  'eu vejo um job próprio para cada uma das sete verificações: formatação, análise estática, testes unitários, cobertura, integração, comportamento e auditoria',
  async function (this: VitrineWorld): Promise<void> {
    const jobs = await this.workflow.jobsOf(VALIDAR);
    for (const [nome, alvo] of VERIFICACOES) {
      assert.ok(rodaAlvo(acha(jobs, nome), alvo), `job ${nome} nao roda make ${alvo}`);
    }
  },
);

Then(
  'eu não vejo nenhuma dessas verificações escondida como passo dentro de um job de outra verificação',
  async function (this: VitrineWorld): Promise<void> {
    const jobs = await this.workflow.jobsOf(VALIDAR);
    for (const [nome, alvo] of VERIFICACOES) {
      const donos = jobs.filter((job) => rodaAlvo(job, alvo)).map((job) => job.name);
      assert.deepEqual(
        donos,
        [nome],
        `make ${alvo} roda em [${donos.join(', ')}], esperado ${nome}`,
      );
    }
  },
);

Then(
  'formatação, análise estática, testes unitários, cobertura e integração não dependem de nenhum outro job',
  async function (this: VitrineWorld): Promise<void> {
    const jobs = await this.workflow.jobsOf(VALIDAR);
    const independentes = [
      'Formatação',
      'Análise estática',
      'Testes unitários',
      'Cobertura 90%',
      'Integração',
    ];
    for (const nome of independentes) {
      assert.deepEqual(acha(jobs, nome).needs, [], `${nome} nao deveria depender de job algum`);
    }
  },
);

Then(
  'auditoria depende apenas do job de construção, e comportamento depende apenas do job de auditoria',
  async function (this: VitrineWorld): Promise<void> {
    const jobs = await this.workflow.jobsOf(VALIDAR);
    const construcao = acha(jobs, 'Construção');
    const auditoria = acha(jobs, 'Auditoria');
    assert.deepEqual(auditoria.needs, [construcao.id]);
    assert.deepEqual(acha(jobs, 'Comportamento').needs, [auditoria.id]);
  },
);

Then(
  'o sítio é construído uma única vez na execução, e auditado uma única vez',
  async function (this: VitrineWorld): Promise<void> {
    const jobs = await this.workflow.jobsOf(VALIDAR);
    assert.equal(jobs.filter((job) => rodaAlvo(job, 'build')).length, 1);
    assert.equal(jobs.filter((job) => rodaAlvo(job, 'audit-only')).length, 1);
  },
);

Then(
  'é aberta a Pull Request de título {string}',
  async function (this: VitrineWorld, titulo: string): Promise<void> {
    assert.equal(titulo, `PR - ${this.esteiraBranch} -> develop`);
    const abridor = acha(await this.workflow.jobsOf(VALIDAR), 'PR para develop');
    assert.ok(
      /PR - \$\{\{[^}]+\}\} -> develop/.test(abridor.script),
      `molde ausente: o job ${abridor.name} precisa montar "PR - <branch> -> develop"`,
    );
  },
);

Then(
  'nenhuma outra Pull Request é aberta pela mesma execução',
  async function (this: VitrineWorld): Promise<void> {
    const jobs = await this.workflow.jobsOf(VALIDAR);
    assert.equal(jobs.filter((job) => job.script.includes('gh pr create')).length, 1);
  },
);

Then(
  'a Pull Request existente é atualizada com o resultado da nova validação',
  async function (this: VitrineWorld): Promise<void> {
    const abridor = acha(await this.workflow.jobsOf(VALIDAR), 'PR para develop');
    assert.ok(
      abridor.script.includes('gh pr list'),
      'o job precisa consultar a Pull Request existente antes de decidir abrir',
    );
  },
);

Then(
  'nenhuma segunda Pull Request é aberta para a mesma branch',
  async function (this: VitrineWorld): Promise<void> {
    const abridor = acha(await this.workflow.jobsOf(VALIDAR), 'PR para develop');
    assert.ok(
      abridor.script.includes('gh pr edit') || abridor.script.includes('gh pr comment'),
      'sem caminho de atualizacao, o push seguinte abriria duplicata',
    );
  },
);

// O gatilho da promocao e o merge consumado, e nao a revisao aprovada: aprovar
// registra opiniao, mergear consuma o fato. Estes dois passos guardam essa
// distincao contra regressao — foi por ela que a cadeia ficou parada uma vez.
Then(
  'a promoção é disparada pelo merge, e não pela aprovação',
  function (this: VitrineWorld): void {
    const fluxo = this.esteiraFluxo;
    assert.ok(fluxo, 'nenhuma ação foi executada antes desta verificação');
    assert.ok(fluxo.triggers.includes('pull_request'), 'o gatilho precisa ser pull_request');
    assert.ok(
      !fluxo.triggers.includes('pull_request_review'),
      'aprovação não pode disparar estágio algum',
    );
    assert.ok(fluxo.raw.includes('types: [closed]'), 'o fluxo precisa reagir ao fechamento');
    assert.ok(fluxo.raw.includes('merged == true'), 'só merge consumado promove');
    assert.ok(!fluxo.raw.includes('review.state'), 'nenhum estágio pode filtrar estado de revisão');
  },
);

Then(
  'a ação só reage a merge de branch de feature em develop',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile(PROMOVER_DEVELOP);
    assert.ok(fluxo.raw.includes("base.ref == 'develop'"), 'o destino precisa ser develop');
    assert.ok(fluxo.raw.includes("head.ref, 'feature/'"), 'a origem precisa ser feature');
  },
);

Then(
  'é criada a branch {string} a partir de master',
  async function (this: VitrineWorld, branch: string): Promise<void> {
    assert.ok(branch.startsWith('release/'), `branch inesperada no cenario: ${branch}`);
    const fluxo = await this.workflow.byFile(PROMOVER_DEVELOP);
    const criador = acha(fluxo.jobs, 'Branch release');
    assert.ok(criador.script.includes('git/refs'), 'o job precisa criar a ref da release');
    assert.ok(
      criador.script.includes('refs/heads/release/'),
      'a ref criada precisa ser a da release',
    );
    assert.ok(criador.script.includes('heads/master'), 'a release precisa nascer de master');
  },
);

// O valor da versao atravessa a fronteira entre dois jobs. `echo "x=$(cmd)"`
// engole a falha de `cmd`, e foi assim que um JSON de erro virou nome de
// branch: o job reportou sucesso entregando lixo.
Then(
  'o job da versão confere o valor antes de entregá-lo ao job seguinte',
  async function (this: VitrineWorld): Promise<void> {
    const calculo = acha(await this.workflow.jobsOf(PROMOVER_DEVELOP), 'Versão');
    assert.ok(calculo.script.includes('v[0-9]'), 'o job precisa conferir o formato da versão');
    assert.ok(calculo.script.includes('exit 1'), 'formato inválido precisa reprovar o job');
  },
);

Then(
  'a branch de release nasce de master sem trazer a árvore de master para o runner',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile(PROMOVER_DEVELOP);
    assert.ok(
      !fluxo.raw.includes('ref: master'),
      'master não contém app/, e todo passo do contrato de operação morreria nela',
    );
  },
);

/** O titulo do cenario diz qual PR se espera, e o job que a abre segue esse nome. */
const ABRIDOR_DA_PR: ReadonlyArray<readonly [string, string, string]> = [
  ['-> release/', PROMOVER_DEVELOP, 'PR para release'],
  ['-> master', PROMOVER_RELEASE, 'PR para master'],
];

Then(
  'é aberta a Pull Request {string}',
  async function (this: VitrineWorld, titulo: string): Promise<void> {
    const alvo = ABRIDOR_DA_PR.find(([sufixo]) => titulo.includes(sufixo));
    assert.ok(alvo, `titulo desconhecido: recebido ${titulo}, esperado PR para release ou master`);
    const [, arquivo, job] = alvo;
    assert.ok(acha(await this.workflow.jobsOf(arquivo), job).script.includes('gh pr create'));
  },
);

Then('master não é alterada nesta etapa', async function (this: VitrineWorld): Promise<void> {
  const fluxo = await this.workflow.byFile(PROMOVER_DEVELOP);
  assert.ok(
    !/git\s+push\s+\S*origin\s+master/.test(fluxo.raw),
    'a promocao a develop nao pode escrever em master',
  );
});

Then(
  'a ação só reage a merge de develop em branch de release',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile(PROMOVER_RELEASE);
    assert.ok(fluxo.raw.includes("head.ref == 'develop'"), 'a origem precisa ser develop');
    assert.ok(fluxo.raw.includes("base.ref, 'release/'"), 'o destino precisa ser release');
  },
);

Then('nada é publicado nesta etapa', async function (this: VitrineWorld): Promise<void> {
  const fluxo = await this.workflow.byFile(PROMOVER_RELEASE);
  assert.ok(!fluxo.raw.includes('deploy-pages'), 'a promocao a release nao publica');
});

Then('o sítio é publicado no GitHub Pages', async function (this: VitrineWorld): Promise<void> {
  const jobs = await this.workflow.jobsOf(PUBLICAR_MASTER);
  assert.ok(acha(jobs, 'Publicação').uses.some((acao) => acao.startsWith('actions/deploy-pages')));
});

// O gatilho do estagio que publica e o push em master, e nao a Pull Request que
// o causou: o ambiente `github-pages` so aceita implantacao vinda de
// `refs/heads/master`, e uma execucao de `pull_request` carrega
// `refs/pull/<n>/merge`, que a protecao do ambiente recusa.
Then(
  'a publicação reage ao que entrou em master, e não à Pull Request',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile(PUBLICAR_MASTER);
    assert.ok(fluxo.triggers.includes('push'), 'o gatilho precisa ser o push em master');
    assert.ok(
      !fluxo.triggers.includes('pull_request'),
      'execução de pull_request não pode implantar: o ambiente recusa o ref dela',
    );
    assert.ok(fluxo.raw.includes('branches: [master]'), 'só master publica');
  },
);

Then(
  'a ação exige merge consumado, e fechamento sem merge não a dispara',
  function (this: VitrineWorld): void {
    const fluxo = this.esteiraFluxo;
    assert.ok(fluxo, 'nenhuma ação foi executada antes desta verificação');
    assert.ok(
      fluxo.raw.includes('merged == true'),
      'sem essa condição, descartar uma Pull Request promoveria a mudança',
    );
  },
);

Then(
  'isso vale igualmente para os dois estágios de promoção',
  async function (this: VitrineWorld): Promise<void> {
    for (const arquivo of [PROMOVER_DEVELOP, PROMOVER_RELEASE]) {
      const fluxo = await this.workflow.byFile(arquivo);
      assert.ok(fluxo.raw.includes('merged == true'), `${arquivo} promove sem merge consumado`);
    }
  },
);

Then(
  'são criadas a tag e a release da versão {string}',
  async function (this: VitrineWorld, versao: string): Promise<void> {
    assert.ok(versao.startsWith('v'), `versao inesperada no cenario: ${versao}`);
    const marcador = acha(await this.workflow.jobsOf(PUBLICAR_MASTER), 'Tag e release');
    assert.ok(marcador.script.includes('gh release create'));
  },
);

Then(
  'a marca da versão não é criada antes de a publicação ter concluído com sucesso',
  async function (this: VitrineWorld): Promise<void> {
    const jobs = await this.workflow.jobsOf(PUBLICAR_MASTER);
    assert.ok(acha(jobs, 'Tag e release').needs.includes(acha(jobs, 'Publicação').id));
  },
);

Then(
  'o que é publicado é o mesmo artefato que passou pela auditoria',
  async function (this: VitrineWorld): Promise<void> {
    const publicador = acha(await this.workflow.jobsOf(PUBLICAR_MASTER), 'Publicação');
    assert.ok(publicador.uses.some((acao) => acao.startsWith('actions/download-artifact')));
  },
);

Then(
  'não é feita uma construção nova sem verificação para publicar',
  async function (this: VitrineWorld): Promise<void> {
    const publicador = acha(await this.workflow.jobsOf(PUBLICAR_MASTER), 'Publicação');
    assert.ok(!rodaAlvo(publicador, 'build'), 'o job de publicacao nao pode reconstruir o sitio');
  },
);

Then(
  'a revisão que satisfaz o portão é a de um proprietário declarado',
  async function (this: VitrineWorld): Promise<void> {
    const proprietarios = await this.workflow.readCodeowners();
    assert.ok(/^\s*\*\s+@\S+/m.test(proprietarios), 'CODEOWNERS sem proprietario para a raiz');
  },
);

Then(
  'a esteira nunca mergeia a Pull Request de feature sozinha',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile(VALIDAR);
    assert.ok(
      !fluxo.raw.includes('gh pr merge'),
      'o portão humano é o merge da Pull Request de feature',
    );
  },
);

/** Destino que cada estagio promove, e que seu gatilho precisa filtrar. */
const DESTINO_DO_ESTAGIO: ReadonlyArray<readonly [string, string]> = [
  [PROMOVER_DEVELOP, 'branches: [develop]'],
  [PROMOVER_RELEASE, "branches: ['release/**']"],
  // O estagio 4 filtra master no gatilho de push, e nao no de pull_request.
  [PUBLICAR_MASTER, 'branches: [master]'],
];

// Os tres estagios escutam o mesmo evento. Sem filtro no gatilho, um merge cria
// tres execucoes: duas nascem so para se descartarem, e exibem nome errado,
// porque o `run-name` e calculado antes de o `if:` do job ser avaliado.
Then(
  'cada estágio filtra sua branch de destino já no gatilho',
  async function (this: VitrineWorld): Promise<void> {
    for (const [arquivo, filtro] of DESTINO_DO_ESTAGIO) {
      const fluxo = await this.workflow.byFile(arquivo);
      assert.ok(fluxo.raw.includes(filtro), `${arquivo} não filtra o destino no gatilho`);
    }
  },
);

Then(
  'nenhum estágio depende só do "if" do job para se descartar',
  async function (this: VitrineWorld): Promise<void> {
    for (const [arquivo] of DESTINO_DO_ESTAGIO) {
      const fluxo = await this.workflow.byFile(arquivo);
      const gatilho: string = fluxo.raw.slice(fluxo.raw.indexOf('on:'), fluxo.raw.indexOf('jobs:'));
      assert.ok(gatilho.includes('branches:'), `${arquivo} filtra o destino tarde demais`);
    }
  },
);

Then('nenhum nome passa de 20 caracteres', async function (this: VitrineWorld): Promise<void> {
  for (const job of await this.workflow.allJobs()) {
    assert.ok(
      job.name.length <= LIMITE_NOME,
      `nome longo: recebido "${job.name}" com ${job.name.length}, esperado ate ${LIMITE_NOME}`,
    );
  }
});

Then(
  'todo nome continua dizendo o que aquele job faz',
  async function (this: VitrineWorld): Promise<void> {
    for (const job of await this.workflow.allJobs()) {
      assert.ok(job.name.trim().length >= 4, `nome curto demais: recebido "${job.name}"`);
      assert.notEqual(job.name, job.id, `job ${job.id} nao declarou nome legivel`);
    }
  },
);

Then('nenhum job declara mais de 6 passos', async function (this: VitrineWorld): Promise<void> {
  for (const job of await this.workflow.allJobs()) {
    assert.ok(
      job.stepCount <= LIMITE_PASSOS,
      `job gordo: recebido ${job.name} com ${job.stepCount}, esperado ate ${LIMITE_PASSOS}`,
    );
  }
});

Then(
  'nenhuma etapa da esteira deixa de aparecer no diagrama por ter virado passo interno',
  async function (this: VitrineWorld): Promise<void> {
    for (const job of await this.workflow.allJobs()) {
      assert.ok(job.stepCount > 0, `job vazio: ${job.name}`);
    }
  },
);

Then(
  'o job termina com veredito explícito de falha por tempo esgotado',
  async function (this: VitrineWorld): Promise<void> {
    for (const job of await this.workflow.allJobs()) {
      assert.ok(
        job.timeoutMinutes !== null,
        `sem tempo maximo: recebido ${job.name} sem timeout-minutes, esperado ate ${LIMITE_MINUTOS}`,
      );
    }
  },
);

Then(
  'ele não permanece em execução indefinidamente',
  async function (this: VitrineWorld): Promise<void> {
    for (const job of await this.workflow.allJobs()) {
      assert.ok((job.timeoutMinutes ?? Infinity) <= LIMITE_MINUTOS, `tempo alto em ${job.name}`);
    }
  },
);

Then(
  'eu vejo suas etapas como jobs separados, e não como um job único',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile(PUBLICAR_CATALOGO);
    assert.ok(fluxo.triggers.includes('schedule'), 'a publicacao do catalogo perdeu o agendamento');
    assert.ok(fluxo.jobs.length >= 4, `recebido ${fluxo.jobs.length} jobs, esperado ao menos 4`);
  },
);

Then(
  'havendo falha, o motivo aparece no resumo sem que eu abra um job',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile(PUBLICAR_CATALOGO);
    assert.ok(fluxo.raw.includes('pipeline summary'), 'o fluxo agendado nao escreve resumo');
  },
);

Given('que master exige uma revisão aprovadora para aceitar merge', function (): void {
  return;
});

Given('que a integração falhou com uma mensagem de várias linhas', function (): void {
  return;
});

When('a esteira vai mergear a Pull Request que publica', function (): void {
  return;
});

When('a esteira registra o motivo para o resumo da execução', function (): void {
  return;
});

// A aprovacao aqui nao e gatilho de nada: o gatilho continua sendo o merge.
// Ela satisfaz a protecao de master, que exige uma revisao aprovadora.
Then(
  'ela aprova essa Pull Request com a credencial dedicada',
  async function (this: VitrineWorld): Promise<void> {
    const merge = acha(await this.workflow.jobsOf(PROMOVER_RELEASE), 'Merge master');
    assert.ok(merge.script.includes('gh pr review'), 'sem aprovação, master recusa o merge');
    assert.ok(merge.script.includes('--approve'), 'a revisão precisa ser aprovadora');
  },
);

Then(
  'quem a abriu foi a credencial padrão, porque ninguém aprova a própria',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile(PROMOVER_RELEASE);
    assert.ok(
      fluxo.raw.includes('GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}'),
      'aberta pela credencial dedicada, ela não poderia ser aprovada por ela mesma',
    );
  },
);

// `KEY=valor` no GITHUB_ENV so aceita uma linha. Escrito assim, um motivo
// multilinha derrubava o proprio mecanismo que existe para mostra-lo.
Then(
  'o motivo atravessa inteiro, com delimitador em vez de uma linha só',
  async function (this: VitrineWorld): Promise<void> {
    for (const arquivo of [PROMOVER_DEVELOP, PROMOVER_RELEASE]) {
      const fluxo = await this.workflow.byFile(arquivo);
      assert.ok(
        fluxo.raw.includes('DETALHE<<'),
        `${arquivo} escreve o motivo em uma linha só, e trunca o que importa`,
      );
    }
  },
);
