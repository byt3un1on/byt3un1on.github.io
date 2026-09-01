import { formatSemanticVersion } from '../../core/domain/models/semantic_version_model.ts';
import type { IResolveVersionCommand } from '../../interfaces/adapters/commands/i_resolve_version_command.ts';
import type { IResolveNextVersionUseCase } from '../../interfaces/core/application/pipeline/i_resolve_next_version_use_case.ts';
import type { ILoggerTool } from '../../interfaces/infra/tools/i_logger_tool.ts';

/**
 * Subcomando `pipeline version` (RF-10). Imprime a versao e nada mais: o YAML a
 * captura com `$(make -s pipeline version)`, e qualquer enfeite na saida viraria
 * parte do numero da release.
 */
export class ResolveVersionCommand implements IResolveVersionCommand {
  constructor(
    private readonly resolveVersion: IResolveNextVersionUseCase,
    private readonly logger: ILoggerTool,
    private readonly write: (line: string) => void = console.log,
  ) {}

  public async execute(): Promise<number> {
    try {
      this.write(formatSemanticVersion(await this.resolveVersion.execute()));
      return 0;
    } catch (error) {
      this.logger.error('nao foi possivel decidir a versao', {
        reason: error instanceof Error ? error.message : String(error),
      });
      return 1;
    }
  }
}
