/**
 * Subcomando `pipeline gate` (RF-05, RF-13). Os resultados dos jobs chegam por
 * variavel de ambiente, em JSON, porque argumento de `make` quebra em espacos e
 * "Analise estatica=success" viraria dois alvos. Grava o veredito no resumo e
 * devolve codigo nao-zero quando o portao reprova — e o codigo que bloqueia a
 * cadeia no YAML.
 */
export interface IEvaluateGateCommand {
  execute(): Promise<number>;
}
