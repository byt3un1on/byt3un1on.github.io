import { describe, expect, it, vi } from 'vitest';
import { WriteSummaryCommand } from '../../../../adapters/commands/write_summary_command.ts';
import type { IRunSummaryRepository } from '../../../../interfaces/adapters/repositories/i_run_summary_repository.ts';
import type { IRenderRunSummaryUseCase } from '../../../../interfaces/core/application/pipeline/i_render_run_summary_use_case.ts';
import type { IConfigTool } from '../../../../interfaces/infra/tools/i_config_tool.ts';
import type { ILoggerTool } from '../../../../interfaces/infra/tools/i_logger_tool.ts';

const USO = 'ESTEIRA_JOB e ESTEIRA_STATUS sao obrigatorios; ESTEIRA_DETALHE e opcional';
const BLOCO = '## Testes\n\nfalha — cobertura 82%\n';

interface Dubles {
  readonly config: IConfigTool;
  readonly renderSummary: IRenderRunSummaryUseCase;
  readonly summary: IRunSummaryRepository;
  readonly logger: ILoggerTool;
}

function dubles(): Dubles {
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
      runSummaryPath: vi.fn().mockReturnValue(null),
      pipelineResults: vi.fn().mockReturnValue(null),
      summaryJob: vi.fn().mockReturnValue(null),
      summaryStatus: vi.fn().mockReturnValue(null),
      summaryDetail: vi.fn().mockReturnValue(null),
    },
    renderSummary: {
      renderJob: vi.fn().mockReturnValue(BLOCO),
      renderVerdict: vi.fn().mockReturnValue(''),
    },
    summary: { append: vi.fn().mockResolvedValue(undefined) },
    logger: { info: vi.fn(), error: vi.fn() },
  };
}

function comJob(
  d: Dubles,
  job: string | null,
  status: string | null,
  detalhe: string | null,
): Dubles {
  vi.mocked(d.config.summaryJob).mockReturnValue(job);
  vi.mocked(d.config.summaryStatus).mockReturnValue(status);
  vi.mocked(d.config.summaryDetail).mockReturnValue(detalhe);
  return d;
}

function construir(d: Dubles): WriteSummaryCommand {
  return new WriteSummaryCommand(d.config, d.renderSummary, d.summary, d.logger);
}

