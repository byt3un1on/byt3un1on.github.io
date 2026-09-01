import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildPipelineCliEntry } from '../../../../infra/init/pipeline_ioc_init.ts';

const run = promisify(execFile);

let diretorio = '';
let resumo = '';
let anterior = '';

/**
 * Exercita a fiacao real — `buildPipelineCliEntry` — contra git e disco de
 * verdade. O diretorio corrente e trocado porque o repositorio de historico
 * roda `git` onde o processo esta, e `/app` nao e um clone.
 */
async function git(...args: readonly string[]): Promise<void> {
  await run('git', ['-C', diretorio, ...args]);
}

describe('PipelineCliEntry com a fiacao real', () => {
  beforeEach(async () => {
    anterior = process.cwd();
    diretorio = await mkdtemp(join(tmpdir(), 'esteira-cli-'));
    resumo = join(diretorio, 'resumo.md');
    await git('init', '--initial-branch=master');
    await git('config', 'user.email', 'esteira@byt3un1on.dev');
    await git('config', 'user.name', 'Esteira');
    await git('commit', '--allow-empty', '-m', 'feat: primeira entrega');
    process.chdir(diretorio);
    process.env['ESTEIRA_RESUMO'] = resumo;
  });

  afterEach(async () => {
    process.chdir(anterior);
    delete process.env['ESTEIRA_RESUMO'];
    delete process.env['ESTEIRA_MODO'];
    delete process.env['ESTEIRA_MODO_ROTULO'];
    delete process.env['ESTEIRA_RESULTADOS'];
    delete process.env['ESTEIRA_JOB'];
    delete process.env['ESTEIRA_STATUS'];
    delete process.env['ESTEIRA_DETALHE'];
    await rm(diretorio, { recursive: true, force: true });
  });

  it('deve devolver a primeira versao quando o repositorio nao tem marca alguma', async () => {
    // Arrange
    const saida: string[] = [];
    const original = console.log;
    console.log = (linha: string): void => void saida.push(linha);

    // Act
    const codigo = await buildPipelineCliEntry().run(['version']);
    console.log = original;

    // Assert
    expect(saida).toEqual(['v1.0.0']);
    expect(codigo).toBe(0);
  });

  it('deve elevar a minor quando ha marca anterior e commit de funcionalidade', async () => {
    // Arrange
    await git('tag', 'v1.2.3');
    await git('commit', '--allow-empty', '-m', 'feat: segunda entrega');
    const saida: string[] = [];
    const original = console.log;
    console.log = (linha: string): void => void saida.push(linha);

    // Act
    await buildPipelineCliEntry().run(['version']);
    console.log = original;

    // Assert
    expect(saida).toEqual(['v1.3.0']);
  });

  it('deve devolver o modo automatico quando o ambiente nao declara modo algum', async () => {
    // Arrange
    const saida: string[] = [];
    const original = console.log;
    console.log = (linha: string): void => void saida.push(linha);

    // Act
    await buildPipelineCliEntry().run(['mode']);
    console.log = original;

    // Assert
    expect(saida).toEqual(['automatico']);
  });

  it('deve devolver o modo manual quando a marcacao da Pull Request o exige', async () => {
    // Arrange
    process.env['ESTEIRA_MODO'] = 'automatico';
    process.env['ESTEIRA_MODO_ROTULO'] = 'urgente,manual';
    const saida: string[] = [];
    const original = console.log;
    console.log = (linha: string): void => void saida.push(linha);

    // Act
    await buildPipelineCliEntry().run(['mode']);
    console.log = original;

    // Assert
    expect(saida).toEqual(['manual']);
  });

  it('deve aprovar o portao e escrever o resumo quando todos os jobs passam', async () => {
    // Arrange
    process.env['ESTEIRA_RESULTADOS'] =
      '[{"name":"Formatação","status":"success"},{"name":"Cobertura 90%","status":"success"}]';

    // Act
    const codigo = await buildPipelineCliEntry().run(['gate']);

    // Assert
    expect(codigo).toBe(0);
    expect(await readFile(resumo, 'utf8')).toContain('Portão aprovado');
  });

  it('deve reprovar o portao nomeando a verificacao que falhou', async () => {
    // Arrange
    process.env['ESTEIRA_RESULTADOS'] =
      '[{"name":"Formatação","status":"success"},{"name":"Cobertura 90%","status":"failure","detail":"84%"}]';

    // Act
    const codigo = await buildPipelineCliEntry().run(['gate']);

    // Assert
    expect(codigo).toBe(1);
    expect(await readFile(resumo, 'utf8')).toContain('reprovaram: Cobertura 90%');
  });

  it('deve escrever o bloco do job no resumo quando o subcomando e summary', async () => {
    // Arrange
    process.env['ESTEIRA_JOB'] = 'Auditoria';
    process.env['ESTEIRA_STATUS'] = 'failure';
    process.env['ESTEIRA_DETALHE'] = 'remote: Permission denied';

    // Act
    const codigo = await buildPipelineCliEntry().run(['summary']);

    // Assert
    expect(codigo).toBe(0);
    expect(await readFile(resumo, 'utf8')).toContain('**Causa**: permissao');
  });

  it('deve devolver dois quando o subcomando e desconhecido', async () => {
    // Arrange
    const argv = ['publicar'];

    // Act
    const codigo = await buildPipelineCliEntry().run(argv);

    // Assert
    expect(codigo).toBe(2);
  });
});
