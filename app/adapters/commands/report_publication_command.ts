import type {
  IReportPublicationCommand,
  PublicationOutcome,
} from '../../interfaces/adapters/commands/i_report_publication_command.ts';
import type { IReportPublicationStatusUseCase } from '../../interfaces/core/application/catalog/i_report_publication_status_use_case.ts';
import type { ILoggerTool } from '../../interfaces/infra/tools/i_logger_tool.ts';

/**
 * Alvo `make report` (RF-16). Roda na fronteira do fluxo, sempre, e por isso
 * enxerga aborto de build e de prerender — nao so o de catalogo.
 */
export class ReportPublicationCommand implements IReportPublicationCommand {
  constructor(
    private readonly reportStatus: IReportPublicationStatusUseCase,
    private readonly logger: ILoggerTool,
  ) {}

  public async execute(outcome: PublicationOutcome, reason: string): Promise<number> {
    try {
      await this.reportStatus.execute(outcome, reason);
      this.logger.info('desfecho registrado', { outcome });
      return 0;
    } catch (error) {
      this.logger.error('nao foi possivel registrar o desfecho', {
        outcome,
        reason: error instanceof Error ? error.message : String(error),
      });
      return 1;
    }
  }
}
