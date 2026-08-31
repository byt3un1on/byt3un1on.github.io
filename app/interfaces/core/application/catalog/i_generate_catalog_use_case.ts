import type { CatalogDto } from '../../../../core/domain/dtos/catalog_dto';

/**
 * Orquestra a geracao: le a curadoria, busca a organizacao, valida, monta e
 * grava. Deixa o erro subir — quem traduz falha em codigo de saida e o comando,
 * que e onde RF-14 se materializa.
 */
export interface IGenerateCatalogUseCase {
  execute(): Promise<CatalogDto>;
}
