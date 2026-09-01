import { describe, expect, it, vi } from 'vitest';
import { ResolveModeCommand } from '../../../../adapters/commands/resolve_mode_command.ts';
import type { PipelineMode } from '../../../../core/domain/enums/pipeline_mode_enum.ts';
import type { IResolvePipelineModeUseCase } from '../../../../interfaces/core/application/pipeline/i_resolve_pipeline_mode_use_case.ts';
import type { ILoggerTool } from '../../../../interfaces/infra/tools/i_logger_tool.ts';

function logger(): ILoggerTool {
  return { info: vi.fn(), error: vi.fn() };
}

function useCaseResolvendo(mode: PipelineMode): IResolvePipelineModeUseCase {
  return { execute: vi.fn<() => PipelineMode>().mockReturnValue(mode) };
}

function useCaseFalhando(error: unknown): IResolvePipelineModeUseCase {
  return {
    execute: vi.fn<() => PipelineMode>().mockImplementation(() => {
      throw error;
    }),
  };
}

describe('ResolveModeCommand', () => {
  it('deve consultar o caso de uso uma unica vez sem argumento quando executa', async () => {
    // Arrange
    const useCase = useCaseResolvendo('manual');

    // Act
    await new ResolveModeCommand(useCase, logger(), vi.fn<(line: string) => void>()).execute();

    // Assert
    expect(vi.mocked(useCase.execute)).toHaveBeenCalledExactlyOnceWith();
  });

  it('deve devolver o modo resolvido quando o caso de uso conclui', async () => {
    // Arrange
    const useCase = useCaseResolvendo('manual');

    // Act
    await new ResolveModeCommand(useCase, logger(), vi.fn<(line: string) => void>()).execute();

    // Assert
    expect(vi.mocked(useCase.execute).mock.results[0]?.value).toBe('manual');
  });

  it('deve escrever o modo sem enfeite quando o caso de uso resolve', async () => {
    // Arrange
    const write = vi.fn<(line: string) => void>();

    // Act
    await new ResolveModeCommand(useCaseResolvendo('automatico'), logger(), write).execute();

    // Assert
    expect(write).toHaveBeenCalledExactlyOnceWith('automatico');
  });

  it('deve devolver zero quando o modo e escrito', async () => {
    // Arrange
    const command = new ResolveModeCommand(
      useCaseResolvendo('manual'),
      logger(),
      vi.fn<(line: string) => void>(),
    );

    // Act
    const codigo = await command.execute();

    // Assert
    expect(codigo).toBe(0);
  });

  it('deve nao registrar erro quando o modo e escrito', async () => {
    // Arrange
    const log = logger();

    // Act
    await new ResolveModeCommand(
      useCaseResolvendo('manual'),
      log,
      vi.fn<(line: string) => void>(),
    ).execute();

    // Assert
    expect(vi.mocked(log.error)).not.toHaveBeenCalled();
  });

  it('deve devolver codigo diferente de zero quando o caso de uso falha', async () => {
    // Arrange
    const command = new ResolveModeCommand(
      useCaseFalhando(new Error('rotulo desconhecido')),
      logger(),
      vi.fn<(line: string) => void>(),
    );

    // Act
    const codigo = await command.execute();

    // Assert
    expect(codigo).toBe(1);
  });

  it('deve registrar o motivo da falha quando o caso de uso lanca', async () => {
    // Arrange
    const log = logger();

    // Act
    await new ResolveModeCommand(
      useCaseFalhando(new Error('rotulo desconhecido')),
      log,
      vi.fn<(line: string) => void>(),
    ).execute();

    // Assert
    expect(vi.mocked(log.error)).toHaveBeenCalledExactlyOnceWith(
      'nao foi possivel decidir o modo',
      {
        reason: 'rotulo desconhecido',
      },
    );
  });

  it('deve nao escrever nada na saida quando o caso de uso falha', async () => {
    // Arrange
    const write = vi.fn<(line: string) => void>();

    // Act
    await new ResolveModeCommand(
      useCaseFalhando(new Error('rotulo desconhecido')),
      logger(),
      write,
    ).execute();

    // Assert
    expect(write).not.toHaveBeenCalled();
  });

  it('deve converter o erro em texto quando o erro nao e um Error', async () => {
    // Arrange
    const log = logger();

    // Act
    await new ResolveModeCommand(
      useCaseFalhando('quebrou'),
      log,
      vi.fn<(line: string) => void>(),
    ).execute();

    // Assert
    expect(vi.mocked(log.error)).toHaveBeenCalledExactlyOnceWith(
      'nao foi possivel decidir o modo',
      {
        reason: 'quebrou',
      },
    );
  });
});
