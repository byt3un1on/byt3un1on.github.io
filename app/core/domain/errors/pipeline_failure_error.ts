import type { PipelineFailureCause } from '../enums/pipeline_failure_cause_enum.ts';

const MOTIVO_AUSENTE = 'motivo nao informado';

/**
 * A esteira parou por uma causa nomeada (RF-15, RF-17, RF-20). Existe para que
 * a execucao nunca termine com erro generico: a mensagem abre pela causa e
 * carrega o texto original da ferramenta que falhou, que e o que o log
 * estruturado e a questao de publicacao precisam mostrar.
 *
 * O `original` chega sem espaco nas pontas; quando vem vazio (ou so espaco), a
 * mensagem usa `motivo nao informado` no lugar dele, para nunca terminar em
 * dois pontos soltos — e `original` fica como string vazia.
 *
 * `cause` sobrescreve a propriedade homonima de `Error` (ES2022), que e
 * `unknown` opcional: `override` e obrigatorio sob `noImplicitOverride`, e o
 * tipo estreitado mantem `cause` como o vocabulario do dominio.
 *
 * @example
 * throw new PipelineFailureError('permissao', 'o token nao pode escrever em gh-pages');
 * // message: 'esteira interrompida por permissao: o token nao pode escrever em gh-pages'
 */
export class PipelineFailureError extends Error {
  public override readonly cause: PipelineFailureCause;
  public readonly original: string;

  constructor(cause: PipelineFailureCause, original: string) {
    const trimmed: string = original.trim();
    super(`esteira interrompida por ${cause}: ${trimmed === '' ? MOTIVO_AUSENTE : trimmed}`);
    this.name = 'PipelineFailureError';
    this.cause = cause;
    this.original = trimmed;
  }
}
