import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import type { VitrineWorld } from '../../support/world.ts';

/**
 * Passos que exercitam a **decisao** da esteira: qual versao, qual modo, se o
 * portao aprova, qual a causa da falha e o que o resumo diz. Chamam os casos de
 * uso de verdade, sem rede, sem navegador e sem processo.
 */

const VERIFICACOES = [
  'Formatação',
  'Análise estática',
  'Testes unitários',
  'Cobertura 90%',
  'Integração',
  'Auditoria',
  'Comportamento',
];

const MEDIDA_COBERTURA = 'All files | 84.12 | minimo exigido 90%';
const ARQUIVOS_FORA_DE_FORMATO = 'app/styles.css, app/main.ts';
const SAIDA_CONFLITO =
  'CONFLICT (content): Merge conflict in app/styles.css\nAutomatic merge failed; branch develop';
const SAIDA_CREDENCIAL = 'gh: Bad credentials — ESTEIRA_TOKEN ausente no repositorio';
const MAX_LINHAS_CAUSA = 3;

function corpo(bloco: string): readonly string[] {
  return bloco.trim().split('\n').slice(1);
}

Given(
  'que a mudança na branch de feature deixa a cobertura de linhas abaixo de 90%',
  function (this: VitrineWorld): void {
    this.pipeline.stageResult('Cobertura 90%', 'falha', MEDIDA_COBERTURA);
  },
);

Given(
  'que existe na branch um arquivo fora do formato do projeto',
  function (this: VitrineWorld): void {
    this.pipeline.stageResult('Formatação', 'falha', ARQUIVOS_FORA_DE_FORMATO);
  },
);

Given(
  'que todas as verificações aprovaram exceto uma, que reprovou',
  function (this: VitrineWorld): void {
    for (const nome of VERIFICACOES) {
      this.pipeline.stageResult(nome, nome === 'Comportamento' ? 'falha' : 'sucesso');
    }
  },
);

Given(
  'que a última versão publicada é {string}',
  function (this: VitrineWorld, versao: string): void {
    this.pipeline.setLatestVersion(versao);
  },
);

Given('que não existe versão publicada alguma', function (this: VitrineWorld): void {
  this.pipeline.setLatestVersion(null);
});

Given(
  'que os commits promovidos declaram funcionalidade nova, sem mudança incompatível',
  function (this: VitrineWorld): void {
    this.pipeline.commitMessages = [
      'feat(catalogo): exibe a atividade do projeto',
      'fix: ajusta o rodape',
    ];
  },
);

Given(
  'que os commits promovidos declaram funcionalidade nova',
  function (this: VitrineWorld): void {
    this.pipeline.commitMessages = ['feat(esteira): entrega o site por acao'];
  },
);

Given(
  'que os commits promovidos declaram mudança incompatível',
  function (this: VitrineWorld): void {
    this.pipeline.commitMessages = ['feat(rotas)!: renomeia o endereco das paginas de projeto'];
  },
);

Given(
  'que os commits promovidos não declaram funcionalidade nova nem mudança incompatível',
  function (this: VitrineWorld): void {
    this.pipeline.commitMessages = [
      'fix: corrige o contraste do rodape',
      'docs: atualiza o README',
    ];
  },
);

Given(
  'que a credencial dedicada da esteira não está registrada como segredo do repositório',
  function (this: VitrineWorld): void {
    this.pipeline.summary = SAIDA_CREDENCIAL;
  },
);

Given(
  'que a branch de destino avançou e conflita com a branch de origem',
  function (this: VitrineWorld): void {
    this.pipeline.summary = SAIDA_CONFLITO;
  },
);

Given('que a esteira opera em modo automático', function (this: VitrineWorld): void {
  this.pipeline.environment = { ESTEIRA_MODO: 'automatico' };
});

Given(
  'que a configuração do repositório define o modo automático',
  function (this: VitrineWorld): void {
    this.pipeline.environment = { ESTEIRA_MODO: 'automatico' };
  },
);

Given(
  'que a Pull Request de feature recebeu a marcação de modo manual',
  function (this: VitrineWorld): void {
    this.pipeline.environment = {
      ...this.pipeline.environment,
      ESTEIRA_MODO_ROTULO: 'urgente,manual',
    };
  },
);

