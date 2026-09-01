/**
 * Subcomando `pipeline summary` (RF-12, RF-15, RF-16). Nome, situacao e detalhe
 * do job chegam por variavel de ambiente, pelo mesmo motivo do portao. Situacao
 * `falha` faz o detalhe passar pela classificacao de causa, para o resumo
 * nomear permissao, credencial ou conflito em vez de repetir a saida crua.
 */
export interface IWriteSummaryCommand {
  execute(): Promise<number>;
}
