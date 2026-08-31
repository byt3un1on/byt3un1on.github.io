/**
 * Inicializador da linha de comando. Interpreta os argumentos e escolhe o
 * comando — e por isso ele tem teste, enquanto os entrypoints nao tem.
 */
export interface ICliEntry {
  run(argv: readonly string[]): Promise<number>;
}
