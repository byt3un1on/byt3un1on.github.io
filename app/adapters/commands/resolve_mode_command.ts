import type { IResolveModeCommand } from '../../interfaces/adapters/commands/i_resolve_mode_command.ts';
import type { IResolvePipelineModeUseCase } from '../../interfaces/core/application/pipeline/i_resolve_pipeline_mode_use_case.ts';
import type { ILoggerTool } from '../../interfaces/infra/tools/i_logger_tool.ts';

/**
 * Subcomando `pipeline mode` (RF-09). Imprime o modo e nada mais, pelo mesmo
 * motivo do subcomando de versao: o YAML captura a saida crua.
 */
export class ResolveModeCommand implements IResolveModeCommand {
  constructor(
    private readonly resolveMode: IResolvePipelineModeUseCase,
    private readonly logger: ILoggerTool,
    private readonly write: (line: string) => void = console.log,
  ) {}

  // Sem `async`: a decisao do modo e sincrona, e marcar o metodo como
  // assincrono so para casar com a interface reprovaria no `require-await`.
  public execute(): Promise<number> {
    try {
      this.write(this.resolveMode.execute());
      return Promise.resolve(0);
    } catch (error) {
      this.logger.error('nao foi possivel decidir o modo', {
        reason: error instanceof Error ? error.message : String(error),
      });
      return Promise.resolve(1);
    }
  }
}
