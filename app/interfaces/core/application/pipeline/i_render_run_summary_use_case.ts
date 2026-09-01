import type { PipelineJobResultDto } from '../../../../core/domain/dtos/pipeline_job_result_dto.ts';
import type { QualityGateVerdict } from './i_evaluate_quality_gate_use_case.ts';

/**
 * RF-12 e RNF-08: monta o bloco em Markdown que o resumo da execucao recebe.
 * Devolve texto e nao grava nada — quem grava e o repositorio de resumo, que
 * conhece o arquivo do executor. A causa cabe em no maximo tres linhas.
 */
export interface IRenderRunSummaryUseCase {
  /** Bloco de um job: o que foi verificado, como terminou e por que. */
  renderJob(result: PipelineJobResultDto): string;
  /** Bloco do portao: veredito e, reprovando, toda verificacao que falhou. */
  renderVerdict(verdict: QualityGateVerdict): string;
}
