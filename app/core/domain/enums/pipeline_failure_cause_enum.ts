/**
 * Causa nomeada da falha da esteira (RF-15, RF-17, RF-20). Existe para que a
 * execucao nunca termine com erro generico: quem acompanha precisa saber se
 * faltou permissao, faltou credencial ou houve conflito.
 */
export const PIPELINE_FAILURE_CAUSES = [
  'permissao',
  'credencial',
  'conflito',
  'desconhecida',
] as const;

export type PipelineFailureCause = (typeof PIPELINE_FAILURE_CAUSES)[number];

export function isPipelineFailureCause(value: unknown): value is PipelineFailureCause {
  return (
    typeof value === 'string' && PIPELINE_FAILURE_CAUSES.includes(value as PipelineFailureCause)
  );
}
