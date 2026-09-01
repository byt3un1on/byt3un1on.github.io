import type { IGenerateCatalogCommand } from '../../interfaces/adapters/commands/i_generate_catalog_command.ts';
import type { IReportPublicationCommand } from '../../interfaces/adapters/commands/i_report_publication_command.ts';
import type { ICliEntry } from '../../interfaces/infra/cli/i_cli_entry.ts';
import type { ILoggerTool } from '../../interfaces/infra/tools/i_logger_tool.ts';

const USAGE = 'uso: catalog | report <success|failure> [motivo]';

/**
 * Interpreta os argumentos e escolhe o comando. Tem teste justamente por
 * decidir algo — os entrypoints, que so o chamam, sao isentos.
 */
export class CliEntry implements ICliEntry {
  constructor(
    private readonly generateCatalog: IGenerateCatalogCommand,
    private readonly reportPublication: IReportPublicationCommand,
    private readonly logger: ILoggerTool,
  ) {}

  public async run(argv: readonly string[]): Promise<number> {
    const [command, ...rest] = argv;
    if (command === 'catalog') {
      return this.generateCatalog.execute();
    }
    if (command === 'report') {
      return this.runReport(rest);
    }
    this.logger.error('comando desconhecido', { received: command ?? null, expected: USAGE });
    return 2;
  }

  private async runReport(args: readonly string[]): Promise<number> {
    const [outcome, ...reason] = args;
    if (outcome !== 'success' && outcome !== 'failure') {
      this.logger.error('desfecho invalido', { received: outcome ?? null, expected: USAGE });
      return 2;
    }
    return this.reportPublication.execute(outcome, reason.join(' '));
  }
}
