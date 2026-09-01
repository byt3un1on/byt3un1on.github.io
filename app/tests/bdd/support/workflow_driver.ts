import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';

/** Um job da esteira, na forma que os cenarios de legibilidade medem. */
export interface WorkflowJob {
  readonly id: string;
  readonly name: string;
  readonly needs: readonly string[];
  readonly stepCount: number;
  readonly timeoutMinutes: number | null;
  /** Texto de todos os `run` do job, concatenado — e por ele que se ve o que o job de fato faz. */
  readonly script: string;
  /** Acoes de terceiro que o job usa, na ordem declarada. */
  readonly uses: readonly string[];
}

/** Um fluxo da esteira, lido da definicao em `.github/workflows`. */
export interface WorkflowDefinition {
  readonly file: string;
  readonly name: string;
  readonly runName: string | null;
  readonly triggers: readonly string[];
  readonly pushBranches: readonly string[];
  readonly jobs: readonly WorkflowJob[];
  readonly raw: string;
}

/** Diretorios onde a esteira pode estar, conforme o teste rode dentro ou fora do container. */
const CAMINHOS_POSSIVEIS = ['.github', '../.github'] as const;

function asArray(value: unknown): readonly string[] {
  if (typeof value === 'string') {
    return [value];
  }
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

/**
 * O interpretador entrega `on:` como chave booleana quando o documento e lido
 * pelo esquema antigo. Aceitar as duas formas evita que a suite inteira dependa
 * de um detalhe do interpretador.
 */
function readTriggers(document: Record<string, unknown>): Record<string, unknown> {
  const gatilhos = document['on'] ?? document[String(true)];
  if (gatilhos === null || typeof gatilhos !== 'object') {
    return {};
  }
  return gatilhos as Record<string, unknown>;
}

function readSteps(value: unknown): readonly Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function readJob(id: string, definition: Record<string, unknown>): WorkflowJob {
  const steps = readSteps(definition['steps']);
  const timeout = definition['timeout-minutes'];
  return Object.freeze({
    id,
    name: typeof definition['name'] === 'string' ? definition['name'] : id,
    needs: asArray(definition['needs']),
    stepCount: steps.length,
    timeoutMinutes: typeof timeout === 'number' ? timeout : null,
    script: steps.map((step) => (typeof step['run'] === 'string' ? step['run'] : '')).join('\n'),
    uses: steps
      .map((step) => (typeof step['uses'] === 'string' ? step['uses'] : ''))
      .filter((acao) => acao.length > 0),
  });
}

/**
 * Motor de definicao: le a esteira como ela esta no disco e a expoe em forma
 * medivel. Nao executa fluxo nenhum — os cenarios de forma afirmam sobre a
 * declaracao, que e o que o diagrama do GitHub Actions desenha.
 */
export class WorkflowDriver {
  private definitions: readonly WorkflowDefinition[] = [];

  public async load(): Promise<readonly WorkflowDefinition[]> {
    if (this.definitions.length > 0) {
      return this.definitions;
    }
    const raiz = await this.findRoot();
    const diretorio = join(raiz, 'workflows');
    const arquivos = (await readdir(diretorio)).filter((nome) => nome.endsWith('.yml')).sort();
    this.definitions = await Promise.all(
      arquivos.map((nome) => this.readDefinition(diretorio, nome)),
    );
    return this.definitions;
  }

  public async byFile(file: string): Promise<WorkflowDefinition> {
    const encontrado = (await this.load()).find((definicao) => definicao.file === file);
    if (encontrado === undefined) {
      const conhecidos = (await this.load()).map((definicao) => definicao.file).join(', ');
      throw new Error(`fluxo ausente: recebido ${file}, esperado um de [${conhecidos}]`);
    }
    return encontrado;
  }

  public async jobsOf(file: string): Promise<readonly WorkflowJob[]> {
    return (await this.byFile(file)).jobs;
  }

  public async allJobs(): Promise<readonly WorkflowJob[]> {
    return (await this.load()).flatMap((definicao) => definicao.jobs);
  }

  public async codeownersPath(): Promise<string> {
    return join(await this.findRoot(), 'CODEOWNERS');
  }

  public async readCodeowners(): Promise<string> {
    return readFile(await this.codeownersPath(), 'utf8');
  }

  private async readDefinition(diretorio: string, nome: string): Promise<WorkflowDefinition> {
    const raw = await readFile(join(diretorio, nome), 'utf8');
    const documento = (parse(raw) ?? {}) as Record<string, unknown>;
    const gatilhos = readTriggers(documento);
    const jobs = (documento['jobs'] ?? {}) as Record<string, Record<string, unknown>>;
    return Object.freeze({
      file: nome,
      name: typeof documento['name'] === 'string' ? documento['name'] : nome,
      runName: typeof documento['run-name'] === 'string' ? documento['run-name'] : null,
      triggers: Object.keys(gatilhos),
      pushBranches: asArray(
        (gatilhos['push'] as Record<string, unknown> | undefined)?.['branches'],
      ),
      jobs: Object.entries(jobs).map(([id, definicao]) => readJob(id, definicao)),
      raw,
    });
  }

  /** Sem a montagem do compose o diretorio nao existe, e o cenario precisa dizer isso. */
  private async findRoot(): Promise<string> {
    for (const candidato of CAMINHOS_POSSIVEIS) {
      const caminho = resolve(candidato);
      const existe = await stat(join(caminho, 'workflows')).then(
        () => true,
        () => false,
      );
      if (existe) {
        return caminho;
      }
    }
    throw new Error(
      `esteira ilegivel: recebido nenhum de [${CAMINHOS_POSSIVEIS.join(', ')}] a partir de ` +
        `${resolve('.')}, esperado o diretorio .github montado no servico dev`,
    );
  }
}
