import type { IClassifyPipelineFailureUseCase } from '../../../interfaces/core/application/pipeline/i_classify_pipeline_failure_use_case.ts';
import type { PipelineFailureCause } from '../../domain/enums/pipeline_failure_cause_enum.ts';

/**
 * Pistas de cada causa, na ordem em que sao procuradas, e a ordem importa. Uma
 * mensagem de permissao negada frequentemente tambem diz `denied`, e uma de
 * credencial ruim raramente diz `conflict`: procurar do mais especifico para o
 * mais generico impede que `denied` engula o caso de credencial. Todas as
 * pistas ja estao em minusculas, porque a saida e normalizada antes da busca;
 * `conflict` cobre `CONFLICT` e `merge conflict` por ser subcadeia dos dois.
 */
const CAUSE_HINTS: ReadonlyArray<readonly [PipelineFailureCause, readonly string[]]> = [
  ['conflito', ['conflict', 'not mergeable']],
  ['credencial', ['bad credentials', 'esteira_token', 'gh_token', 'credencial', 'authentication']],
  ['permissao', ['permission', 'denied', '403', 'not authorized', 'protected branch']],
];

/** Devolvida quando nenhuma pista e reconhecida: e resposta, nao causa inventada. */
const UNKNOWN_CAUSE: PipelineFailureCause = 'desconhecida';

/**
 * RF-15, RF-17 e RF-20. Le a saida de erro do passo que falhou e nomeia a
 * causa, para a execucao nunca terminar com erro generico.
 */
export class ClassifyPipelineFailureUseCase implements IClassifyPipelineFailureUseCase {
  public execute(output: string): PipelineFailureCause {
    const normalized = output.toLowerCase();
    const matched = CAUSE_HINTS.find(([, hints]) =>
      hints.some((hint) => normalized.includes(hint)),
    );
    if (matched === undefined) {
      return UNKNOWN_CAUSE;
    }
    return matched[0];
  }
}
