import { describe, expect, it, vi } from 'vitest';
import { EvaluateGateCommand } from '../../../../adapters/commands/evaluate_gate_command.ts';
import type { IRunSummaryRepository } from '../../../../interfaces/adapters/repositories/i_run_summary_repository.ts';
import type {
  IEvaluateQualityGateUseCase,
  QualityGateVerdict,
} from '../../../../interfaces/core/application/pipeline/i_evaluate_quality_gate_use_case.ts';
import type { IRenderRunSummaryUseCase } from '../../../../interfaces/core/application/pipeline/i_render_run_summary_use_case.ts';
import type { IConfigTool } from '../../../../interfaces/infra/tools/i_config_tool.ts';
import type { ILoggerTool } from '../../../../interfaces/infra/tools/i_logger_tool.ts';

const USO = 'ESTEIRA_RESULTADOS: [{"name":"Portao","status":"success"}]';
const BLOCO = '## Portao de qualidade\n\naprovado\n';

const APROVADO: QualityGateVerdict = { approved: true, failed: [], reason: 'tudo verde' };
const REPROVADO: QualityGateVerdict = {
  approved: false,
  failed: [{ name: 'Testes', status: 'falha', detail: 'cobertura 82%' }],
  reason: 'Testes falhou',
};

interface Dubles {
  readonly config: IConfigTool;
  readonly evaluateGate: IEvaluateQualityGateUseCase;
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
    evaluateGate: { execute: vi.fn().mockReturnValue(APROVADO) },
    renderSummary: {
      renderJob: vi.fn().mockReturnValue(''),
      renderVerdict: vi.fn().mockReturnValue(BLOCO),
    },
    summary: { append: vi.fn().mockResolvedValue(undefined) },
    logger: { info: vi.fn(), error: vi.fn() },
  };
}

function comResultados(d: Dubles, resultados: string): Dubles {
  vi.mocked(d.config.pipelineResults).mockReturnValue(resultados);
  return d;
}

function construir(d: Dubles): EvaluateGateCommand {
  return new EvaluateGateCommand(d.config, d.evaluateGate, d.renderSummary, d.summary, d.logger);
}

