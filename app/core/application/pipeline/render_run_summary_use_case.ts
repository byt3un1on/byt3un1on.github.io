import type { IClassifyPipelineFailureUseCase } from '../../../interfaces/core/application/pipeline/i_classify_pipeline_failure_use_case.ts';
import type { QualityGateVerdict } from '../../../interfaces/core/application/pipeline/i_evaluate_quality_gate_use_case.ts';
import type { IRenderRunSummaryUseCase } from '../../../interfaces/core/application/pipeline/i_render_run_summary_use_case.ts';
import type { JobStatus, PipelineJobResultDto } from '../../domain/dtos/pipeline_job_result_dto.ts';

/** Marca de cada desfecho: e por ela que o olho varre o resumo sem ler tudo. */
const STATUS_MARKS: Readonly<Record<JobStatus, string>> = {
  sucesso: '✅',
  falha: '❌',
  cancelado: '⏹️',
};

/** RNF-08: a causa cabe em tres linhas; o resto vira ruido no resumo. */
const MAX_DETAIL_LINES = 3;

/**
 * RF-12 e RNF-08. Devolve texto e nao grava nada — quem grava e o repositorio
 * de resumo, que conhece o arquivo do executor.
 *
 * @example new RenderRunSummaryUseCase(classificador).renderJob(resultado)
 */
export class RenderRunSummaryUseCase implements IRenderRunSummaryUseCase {
  constructor(private readonly classifyFailure: IClassifyPipelineFailureUseCase) {}

  public renderJob(result: PipelineJobResultDto): string {
    const lines: string[] = [`### ${STATUS_MARKS[result.status]} ${result.name}`];
    if (result.status === 'falha') {
      lines.push(`**Causa**: ${this.classifyFailure.execute(result.detail)}`);
    }
    lines.push(...this.detailLines(result.detail));
    return `${lines.join('\n')}\n`;
  }

  public renderVerdict(verdict: QualityGateVerdict): string {
    if (verdict.approved) {
      return `## ✅ Portão aprovado\n${verdict.reason}\n`;
    }
    const failures = verdict.failed.map((result) => this.failureLine(result));
    return `## ❌ Portão reprovado\n${[verdict.reason, ...failures].join('\n')}\n`;
  }

  private detailLines(detail: string): readonly string[] {
    if (detail.length === 0) {
      return [];
    }
    const lines = detail.split('\n');
    if (lines.length <= MAX_DETAIL_LINES) {
      return lines;
    }
    return [...lines.slice(0, MAX_DETAIL_LINES), '… (detalhe truncado)'];
  }

  private failureLine(result: PipelineJobResultDto): string {
    if (result.detail.length === 0) {
      return `- ${result.name}`;
    }
    return `- ${result.name} — ${result.detail}`;
  }
}
