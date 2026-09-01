/**
 * Acrescenta um bloco ao resumo da execucao (RF-12). E o unico ponto da esteira
 * que escreve em disco: os casos de uso devolvem texto.
 */
export interface IRunSummaryRepository {
  append(block: string): Promise<void>;
}