describe('EvaluateGateCommand', () => {
  it('deve devolver dois quando os resultados nao chegam', async () => {
    // Arrange
    const d = dubles();

    // Act
    const codigo = await construir(d).execute();

    // Assert
    expect(codigo).toBe(2);
  });

  it('deve registrar resultados ausentes quando os resultados nao chegam', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).execute();

    // Assert
    expect(d.logger.error).toHaveBeenCalledExactlyOnceWith('resultados ausentes', {
      received: null,
      expected: USO,
    });
  });

  it('deve nao avaliar o portao quando os resultados nao chegam', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).execute();

    // Assert
    expect(d.evaluateGate.execute).not.toHaveBeenCalled();
  });

  it('deve nao escrever o resumo quando os resultados nao chegam', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).execute();

    // Assert
    expect(d.summary.append).not.toHaveBeenCalled();
  });

  it('deve avaliar o portao uma unica vez com os resultados traduzidos quando o JSON e um array', async () => {
    // Arrange
    const d = comResultados(
      dubles(),
      '[{"name":"Construcao","status":"success"},{"name":"Testes","status":"success","detail":"90%"}]',
    );

    // Act
    await construir(d).execute();

    // Assert
    expect(d.evaluateGate.execute).toHaveBeenCalledExactlyOnceWith([
      { name: 'Construcao', status: 'sucesso', detail: '' },
      { name: 'Testes', status: 'sucesso', detail: '90%' },
    ]);
  });

  it('deve renderizar uma unica vez o veredito devolvido pelo portao quando ele decide', async () => {
    // Arrange
    const d = comResultados(dubles(), '[{"name":"Construcao","status":"success"}]');

    // Act
    await construir(d).execute();

    // Assert
    expect(d.renderSummary.renderVerdict).toHaveBeenCalledExactlyOnceWith(APROVADO);
  });

  it('deve acrescentar ao resumo o texto devolvido pelo renderizador quando o portao aprova', async () => {
    // Arrange
    const d = comResultados(dubles(), '[{"name":"Construcao","status":"success"}]');

    // Act
    await construir(d).execute();

    // Assert
    expect(d.summary.append).toHaveBeenCalledExactlyOnceWith(BLOCO);
  });

  it('deve devolver zero quando o portao aprova', async () => {
    // Arrange
    const d = comResultados(dubles(), '[{"name":"Construcao","status":"success"}]');

    // Act
    const codigo = await construir(d).execute();

    // Assert
    expect(codigo).toBe(0);
  });

  it('deve devolver um quando o portao reprova', async () => {
    // Arrange
    const d = comResultados(dubles(), '[{"name":"Testes","status":"failure"}]');
    vi.mocked(d.evaluateGate.execute).mockReturnValue(REPROVADO);

    // Act
    const codigo = await construir(d).execute();

    // Assert
    expect(codigo).toBe(1);
  });

  it('deve acrescentar ao resumo o motivo da reprovacao quando o portao reprova', async () => {
    // Arrange
    const d = comResultados(dubles(), '[{"name":"Testes","status":"failure"}]');
    vi.mocked(d.evaluateGate.execute).mockReturnValue(REPROVADO);
    vi.mocked(d.renderSummary.renderVerdict).mockReturnValue('## Portao\n\nTestes falhou\n');

    // Act
    await construir(d).execute();

    // Assert
    expect(d.summary.append).toHaveBeenCalledExactlyOnceWith('## Portao\n\nTestes falhou\n');
  });

  it('deve traduzir o vocabulario do executor quando os jobs falham, sao cancelados ou pulados', async () => {
    // Arrange
    const d = comResultados(
      dubles(),
      '[{"name":"Testes","status":"failure"},{"name":"Auditoria","status":"cancelled"},{"name":"Publicacao","status":"skipped"}]',
    );

    // Act
    await construir(d).execute();

    // Assert
    expect(d.evaluateGate.execute).toHaveBeenCalledExactlyOnceWith([
      { name: 'Testes', status: 'falha', detail: '' },
      { name: 'Auditoria', status: 'cancelado', detail: '' },
      { name: 'Publicacao', status: 'cancelado', detail: '' },
    ]);
  });

  it('deve devolver dois quando o JSON nao e um array', async () => {
    // Arrange
    const d = comResultados(dubles(), '{"a":1}');

    // Act
    const codigo = await construir(d).execute();

    // Assert
    expect(codigo).toBe(2);
  });

  it('deve registrar falha na avaliacao quando o JSON nao e um array', async () => {
    // Arrange
    const d = comResultados(dubles(), '{"a":1}');

    // Act
    await construir(d).execute();

    // Assert
    expect(d.logger.error).toHaveBeenCalledExactlyOnceWith('nao foi possivel avaliar o portao', {
      reason: `resultados invalidos: recebido {"a":1}, esperado ${USO}`,
    });
  });

  it('deve devolver dois quando o JSON e malformado', async () => {
    // Arrange
    const d = comResultados(dubles(), 'nao-e-json');

    // Act
    const codigo = await construir(d).execute();

    // Assert
    expect(codigo).toBe(2);
  });

  it('deve nao avaliar o portao quando o JSON e malformado', async () => {
    // Arrange
    const d = comResultados(dubles(), 'nao-e-json');

    // Act
    await construir(d).execute();

    // Assert
    expect(d.evaluateGate.execute).not.toHaveBeenCalled();
  });

  it('deve devolver dois quando o nome do job nao e texto', async () => {
    // Arrange
    const d = comResultados(dubles(), '[{"name":{},"status":"success"}]');

    // Act
    const codigo = await construir(d).execute();

    // Assert
    expect(codigo).toBe(2);
  });

  it('deve registrar nome vazio quando o nome do job nao e texto', async () => {
    // Arrange
    const d = comResultados(dubles(), '[{"name":{},"status":"success"}]');

    // Act
    await construir(d).execute();

    // Assert
    expect(d.logger.error).toHaveBeenCalledExactlyOnceWith('nao foi possivel avaliar o portao', {
      reason: 'name invalido: recebido "", esperado texto nao vazio',
    });
  });

  it('deve registrar a falha nao textual quando a escrita do resumo rejeita sem um Error', async () => {
    // Arrange
    const d = comResultados(dubles(), '[{"name":"Construcao","status":"success"}]');
    vi.mocked(d.summary.append).mockRejectedValue('pane');

    // Act
    await construir(d).execute();

    // Assert
    expect(d.logger.error).toHaveBeenCalledExactlyOnceWith('nao foi possivel avaliar o portao', {
      reason: 'pane',
    });
  });
});