Given(
  'que o repositório não define modo algum e a Pull Request não tem marcação',
  function (this: VitrineWorld): void {
    this.pipeline.environment = {};
  },
);

Given('que uma execução da esteira terminou', function (this: VitrineWorld): void {
  for (const nome of VERIFICACOES) {
    const falhou = nome === 'Cobertura 90%';
    this.pipeline.stageResult(nome, falhou ? 'falha' : 'sucesso', falhou ? MEDIDA_COBERTURA : '');
  }
  this.pipeline.evaluateGate();
});

When(
  'a esteira de validação executa a verificação de cobertura',
  function (this: VitrineWorld): void {
    this.pipeline.renderJob('Cobertura 90%', 'falha', MEDIDA_COBERTURA);
  },
);

When('o job de formatação é executado', function (this: VitrineWorld): void {
  this.pipeline.renderJob('Formatação', 'falha', ARQUIVOS_FORA_DE_FORMATO);
});

When('o portão de validação é avaliado', function (this: VitrineWorld): void {
  this.pipeline.evaluateGate();
});

When(
  'a esteira decide o número da nova versão',
  async function (this: VitrineWorld): Promise<void> {
    await this.pipeline.resolveVersion();
  },
);

When('uma ação de promoção é executada', function (this: VitrineWorld): void {
  this.pipeline.classifyFailure(this.pipeline.summary);
});

When('a esteira tenta a integração', function (this: VitrineWorld): void {
  this.pipeline.classifyFailure(this.pipeline.summary);
});

When('a esteira decide como tratar os merges da cadeia', function (this: VitrineWorld): void {
  this.pipeline.resolveMode();
});

When(
  'a Pull Request {string} é mergeada por um proprietário',
  function (this: VitrineWorld, titulo: string): void {
    assert.ok(titulo.startsWith('PR - feature/'), `esperada a PR de feature, recebido ${titulo}`);
    this.pipeline.resolveMode();
  },
);

When('a Pull Request {string} é aberta', function (this: VitrineWorld, titulo: string): void {
  assert.ok(titulo.startsWith('PR - '), `titulo inesperado no cenario: ${titulo}`);
  this.pipeline.resolveMode();
});

When('eu abro o resumo dessa execução', function (): void {
  return;
});

Then('o job de cobertura reprova', function (this: VitrineWorld): void {
  assert.ok(this.pipeline.summary.startsWith('### ❌ Cobertura 90%'));
});

Then(
  'o resumo da execução informa a cobertura medida e o mínimo exigido de 90%',
  function (this: VitrineWorld): void {
    assert.ok(this.pipeline.summary.includes('84.12'), 'o resumo precisa trazer a medida');
    assert.ok(this.pipeline.summary.includes('90%'), 'o resumo precisa trazer o minimo exigido');
  },
);

Then('a esteira não abre a Pull Request para develop', function (this: VitrineWorld): void {
  this.pipeline.evaluateGate();
  assert.equal(this.pipeline.verdict?.approved, false);
});

Then(
  'o job reprova e o resumo nomeia os arquivos fora de formato',
  function (this: VitrineWorld): void {
    assert.ok(this.pipeline.summary.startsWith('### ❌ Formatação'));
    assert.ok(this.pipeline.summary.includes('app/styles.css'));
  },
);

Then(
  'nenhum commit de formatação é empurrado para a branch',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile('validar.yml');
    assert.ok(
      !/git\s+push/.test(fluxo.raw),
      'a validacao nao pode escrever na branch de quem programa',
    );
  },
);

Then('o portão reprova e nomeia a verificação que falhou', function (this: VitrineWorld): void {
  assert.equal(this.pipeline.verdict?.approved, false);
  assert.ok(this.pipeline.verdict?.reason.includes('Comportamento'));
});

Then(
  'nenhum estágio posterior da esteira é executado',
  async function (this: VitrineWorld): Promise<void> {
    const jobs = await this.workflow.jobsOf('validar.yml');
    const abridor = jobs.find((job) => job.name === 'PR para develop');
    const portao = jobs.find((job) => job.name === 'Portão');
    assert.ok(abridor && portao && abridor.needs.includes(portao.id));
  },
);

