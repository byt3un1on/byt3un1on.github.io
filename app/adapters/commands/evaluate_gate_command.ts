import {
  createPipelineJobResult,
  runnerStatusToJobStatus,
  type PipelineJobResultDto,
} from '../../core/domain/dtos/pipeline_job_result_dto.ts';
import type { IEvaluateGateCommand } from '../../interfaces/adapters/commands/i_evaluate_gate_command.ts';
import type { IEvaluateQualityGateUseCase } from '../../interfaces/core/application/pipeline/i_evaluate_quality_gate_use_case.ts';
import type { IRenderRunSummaryUseCase } from '../../interfaces/core/application/pipeline/i_render_run_summary_use_case.ts';
import type { IRunSummaryRepository } from '../../interfaces/adapters/repositories/i_run_summary_repository.ts';
import type { IConfigTool } from '../../interfaces/infra/tools/i_config_tool.ts';
import type { ILoggerTool } from '../../interfaces/infra/tools/i_logger_tool.ts';

const USAGE = 'ESTEIRA_RESULTADOS: [{"name":"Portao","status":"success"}]';

/** Um resultado como o YAML o entrega, antes de virar dominio. */
interface RunnerResult {
  readonly name?: unknown;
  readonly status?: unknown;
  readonly detail?: unknown;
}

/**
 * O JSON vem do YAML e nao tem tipo. Converter so o que ja e texto, em vez de
 * chamar String() no que vier, evita que um objeto vire "[object Object]" e
 * chegue ao portao como se fosse nome de job.
 */
function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/**
 * Subcomando `pipeline gate` (RF-05, RF-13). Traduz o vocabulario do executor
 * para o do dominio, pede o veredito e grava o motivo no resumo. O codigo de
 * saida e o que bloqueia a cadeia — o YAML nao reinterpreta nada.
 */
export class EvaluateGateCommand implements IEvaluateGateCommand {
  constructor(
    private readonly config: IConfigTool,
    private readonly evaluateGate: IEvaluateQualityGateUseCase,
    private readonly renderSummary: IRenderRunSummaryUseCase,
    private readonly summary: IRunSummaryRepository,
    private readonly logger: ILoggerTool,
  ) {}

  public async execute(): Promise<number> {
    const raw = this.config.pipelineResults();
    if (raw === null) {
      this.logger.error('resultados ausentes', { received: null, expected: USAGE });
      return 2;
    }
    try {
      const verdict = this.evaluateGate.execute(this.parse(raw));
      await this.summary.append(this.renderSummary.renderVerdict(verdict));
      return verdict.approved ? 0 : 1;
    } catch (error) {
      this.logger.error('nao foi possivel avaliar o portao', {
        reason: error instanceof Error ? error.message : String(error),
      });
      return 2;
    }
  }

  private parse(raw: string): readonly PipelineJobResultDto[] {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error(`resultados invalidos: recebido ${raw}, esperado ${USAGE}`);
    }
    return parsed.map((item: RunnerResult) =>
      createPipelineJobResult(
        text(item.name),
        runnerStatusToJobStatus(text(item.status)),
        text(item.detail),
      ),
    );
  }
}
