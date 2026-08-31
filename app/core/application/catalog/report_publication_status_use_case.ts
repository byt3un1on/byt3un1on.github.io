import type {
  IReportPublicationStatusUseCase,
  PublicationOutcome,
} from '../../../interfaces/core/application/catalog/i_report_publication_status_use_case.ts';
import type { IGithubIssueClient } from '../../../interfaces/adapters/clients/i_github_issue_client.ts';
import type { ILoggerTool } from '../../../interfaces/infra/tools/i_logger_tool.ts';

/** Titulo fixo: e por ele que a questao aberta e reencontrada e encerrada. */
const ISSUE_TITLE = 'Publicacao da vitrine abortada';

/**
 * RF-16. Consultar antes de abrir e o que impede a duplicata a cada aborto em
 * sequencia; encerrar so quando ha questao aberta evita ruido no sucesso.
 */
export class ReportPublicationStatusUseCase implements IReportPublicationStatusUseCase {
  constructor(
    private readonly issueClient: IGithubIssueClient,
    private readonly logger: ILoggerTool,
  ) {}

  public async execute(outcome: PublicationOutcome, reason: string): Promise<void> {
    if (outcome === 'failure') {
      await this.openIfAbsent(reason);
      return;
    }
    await this.closeIfPresent();
  }

  private async openIfAbsent(reason: string): Promise<void> {
    const existing = await this.issueClient.findOpenIssueByTitle(ISSUE_TITLE);
    if (existing !== null) {
      this.logger.info('questao ja aberta, nada a fazer', { issue: existing.number });
      return;
    }
    await this.issueClient.openIssue(
      ISSUE_TITLE,
      `A publicacao foi abortada.\n\nMotivo: ${reason}`,
    );
  }

  private async closeIfPresent(): Promise<void> {
    const existing = await this.issueClient.findOpenIssueByTitle(ISSUE_TITLE);
    if (existing === null) {
      return;
    }
    await this.issueClient.closeIssue(existing.number);
  }
}
