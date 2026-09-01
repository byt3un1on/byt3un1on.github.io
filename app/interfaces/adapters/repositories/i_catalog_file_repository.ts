import type { CatalogDto } from '../../../core/domain/dtos/catalog_dto.ts';

/**
 * Escreve os dois artefatos que o build consome: o catalogo e a lista de rotas
 * a prerenderizar, que e o que faz cada pagina de projeto existir como arquivo
 * (RF-08, RF-15).
 */
export interface ICatalogFileRepository {
  writeCatalog(catalog: CatalogDto): Promise<void>;
  writePrerenderRoutes(routes: readonly string[]): Promise<void>;
}
