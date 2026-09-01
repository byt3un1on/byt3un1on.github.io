import { describe, expect, it, vi } from 'vitest';
import { PipelineCliEntry } from '../../../../infra/cli/pipeline_cli_entry.ts';
import type { IEvaluateGateCommand } from '../../../../interfaces/adapters/commands/i_evaluate_gate_command.ts';
import type { IResolveModeCommand } from '../../../../interfaces/adapters/commands/i_resolve_mode_command.ts';
import type { IResolveVersionCommand } from '../../../../interfaces/adapters/commands/i_resolve_version_command.ts';
import type { IWriteSummaryCommand } from '../../../../interfaces/adapters/commands/i_write_summary_command.ts';
import type { ILoggerTool } from '../../../../interfaces/infra/tools/i_logger_tool.ts';

const USO = 'uso: pipeline version | mode | gate | summary';

interface Dubles {
  readonly resolveVersion: IResolveVersionCommand;
  readonly resolveMode: IResolveModeCommand;
  readonly evaluateGate: IEvaluateGateCommand;
  readonly writeSummary: IWriteSummaryCommand;
  readonly logger: ILoggerTool;
}

function dubles(): Dubles {
  return {
    resolveVersion: { execute: vi.fn().mockResolvedValue(0) },
    resolveMode: { execute: vi.fn().mockResolvedValue(0) },
    evaluateGate: { execute: vi.fn().mockResolvedValue(0) },
    writeSummary: { execute: vi.fn().mockResolvedValue(0) },
    logger: { info: vi.fn(), error: vi.fn() },
  };
}

function construir(d: Dubles): PipelineCliEntry {
  return new PipelineCliEntry(
    d.resolveVersion,
    d.resolveMode,
    d.evaluateGate,
    d.writeSummary,
    d.logger,
  );
}

describe('PipelineCliEntry', () => {
  it('deve acionar a resolucao da versao quando o subcomando e version', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run(['version']);

    // Assert
    expect(d.resolveVersion.execute).toHaveBeenCalledExactlyOnceWith();
  });

  it('deve acionar a resolucao do modo quando o subcomando e mode', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run(['mode']);

    // Assert
    expect(d.resolveMode.execute).toHaveBeenCalledExactlyOnceWith();
  });

  it('deve acionar a avaliacao do portao quando o subcomando e gate', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run(['gate']);

    // Assert
    expect(d.evaluateGate.execute).toHaveBeenCalledExactlyOnceWith();
  });

  it('deve acionar a escrita do resumo quando o subcomando e summary', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run(['summary']);

    // Assert
    expect(d.writeSummary.execute).toHaveBeenCalledExactlyOnceWith();
  });

  it('deve devolver o codigo do comando quando ele aborta', async () => {
    // Arrange
    const d = dubles();
    vi.mocked(d.evaluateGate.execute).mockResolvedValue(1);

    // Act
    const codigo = await construir(d).run(['gate']);

    // Assert
    expect(codigo).toBe(1);
  });

  it('deve devolver dois quando o subcomando e desconhecido', async () => {
    // Arrange
    const d = dubles();

    // Act
    const codigo = await construir(d).run(['publicar']);

    // Assert
    expect(codigo).toBe(2);
  });

  it('deve registrar o uso esperado quando o subcomando e desconhecido', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run(['publicar']);

    // Assert
    expect(d.logger.error).toHaveBeenCalledExactlyOnceWith('subcomando desconhecido', {
      received: 'publicar',
      expected: USO,
    });
  });

  it('deve registrar nulo como recebido quando nenhum subcomando e informado', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run([]);

    // Assert
    expect(d.logger.error).toHaveBeenCalledExactlyOnceWith('subcomando desconhecido', {
      received: null,
      expected: USO,
    });
  });

  it('deve nao acionar comando algum quando o subcomando e desconhecido', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run(['publicar']);

    // Assert
    expect(d.resolveVersion.execute).not.toHaveBeenCalled();
  });
});
