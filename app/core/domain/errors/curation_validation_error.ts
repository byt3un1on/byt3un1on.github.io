/**
 * Curadoria invalida impede a publicacao inteira (RF-05). Existe para o
 * comando distinguir defeito de curadoria de falha da fonte, que e outra
 * historia e tem outro tratamento.
 *
 * @example
 * throw new CurationValidationError('entrada sem resumo', ['shortsmaker']);
 */
export class CurationValidationError extends Error {
  public readonly entries: readonly string[];

  constructor(reason: string, entries: readonly string[]) {
    super(`curadoria invalida: ${reason}; entradas afetadas: ${entries.join(', ') || '(nenhuma)'}`);
    this.name = 'CurationValidationError';
    this.entries = Object.freeze([...entries]);
  }
}
