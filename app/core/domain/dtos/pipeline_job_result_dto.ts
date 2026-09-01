/**
 * Situacao com que um job da esteira termina (RF-05, RF-12). Sao as tres que o
 * portao precisa distinguir: cancelado nao e falha, e nao merece o mesmo aviso.
 */
export const JOB_STATUSES = ['sucesso', 'falha', 'cancelado'] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export function isJobStatus(value: unknown): value is JobStatus {
  return typeof value === 'string' && JOB_STATUSES.includes(value as JobStatus);
}

/** O desfecho de um job, como o portao o le e o resumo o relata (RF-05, RF-12). */
export interface PipelineJobResultDto {
  readonly name: string;
  readonly status: JobStatus;
  readonly detail: string;
}

function requireName(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(`name invalido: recebido ${JSON.stringify(value)}, esperado texto nao vazio`);
  }
  return trimmed;
}

function requireStatus(value: string): JobStatus {
  if (!isJobStatus(value)) {
    throw new Error(
      `status invalido: recebido ${JSON.stringify(value)}, esperado um de ${JOB_STATUSES.join(', ')}`,
    );
  }
  return value;
}

/**
 * Constroi o resultado validando a borda, porque o dado chega como texto da
 * linha de comando: quem o produz e o YAML do Actions, sem tipo nenhum.
 *
 * @example createPipelineJobResult('testes', 'falha', 'cobertura 82%')
 */
export function createPipelineJobResult(
  name: string,
  status: string,
  detail?: string,
): PipelineJobResultDto {
  return Object.freeze({
    name: requireName(name),
    status: requireStatus(status),
    detail: (detail ?? '').trim(),
  });
}

/**
 * Vocabulario do executor do GitHub traduzido para o do dominio. `skipped` e
 * `cancelled` viram `cancelado`: o job nao rodou, e nao merece o aviso de quem
 * rodou e falhou. Situacao desconhecida vira `falha` de proposito — portao que
 * nao entende o que recebeu tem de fechar, nunca abrir.
 */
const RUNNER_STATUSES: Readonly<Record<string, JobStatus>> = {
  success: 'sucesso',
  cancelled: 'cancelado',
  skipped: 'cancelado',
};

export function runnerStatusToJobStatus(value: string): JobStatus {
  const normalized = value.trim().toLowerCase();
  if (isJobStatus(normalized)) {
    return normalized;
  }
  return RUNNER_STATUSES[normalized] ?? 'falha';
}
