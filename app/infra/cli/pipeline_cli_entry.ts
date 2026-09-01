import type { IEvaluateGateCommand } from '../../interfaces/adapters/commands/i_evaluate_gate_command.ts';
import type { IResolveModeCommand } from '../../interfaces/adapters/commands/i_resolve_mode_command.ts';
import type { IResolveVersionCommand } from '../../interfaces/adapters/commands/i_resolve_version_command.ts';
import type { IWriteSummaryCommand } from '../../interfaces/adapters/commands/i_write_summary_command.ts';
import type { IPipelineCliEntry } from '../../interfaces/infra/cli/i_pipeline_cli_entry.ts';
import type { ILoggerTool } from '../../interfaces/infra/tools/i_logger_tool.ts';

const USAGE = 'uso: pipeline version | mode | gate | summary';

/**
 * Interpreta o subcomando da esteira e escolhe o comando. Nenhum dado vem por
 * argumento: nome de job e resultado carregam espaco, e `make` quebraria neles.
 * Tem teste justamente por decidir algo — o entrypoint, que so o chama, e isento.
 */
export class PipelineCliEntry implements IPipelineCliEntry {
  constructor(
    private readonly resolveVersion: IResolveVersionCommand,
    private readonly resolveMode: IResolveModeCommand,
    private readonly evaluateGate: IEvaluateGateCommand,
    private readonly writeSummary: IWriteSummaryCommand,
    private readonly logger: ILoggerTool,
  ) {}

  public async run(argv: readonly string[]): Promise<number> {
    const [subcommand] = argv;
    if (subcommand === 'version') {
      return this.resolveVersion.execute();
    }
    if (subcommand === 'mode') {
      return this.resolveMode.execute();
    }
    if (subcommand === 'gate') {
      return this.evaluateGate.execute();
    }
    if (subcommand === 'summary') {
      return this.writeSummary.execute();
    }
    this.logger.error('subcomando desconhecido', { received: subcommand ?? null, expected: USAGE });
    return 2;
  }
}