describe('WriteSummaryCommand', () => {
  it('deve devolver dois quando o nome do job nao chega', async () => {
    // Arrange
    const d = comJob(dubles(), null, 'failure', 'cobertura 82%');

    // Act
    const codigo = await construir(d).execute();

    // Assert
    expect(codigo).toBe(2);
  });

  it('deve devolver dois quando a situacao do job nao chega', async () => {
    // Arrange
    const d = comJob(dubles(), 'Testes', null, 'cobertura 82%');

    // Act
    const codigo = await construir(d).execute();

    // Assert
    expect(codigo).toBe(2);
  });

  it('deve registrar resumo incompleto quando a situacao do job nao chega', async () => {
    // Arrange
    const d = comJob(dubles(), 'Testes', null, null);

    // Act
    await construir(d).execute();

    // Assert
    expect(d.logger.error).toHaveBeenCalledExactlyOnceWith('resumo incompleto', {
      job: 'Testes',
      status: null,
      expected: USO,
    });
  });

  it('deve nao renderizar o bloco quando o resumo esta incompleto', async () => {
    // Arrange
    const d = comJob(dubles(), null, null, null);

    // Act
    await construir(d).execute();

    // Assert
    expect(d.renderSummary.renderJob).not.toHaveBeenCalled();
  });

  it('deve nao escrever o resumo quando o resumo esta incompleto', async () => {
    // Arrange
    const d = comJob(dubles(), null, null, null);

    // Act
    await construir(d).execute();

    // Assert
    expect(d.summary.append).not.toHaveBeenCalled();
  });

  it('deve renderizar uma unica vez o resultado do job quando nome, situacao e detalhe chegam', async () => {
    // Arrange
    const d = comJob(dubles(), 'Testes', 'failure', 'cobertura 82%');

    // Act
    await construir(d).execute();

    // Assert
    expect(d.renderSummary.renderJob).toHaveBeenCalledExactlyOnceWith({
      name: 'Testes',
      status: 'falha',
      detail: 'cobertura 82%',
    });
  });

  it('deve acrescentar ao resumo o texto devolvido pelo renderizador quando o job e descrito', async () => {
    // Arrange
    const d = comJob(dubles(), 'Testes', 'failure', 'cobertura 82%');

    // Act
    await construir(d).execute();

    // Assert
    expect(d.summary.append).toHaveBeenCalledExactlyOnceWith(BLOCO);
  });

  it('deve devolver zero quando o bloco do job e escrito', async () => {
    // Arrange
    const d = comJob(dubles(), 'Testes', 'failure', 'cobertura 82%');

    // Act
    const codigo = await construir(d).execute();

    // Assert
    expect(codigo).toBe(0);
  });

  it('deve renderizar com detalhe vazio quando o detalhe nao chega', async () => {
    // Arrange
    const d = comJob(dubles(), 'Construcao', 'success', null);

    // Act
    await construir(d).execute();

    // Assert
    expect(d.renderSummary.renderJob).toHaveBeenCalledExactlyOnceWith({
      name: 'Construcao',
      status: 'sucesso',
      detail: '',
    });
  });

  it('deve devolver um quando o nome do job vem em branco', async () => {
    // Arrange
    const d = comJob(dubles(), '   ', 'success', null);

    // Act
    const codigo = await construir(d).execute();

    // Assert
    expect(codigo).toBe(1);
  });

  it('deve registrar nome invalido quando o nome do job vem em branco', async () => {
    // Arrange
    const d = comJob(dubles(), '   ', 'success', null);

    // Act
    await construir(d).execute();

    // Assert
    expect(d.logger.error).toHaveBeenCalledExactlyOnceWith('nao foi possivel escrever o resumo', {
      reason: 'name invalido: recebido "   ", esperado texto nao vazio',
    });
  });

  it('deve nao escrever o resumo quando o nome do job vem em branco', async () => {
    // Arrange
    const d = comJob(dubles(), '   ', 'success', null);

    // Act
    await construir(d).execute();

    // Assert
    expect(d.summary.append).not.toHaveBeenCalled();
  });

  it('deve devolver um quando a escrita do resumo falha', async () => {
    // Arrange
    const d = comJob(dubles(), 'Testes', 'failure', 'cobertura 82%');
    vi.mocked(d.summary.append).mockRejectedValue(new Error('EACCES resumo somente leitura'));

    // Act
    const codigo = await construir(d).execute();

    // Assert
    expect(codigo).toBe(1);
  });

  it('deve registrar o motivo quando a escrita do resumo falha', async () => {
    // Arrange
    const d = comJob(dubles(), 'Testes', 'failure', 'cobertura 82%');
    vi.mocked(d.summary.append).mockRejectedValue(new Error('EACCES resumo somente leitura'));

    // Act
    await construir(d).execute();

    // Assert
    expect(d.logger.error).toHaveBeenCalledExactlyOnceWith('nao foi possivel escrever o resumo', {
      reason: 'EACCES resumo somente leitura',
    });
  });

  it('deve registrar a falha nao textual quando a escrita lanca algo que nao e um Error', async () => {
    // Arrange
    const d = comJob(dubles(), 'Testes', 'success', null);
    vi.mocked(d.summary.append).mockRejectedValue('pane');

    // Act
    await construir(d).execute();

    // Assert
    expect(d.logger.error).toHaveBeenCalledExactlyOnceWith('nao foi possivel escrever o resumo', {
      reason: 'pane',
    });
  });
});