Then(
  'as verificações aprovadas continuam exibindo seu resultado próprio de aprovação',
  function (this: VitrineWorld): void {
    const aprovados = this.pipeline.results.filter((resultado) => resultado.status === 'sucesso');
    assert.equal(aprovados.length, VERIFICACOES.length - 1);
  },
);

Then('a nova versão é {string}', function (this: VitrineWorld, esperada: string): void {
  assert.equal(this.pipeline.formattedNextVersion(), esperada);
});

Then('nenhuma tag existente é sobrescrita', function (this: VitrineWorld): void {
  assert.notEqual(
    this.pipeline.formattedNextVersion(),
    this.pipeline.latestVersion === null ? '' : 'v1.2.3',
  );
});

Then(
  'o incremento dos commits não é aplicado sobre ela, e a esteira não falha por não encontrar versão anterior',
  function (this: VitrineWorld): void {
    assert.equal(this.pipeline.latestVersion, null);
    assert.equal(this.pipeline.formattedNextVersion(), 'v1.0.0');
  },
);

Then(
  'a execução reprova declarando que a causa foi ausência da credencial dedicada',
  function (this: VitrineWorld): void {
    assert.equal(this.pipeline.cause, 'credencial');
  },
);

Then(
  'a execução não termina apenas com erro genérico de comando',
  function (this: VitrineWorld): void {
    assert.notEqual(this.pipeline.cause, 'desconhecida');
  },
);

Then(
  'a execução reprova nomeando a branch de destino e os arquivos em conflito',
  function (this: VitrineWorld): void {
    assert.equal(this.pipeline.cause, 'conflito');
    assert.ok(this.pipeline.summary.includes('app/styles.css'));
    assert.ok(this.pipeline.summary.includes('develop'));
  },
);

Then(
  'a esteira não altera a branch de origem para tentar resolver o conflito',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile('promover-develop.yml');
    assert.ok(!/git\s+merge\s+origin/.test(fluxo.raw));
  },
);

Then(
  'as Pull Requests seguintes da cadeia são mergeadas pela própria esteira',
  async function (this: VitrineWorld): Promise<void> {
    assert.equal(this.pipeline.mode, 'automatico');
    const fluxo = await this.workflow.byFile('promover-develop.yml');
    assert.ok(fluxo.raw.includes("needs.modo.outputs.modo == 'automatico'"));
    assert.ok(fluxo.raw.includes('gh pr merge'));
  },
);

Then(
  'a primeira Pull Request não é mergeada pela esteira em nenhuma hipótese',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile('validar.yml');
    assert.ok(
      !fluxo.raw.includes('gh pr merge'),
      'a esteira nunca mergeia a Pull Request de feature',
    );
  },
);

Then('a esteira aguarda merge humano antes de prosseguir', function (this: VitrineWorld): void {
  assert.equal(this.pipeline.mode, 'manual');
});

Then(
  'a esteira não mergeia essa Pull Request sozinha',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile('promover-develop.yml');
    assert.ok(fluxo.raw.includes("needs.modo.outputs.modo == 'automatico'"));
  },
);

Then('ela opera em modo automático', function (this: VitrineWorld): void {
  assert.equal(this.pipeline.mode, 'automatico');
});

Then(
  'ela registra no resumo da execução qual modo está em vigor',
  async function (this: VitrineWorld): Promise<void> {
    const fluxo = await this.workflow.byFile('promover-develop.yml');
    assert.ok(fluxo.raw.includes('modo em vigor'));
  },
);

Then(
  'eu leio o que foi verificado, o que passou e o que reprovou',
  function (this: VitrineWorld): void {
    assert.ok(this.pipeline.summary.includes('Portão reprovado'));
    assert.ok(this.pipeline.summary.includes('Cobertura 90%'));
  },
);

Then(
  'havendo reprovação, eu leio a causa em no máximo três linhas',
  function (this: VitrineWorld): void {
    assert.ok(corpo(this.pipeline.summary).length <= MAX_LINHAS_CAUSA);
  },
);

Then(
  'eu não preciso abrir nenhum job para saber qual etapa falhou',
  function (this: VitrineWorld): void {
    assert.ok(this.pipeline.summary.includes('reprovaram: Cobertura 90%'));
  },
);
