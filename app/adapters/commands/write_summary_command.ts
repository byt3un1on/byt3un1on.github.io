import {
  createPipelineJobResult,
  runnerStatusToJobStatus,
} from '../../core/domain/dtos/pipeline_job_result_dto.ts';
import type { IWriteSummaryCommand } from '../../interfaces/adapters/commands/i_write_summary_command.ts';
import type { IRenderRunSummaryUseCase } from '../../interfaces/core/application/pipeline/i_render_run_summary_use_case.ts';
import type { IRunSummaryRepository } from '../../interfaces/adapters/repositories/i_run_summary_repository.ts';
import type { IConfigTool } from '../../interfaces/infra/tools/i_config_tool.ts';
import type { ILoggerTool } from '../../interfaces/infra/tools/i_logger_tool.ts';

const USAGE = 'ESTEIRA_JOB e ESTEIRA_STATUS sao obrigatorios; ESTEIRA_DETALHE e opcional';

/**
 * Subcomando `pipeline summary` (RF-12, RF-16). Roda com `if: always()` em todo
 * job, entao nunca aborta a execucao por conta propria: falhar ao escrever o
 * resumo nao pode transformar um job verde em vermelho.
 */
export class WriteSummaryCommand implements IWriteSummaryCommand {
  constructor(
    private readonly config: IConfigTool,
    private readonly renderSummary: IRenderRunSummaryUseCase,
    private readonly summary: IRunSummaryRepository,
    private readonly logger: ILoggerTool,
  ) {}

  public async execute(): Promise<number> {
    const job = this.config.summaryJob();
    const status = this.config.summaryStatus();
    if (job === null || status === null) {
      this.logger.error('resumo incompleto', { job, status, expected: USAGE });
      return 2;
    }
    try {
      const result = createPipelineJobResult(
        job,
        runnerStatusToJobStatus(status),
        this.config.summaryDetail() ?? '',
      );
      await this.summary.append(this.renderSummary.renderJob(result));
      return 0;
    } catch (error) {
      this.logger.error('nao foi possivel escrever o resumo', {
        reason: error instanceof Error ? error.message : String(error),
      });
      return 1;
    }
  }
}
