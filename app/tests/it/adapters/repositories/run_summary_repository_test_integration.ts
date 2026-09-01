import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RunSummaryRepository } from '../../../../adapters/repositories/run_summary_repository.ts';
import { ConfigTool } from '../../../../infra/tools/config_tool.ts';

let diretorio = '';
let arquivo = '';

function repository(): RunSummaryRepository {
  return new RunSummaryRepository(new ConfigTool({ ESTEIRA_RESUMO: arquivo }));
}

describe('RunSummaryRepository contra o sistema de arquivos real', () => {
  beforeEach(async () => {
    diretorio = await mkdtemp(join(tmpdir(), 'esteira-resumo-'));
    arquivo = join(diretorio, 'resumo.md');
  });

  afterEach(async () => {
    await rm(diretorio, { recursive: true, force: true });
  });

  it('deve criar o arquivo quando ele ainda nao existe', async () => {
    // Arrange
    const bloco = '### ✅ Formatação\n';

    // Act
    await repository().append(bloco);

    // Assert
    expect(await readFile(arquivo, 'utf8')).toBe(bloco);
  });

  it('deve acrescentar ao final quando o arquivo ja tem conteudo', async () => {
    // Arrange
    const repositorio = repository();
    await repositorio.append('### ✅ Formatação\n');

    // Act
    await repositorio.append('### ❌ Cobertura 90%\n');

    // Assert
    expect(await readFile(arquivo, 'utf8')).toBe('### ✅ Formatação\n### ❌ Cobertura 90%\n');
  });

  it('deve preservar os acentos quando o bloco os carrega', async () => {
    // Arrange
    const bloco = '### ⏹️ Análise estática — execução cancelada\n';

    // Act
    await repository().append(bloco);

    // Assert
    expect(await readFile(arquivo, 'utf8')).toBe(bloco);
  });

  it('deve nao criar o arquivo quando o bloco esta em branco', async () => {
    // Arrange
    const bloco = '   \n';

    // Act
    await repository().append(bloco);

    // Assert
    await expect(readFile(arquivo, 'utf8')).rejects.toThrow();
  });
});
