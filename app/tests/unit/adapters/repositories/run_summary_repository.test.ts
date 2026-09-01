import { afterEach, describe, expect, it, vi } from 'vitest';
import { appendFile } from 'node:fs/promises';
import { RunSummaryRepository } from '../../../../adapters/repositories/run_summary_repository.ts';
import type { IConfigTool } from '../../../../interfaces/infra/tools/i_config_tool.ts';

vi.mock('node:fs/promises', () => ({ appendFile: vi.fn().mockResolvedValue(undefined) }));

interface Dubles {
  readonly config: IConfigTool;
  readonly writeStdout: (text: string) => void;
  readonly appendToFile: (path: string, text: string) => Promise<void>;
}

function dubles(caminho: string | null = null): Dubles {
  return {
    config: {
      githubApiBaseUrl: vi.fn().mockReturnValue('http://wiremock:8080'),
      organizationLogin: vi.fn().mockReturnValue('byt3un1on'),
      githubToken: vi.fn().mockReturnValue(null),
      curationPath: vi.fn().mockReturnValue('data/curation.json'),
      catalogOutputPath: vi.fn().mockReturnValue('data/catalog.json'),
      prerenderRoutesPath: vi.fn().mockReturnValue('routes.txt'),
      siteRepositoryFullName: vi.fn().mockReturnValue('byt3un1on/byt3un1on.github.io'),
      pipelineMode: vi.fn().mockReturnValue(null),
      pipelineModeLabel: vi.fn().mockReturnValue(null),
      runSummaryPath: vi.fn().mockReturnValue(caminho),
      pipelineResults: vi.fn().mockReturnValue(null),
      summaryJob: vi.fn().mockReturnValue(null),
      summaryStatus: vi.fn().mockReturnValue(null),
      summaryDetail: vi.fn().mockReturnValue(null),
    },
    writeStdout: vi.fn().mockReturnValue(undefined),
    appendToFile: vi.fn().mockResolvedValue(undefined),
  };
}

function construir(d: Dubles): RunSummaryRepository {
  return new RunSummaryRepository(d.config, d.writeStdout, d.appendToFile);
}

const BLOCO = '## Construcao\n\nsucesso\n';

describe('RunSummaryRepository', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve escrever o bloco em stdout quando nao ha caminho de resumo', async () => {
    // Arrange
    const d = dubles(null);

    // Act
    await construir(d).append(BLOCO);

    // Assert
    expect(d.writeStdout).toHaveBeenCalledExactlyOnceWith(BLOCO);
  });

  it('deve nao acrescentar ao arquivo quando nao ha caminho de resumo', async () => {
    // Arrange
    const d = dubles(null);

    // Act
    await construir(d).append(BLOCO);

    // Assert
    expect(d.appendToFile).not.toHaveBeenCalled();
  });

  it('deve devolver nada da escrita em stdout quando nao ha caminho de resumo', async () => {
    // Arrange
    const d = dubles(null);

    // Act
    await construir(d).append(BLOCO);

    // Assert
    expect(vi.mocked(d.writeStdout)).toHaveReturnedWith(undefined);
  });

  it('deve acrescentar o bloco ao arquivo quando ha caminho de resumo', async () => {
    // Arrange
    const d = dubles('/tmp/resumo.md');

    // Act
    await construir(d).append(BLOCO);

    // Assert
    expect(d.appendToFile).toHaveBeenCalledExactlyOnceWith('/tmp/resumo.md', BLOCO);
  });

  it('deve nao escrever em stdout quando ha caminho de resumo', async () => {
    // Arrange
    const d = dubles('/tmp/resumo.md');

    // Act
    await construir(d).append(BLOCO);

    // Assert
    expect(d.writeStdout).not.toHaveBeenCalled();
  });

  it('deve resolver sem valor a escrita no arquivo quando ha caminho de resumo', async () => {
    // Arrange
    const d = dubles('/tmp/resumo.md');

    // Act
    await construir(d).append(BLOCO);

    // Assert
    expect(vi.mocked(d.appendToFile)).toHaveResolvedWith(undefined);
  });

  it('deve receber da configuracao o caminho que ela declara quando acrescenta o bloco', async () => {
    // Arrange
    const d = dubles('/tmp/resumo.md');

    // Act
    await construir(d).append(BLOCO);

    // Assert
    expect(vi.mocked(d.config.runSummaryPath)).toHaveReturnedWith('/tmp/resumo.md');
  });

  it('deve consultar o caminho uma unica vez e sem parametro quando acrescenta o bloco', async () => {
    // Arrange
    const d = dubles('/tmp/resumo.md');

    // Act
    await construir(d).append(BLOCO);

    // Assert
    expect(d.config.runSummaryPath).toHaveBeenCalledExactlyOnceWith();
  });

  it('deve nao escrever em stdout quando o bloco e vazio', async () => {
    // Arrange
    const d = dubles(null);

    // Act
    await construir(d).append('');

    // Assert
    expect(d.writeStdout).not.toHaveBeenCalled();
  });

  it('deve nao acrescentar ao arquivo quando o bloco e vazio', async () => {
    // Arrange
    const d = dubles('/tmp/resumo.md');

    // Act
    await construir(d).append('');

    // Assert
    expect(d.appendToFile).not.toHaveBeenCalled();
  });

  it('deve nao escrever em stdout quando o bloco tem apenas espacos', async () => {
    // Arrange
    const d = dubles(null);

    // Act
    await construir(d).append('  \n\t ');

    // Assert
    expect(d.writeStdout).not.toHaveBeenCalled();
  });

  it('deve nao acrescentar ao arquivo quando o bloco tem apenas espacos', async () => {
    // Arrange
    const d = dubles('/tmp/resumo.md');

    // Act
    await construir(d).append('  \n\t ');

    // Assert
    expect(d.appendToFile).not.toHaveBeenCalled();
  });

  it('deve escrever na saida padrao do processo quando a escrita nao e injetada', async () => {
    // Arrange
    const d = dubles(null);
    const write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);

    // Act
    await new RunSummaryRepository(d.config).append(BLOCO);

    // Assert
    expect(write).toHaveBeenCalledExactlyOnceWith(BLOCO);
  });

  it('deve acrescentar ao arquivo em utf8 quando a escrita em arquivo nao e injetada', async () => {
    // Arrange
    const d = dubles('/tmp/resumo.md');

    // Act
    await new RunSummaryRepository(d.config, d.writeStdout).append(BLOCO);

    // Assert
    expect(appendFile).toHaveBeenCalledExactlyOnceWith('/tmp/resumo.md', BLOCO, 'utf8');
  });
});
