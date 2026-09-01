/**
 * Modo de aprovacao da esteira (RF-09). No automatico so a primeira Pull
 * Request espera por gente; no manual, as tres esperam. O verificador existe
 * porque o valor chega do ambiente como texto livre, e texto livre nao e modo.
 */
export const PIPELINE_MODES = ['automatico', 'manual'] as const;

export type PipelineMode = (typeof PIPELINE_MODES)[number];

/** Modo assumido quando nem a configuracao nem a marcacao dizem qual e (RF-09). */
export const DEFAULT_PIPELINE_MODE: PipelineMode = 'automatico';

export function isPipelineMode(value: unknown): value is PipelineMode {
  return typeof value === 'string' && PIPELINE_MODES.includes(value as PipelineMode);
}
