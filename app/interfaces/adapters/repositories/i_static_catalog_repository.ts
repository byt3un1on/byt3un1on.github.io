import type { CatalogDto } from '../../../core/domain/dtos/catalog_dto';

/**
 * Le o catalogo ja gerado, do lado do sitio. **Sincrono de proposito**: o dado
 * chega embutido no bundle, e nao pela rede. Uma assinatura assincrona aqui
 * abriria a porta para a requisicao que o RNF-08 proibe.
 */
export interface IStaticCatalogRepository {
  load(): CatalogDto;
}
