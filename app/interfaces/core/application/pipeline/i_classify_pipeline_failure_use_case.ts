import type { PipelineFailureCause } from '../../../../core/domain/enums/pipeline_failure_cause_enum.ts';

/**
 * RF-15, RF-17 e RF-20: le a saida de erro do passo que falhou e nomeia a
 * causa, para a execucao nunca terminar com erro generico. Nao reconhecendo o
 * texto, devolve `desconhecida` — que tambem e uma resposta, e melhor que uma
 * causa inventada.
 */
export interface IClassifyPipelineFailureUseCase {
  execute(output: string): PipelineFailureCause;
}
