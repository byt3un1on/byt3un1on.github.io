import type { PipelineJobResultDto } from '../../../../core/domain/dtos/pipeline_job_result_dto.ts';

/** Desfecho do portao, com o motivo pronto para o resumo da execucao (RF-05). */
export interface QualityGateVerdict {
  readonly approved: boolean;
  /** Jobs que reprovaram, na ordem em que foram informados. */
  readonly failed: readonly PipelineJobResultDto[];
  /** Motivo em texto corrido, nomeando cada verificacao reprovada. */
  readonly reason: string;
}

/**
 * RF-05 e RF-13: confronta os resultados dos jobs e decide se a cadeia segue.
 * Reprova nomeando **todas** as verificacoes que falharam, e nao apenas a
 * primeira — quem acompanha precisa ver o estrago inteiro de uma vez.
 */
export interface IEvaluateQualityGateUseCase {
  execute(results: readonly PipelineJobResultDto[]): QualityGateVerdict;
}
