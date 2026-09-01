import { describe, expect, it, vi } from 'vitest';
import { ReportPublicationCommand } from '../../../../adapters/commands/report_publication_command.ts';
import type { IReportPublicationStatusUseCase } from '../../../../interfaces/core/application/catalog/i_report_publication_status_use_case.ts';
import type { ILoggerTool } from '../../../../interfaces/infra/tools/i_logger_tool.ts';

function logger(): ILoggerTool {
  return { info: vi.fn(), error: vi.fn() };
}

describe('ReportPublicationCommand', () => {
  it('deve devolver zero quando o desfecho e registrado', async () => {
    // Arrange
    const useCase: IReportPublicationStatusUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };

    // Act
    const codigo = await new ReportPublicationCommand(useCase, logger()).execute(
      'failure',
      'motivo',
    );

    // Assert
    expect(codigo).toBe(0);
  });

  it('deve repassar desfecho e motivo ao caso de uso quando executa', async () => {
    // Arrange
    const useCase: IReportPublicationStatusUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };

    // Act
    await new ReportPublicationCommand(useCase, logger()).execute(
      'failure',
      'catalogo indisponivel',
    );

    // Assert
    expect(useCase.execute).toHaveBeenCalledExactlyOnceWith('failure', 'catalogo indisponivel');
  });

  it('deve registrar o desfecho quando ele e gravado', async () => {
    // Arrange
    const useCase: IReportPublicationStatusUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };
    const log = logger();

    // Act
    await new ReportPublicationCommand(useCase, log).execute('success', '');

    // Assert
    expect(log.info).toHaveBeenCalledExactlyOnceWith('desfecho registrado', { outcome: 'success' });
  });

  it('deve devolver codigo diferente de zero quando o registro falha', async () => {
    // Arrange
    const useCase: IReportPublicationStatusUseCase = {
      execute: vi.fn().mockRejectedValue(new Error('403 sem permissao')),
    };

    // Act
    const codigo = await new ReportPublicationCommand(useCase, logger()).execute(
      'failure',
      'motivo',
    );

    // Assert
    expect(codigo).toBe(1);
  });

  it('deve registrar o motivo da falha quando o registro nao conclui', async () => {
    // Arrange
    const useCase: IReportPublicationStatusUseCase = {
      execute: vi.fn().mockRejectedValue(new Error('403 sem permissao')),
    };
    const log = logger();

    // Act
    await new ReportPublicationCommand(useCase, log).execute('failure', 'motivo');

    // Assert
    expect(log.error).toHaveBeenCalledExactlyOnceWith('nao foi possivel registrar o desfecho', {
      outcome: 'failure',
      reason: '403 sem permissao',
    });
  });

  it('deve registrar falha nao textual quando o erro nao e um Error', async () => {
    // Arrange
    const useCase: IReportPublicationStatusUseCase = { execute: vi.fn().mockRejectedValue('pane') };
    const log = logger();

    // Act
    await new ReportPublicationCommand(useCase, log).execute('success', '');

    // Assert
    expect(log.error).toHaveBeenCalledExactlyOnceWith('nao foi possivel registrar o desfecho', {
      outcome: 'success',
      reason: 'pane',
    });
  });
});
