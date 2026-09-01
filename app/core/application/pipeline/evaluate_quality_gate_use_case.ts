import type {
  IEvaluateQualityGateUseCase,
  QualityGateVerdict,
} from '../../../interfaces/core/application/pipeline/i_evaluate_quality_gate_use_case.ts';
import type { PipelineJobResultDto } from '../../domain/dtos/pipeline_job_result_dto.ts';

/**
 * RF-05 e RF-13. Reprova nomeando toda verificacao que nao terminou em sucesso
 * — cancelado inclusive, porque job interrompido nao provou nada.
 *
 * @example new EvaluateQualityGateUseCase().execute(resultados).approved
 */
export class EvaluateQualityGateUseCase implements IEvaluateQualityGateUseCase {
  public execute(results: readonly PipelineJobResultDto[]): QualityGateVerdict {
    if (results.length === 0) {
      throw new Error('resultados invalidos: recebido 0 resultados, esperado ao menos 1');
    }
    const failed = results.filter((result) => result.status !== 'sucesso');
    return Object.freeze({
      approved: failed.length === 0,
      failed,
      reason: this.buildReason(results.length, failed),
    });
  }

  private buildReason(total: number, failed: readonly PipelineJobResultDto[]): string {
    if (failed.length === 0) {
      return `as ${total} verificacoes aprovaram`;
    }
    return `reprovaram: ${failed.map((result) => result.name).join(', ')}`;
  }
}
