/**
 * Comando de `make catalog`. Devolve o codigo de saida: zero quando o catalogo
 * foi escrito, diferente de zero quando a publicacao deve abortar (RF-14).
 */
export interface IGenerateCatalogCommand {
  execute(): Promise<number>;
}
