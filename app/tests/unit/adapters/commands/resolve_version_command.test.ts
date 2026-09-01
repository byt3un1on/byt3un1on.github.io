import { describe, expect, it, vi } from 'vitest';
import { ResolveVersionCommand } from '../../../../adapters/commands/resolve_version_command.ts';
import type { SemanticVersion } from '../../../../core/domain/models/semantic_version_model.ts';
import type { IResolveNextVersionUseCase } from '../../../../interfaces/core/application/pipeline/i_resolve_next_version_use_case.ts';
import type { ILoggerTool } from '../../../../interfaces/infra/tools/i_logger_tool.ts';

const PROXIMA_VERSAO: SemanticVersion = { major: 1, minor: 3, patch: 0 };

function logger(): ILoggerTool {
  return { info: vi.fn(), error: vi.fn() };
}

function useCaseResolvendo(version: SemanticVersion): IResolveNextVersionUseCase {
  return { execute: vi.fn<() => Promise<SemanticVersion>>().mockResolvedValue(version) };
}

function useCaseFalhando(error: unknown): IResolveNextVersionUseCase {
  return { execute: vi.fn<() => Promise<SemanticVersion>>().mockRejectedValue(error) };
}

describe('ResolveVersionCommand', () => {
  it('deve consultar o caso de uso uma unica vez sem argumento quando executa', async () => {
    // Arrange
    const useCase = useCaseResolvendo(PROXIMA_VERSAO);

    // Act
    await new ResolveVersionCommand(useCase, logger(), vi.fn<(line: string) => void>()).execute();

    // Assert
    expect(vi.mocked(useCase.execute)).toHaveBeenCalledExactlyOnceWith();
  });

  it('deve devolver a versao resolvida quando o caso de uso conclui', async () => {
    // Arrange
    const useCase = useCaseResolvendo(PROXIMA_VERSAO);

    // Act
    await new ResolveVersionCommand(useCase, logger(), vi.fn<(line: string) => void>()).execute();

    // Assert
    await expect(vi.mocked(useCase.execute).mock.results[0]?.value).resolves.toBe(PROXIMA_VERSAO);
  });

  it('deve escrever a versao com o prefixo v quando o caso de uso resolve', async () => {
    // Arrange
    const write = vi.fn<(line: string) => void>();

    // Act
    await new ResolveVersionCommand(useCaseResolvendo(PROXIMA_VERSAO), logger(), write).execute();

    // Assert
    expect(write).toHaveBeenCalledExactlyOnceWith('v1.3.0');
  });

  it('deve devolver zero quando a versao e escrita', async () => {
    // Arrange
    const command = new ResolveVersionCommand(
      useCaseResolvendo(PROXIMA_VERSAO),
      logger(),
      vi.fn<(line: string) => void>(),
    );

    // Act
    const codigo = await command.execute();

    // Assert
    expect(codigo).toBe(0);
  });

  it('deve nao registrar erro quando a versao e escrita', async () => {
    // Arrange
    const log = logger();

    // Act
    await new ResolveVersionCommand(
      useCaseResolvendo(PROXIMA_VERSAO),
      log,
      vi.fn<(line: string) => void>(),
    ).execute();

    // Assert
    expect(vi.mocked(log.error)).not.toHaveBeenCalled();
  });

  it('deve devolver codigo diferente de zero quando o caso de uso falha', async () => {
    // Arrange
    const command = new ResolveVersionCommand(
      useCaseFalhando(new Error('git describe falhou')),
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
    await new ResolveVersionCommand(
      useCaseFalhando(new Error('git describe falhou')),
      log,
      vi.fn<(line: string) => void>(),
    ).execute();

    // Assert
    expect(vi.mocked(log.error)).toHaveBeenCalledExactlyOnceWith(
      'nao foi possivel decidir a versao',
      { reason: 'git describe falhou' },
    );
  });

  it('deve nao escrever nada na saida quando o caso de uso falha', async () => {
    // Arrange
    const write = vi.fn<(line: string) => void>();

    // Act
    await new ResolveVersionCommand(
      useCaseFalhando(new Error('git describe falhou')),
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
    await new ResolveVersionCommand(
      useCaseFalhando('quebrou'),
      log,
      vi.fn<(line: string) => void>(),
    ).execute();

    // Assert
    expect(vi.mocked(log.error)).toHaveBeenCalledExactlyOnceWith(
      'nao foi possivel decidir a versao',
      { reason: 'quebrou' },
    );
  });
});
