import { describe, expect, it, vi } from 'vitest';
import { ReportPublicationStatusUseCase } from '../../../../../core/application/catalog/report_publication_status_use_case.ts';
import type {
  IGithubIssueClient,
  OpenIssue,
} from '../../../../../interfaces/adapters/clients/i_github_issue_client.ts';
import type { ILoggerTool } from '../../../../../interfaces/infra/tools/i_logger_tool.ts';

const TITULO = 'Publicacao da vitrine abortada';
const ABERTA: OpenIssue = { number: 7, title: TITULO };

function dubles(existente: OpenIssue | null): {
  issueClient: IGithubIssueClient;
  logger: ILoggerTool;
} {
  return {
    issueClient: {
      findOpenIssueByTitle: vi.fn().mockResolvedValue(existente),
      openIssue: vi.fn().mockResolvedValue(ABERTA),
      closeIssue: vi.fn().mockResolvedValue(undefined),
    },
    logger: { info: vi.fn(), error: vi.fn() },
  };
}

describe('ReportPublicationStatusUseCase', () => {
  it('deve abrir a questao quando a publicacao aborta e nao ha questao aberta', async () => {
    // Arrange
    const d = dubles(null);
    const useCase = new ReportPublicationStatusUseCase(d.issueClient, d.logger);

    // Act
    await useCase.execute('failure', 'catalogo indisponivel');

    // Assert
    expect(d.issueClient.openIssue).toHaveBeenCalledExactlyOnceWith(
      TITULO,
      'A publicacao foi abortada.\n\nMotivo: catalogo indisponivel',
    );
  });

  it('deve procurar a questao antes de abrir quando a publicacao aborta', async () => {
    // Arrange
    const d = dubles(null);
    const useCase = new ReportPublicationStatusUseCase(d.issueClient, d.logger);

    // Act
    await useCase.execute('failure', 'motivo');

    // Assert
    expect(d.issueClient.findOpenIssueByTitle).toHaveBeenCalledExactlyOnceWith(TITULO);
  });

  it('deve nao abrir outra questao quando ja existe uma aberta', async () => {
    // Arrange
    const d = dubles(ABERTA);
    const useCase = new ReportPublicationStatusUseCase(d.issueClient, d.logger);

    // Act
    await useCase.execute('failure', 'motivo');

    // Assert
    expect(d.issueClient.openIssue).not.toHaveBeenCalled();
  });

  it('deve registrar que a questao ja estava aberta quando nao abre outra', async () => {
    // Arrange
    const d = dubles(ABERTA);
    const useCase = new ReportPublicationStatusUseCase(d.issueClient, d.logger);

    // Act
    await useCase.execute('failure', 'motivo');

    // Assert
    expect(d.logger.info).toHaveBeenCalledExactlyOnceWith('questao ja aberta, nada a fazer', {
      issue: 7,
    });
  });

  it('deve encerrar a questao aberta quando a publicacao conclui', async () => {
    // Arrange
    const d = dubles(ABERTA);
    const useCase = new ReportPublicationStatusUseCase(d.issueClient, d.logger);

    // Act
    await useCase.execute('success', '');

    // Assert
    expect(d.issueClient.closeIssue).toHaveBeenCalledExactlyOnceWith(7);
  });

  it('deve nao encerrar nada quando a publicacao conclui e nao ha questao aberta', async () => {
    // Arrange
    const d = dubles(null);
    const useCase = new ReportPublicationStatusUseCase(d.issueClient, d.logger);

    // Act
    await useCase.execute('success', '');

    // Assert
    expect(d.issueClient.closeIssue).not.toHaveBeenCalled();
  });

  it('deve nao abrir questao quando a publicacao conclui', async () => {
    // Arrange
    const d = dubles(ABERTA);
    const useCase = new ReportPublicationStatusUseCase(d.issueClient, d.logger);

    // Act
    await useCase.execute('success', '');

    // Assert
    expect(d.issueClient.openIssue).not.toHaveBeenCalled();
  });
});
