/**
 * Inicializador da linha de comando da esteira. Interpreta os argumentos e
 * escolhe o subcomando — e por isso tem teste, enquanto o entrypoint nao tem.
 */
export interface IPipelineCliEntry {
  run(argv: readonly string[]): Promise<number>;
}
