import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import type { CatalogDto } from '../../../core/domain/dtos/catalog_dto.ts';

const run = promisify(execFile);

export interface ProcessResult {
  readonly exitCode: number;
  readonly stdout: string;
}

/**
 * Motor de processo: executa os alvos de publicacao de verdade, contra o
 * WireMock, **em diretorio de saida proprio**. Sem esse isolamento ele
 * sobrescreveria o catalogo que os cenarios de navegador estao exercitando, e a
 * ordem de execucao passaria a mudar o resultado.
 */
export class ProcessDriver {
  private workDir = '';
  private lastResult: ProcessResult = { exitCode: 0, stdout: '' };

  /** Carrega no WireMock o estado de mundo que o cenario precisa atravessar. */
  public async loadStubs(fixture: string): Promise<void> {
    const admin = `${process.env['WIREMOCK_BASE_URL'] ?? 'http://wiremock:8080'}/__admin/mappings`;
    await fetch(admin, { method: 'DELETE' });
    const mappings = JSON.parse(
      await readFile(resolve('tests/bdd/fixtures/stubs', fixture), 'utf8'),
    ) as readonly unknown[];
    for (const mapping of mappings) {
      const response = await fetch(admin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapping),
      });
      if (!response.ok) {
        throw new Error(`wiremock recusou o stub de ${fixture}: status ${response.status}`);
      }
    }
  }

  public async start(): Promise<void> {
    this.workDir = await mkdtemp(join(tmpdir(), 'publicacao-'));
  }

  public async stop(): Promise<void> {
    if (this.workDir !== '') {
      await rm(this.workDir, { recursive: true, force: true });
      this.workDir = '';
    }
  }

  public get catalogPath(): string {
    return join(this.workDir, 'catalog.generated.json');
  }

  public get routesPath(): string {
    return join(this.workDir, 'prerender-routes.txt');
  }

  public async generateCatalog(curationFixture: string): Promise<ProcessResult> {
    return this.execute('main_catalog.ts', [], {
      CURATION_PATH: resolve('tests/bdd/fixtures/curation', curationFixture),
      CATALOG_OUTPUT_PATH: this.catalogPath,
      PRERENDER_ROUTES_PATH: this.routesPath,
    });
  }

  public async reportPublication(outcome: string, reason: string): Promise<ProcessResult> {
    return this.execute('main_report.ts', [outcome, reason], {});
  }

  public get result(): ProcessResult {
    return this.lastResult;
  }

  public async readCatalog(): Promise<CatalogDto> {
    return JSON.parse(await readFile(this.catalogPath, 'utf8')) as CatalogDto;
  }

  public async catalogExists(): Promise<boolean> {
    try {
      await readFile(this.catalogPath, 'utf8');
      return true;
    } catch {
      return false;
    }
  }

  private async execute(
    entry: string,
    args: readonly string[],
    env: Readonly<Record<string, string>>,
  ): Promise<ProcessResult> {
    const ambiente = {
      ...process.env,
      GITHUB_API_BASE_URL: process.env['WIREMOCK_BASE_URL'] ?? 'http://wiremock:8080',
      GITHUB_ORG: 'byt3un1on',
      SITE_REPOSITORY: 'byt3un1on/byt3un1on.github.io',
      GITHUB_TOKEN: 'ghs_teste',
      ...env,
    };
    try {
      const { stdout } = await run('node', ['--experimental-transform-types', entry, ...args], {
        env: ambiente,
      });
      this.lastResult = { exitCode: 0, stdout };
    } catch (error) {
      const falha = error as { code?: number; stdout?: string };
      this.lastResult = { exitCode: falha.code ?? 1, stdout: falha.stdout ?? '' };
    }
    return this.lastResult;
  }
}
