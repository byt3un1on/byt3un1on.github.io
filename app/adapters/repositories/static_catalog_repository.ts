import { type CatalogDto, parseCatalogDto } from '../../core/domain/dtos/catalog_dto.ts';
import type { IStaticCatalogRepository } from '../../interfaces/adapters/repositories/i_static_catalog_repository.ts';
// Sem atributo de import: o builder Angular fixa o `module` e recusa
// atributos. `resolveJsonModule` basta, e o esbuild embute o JSON no bundle —
// que e o que mantem o RNF-08 em zero requisicao do visitante.
import generatedCatalog from '../../data/catalog.generated.json';

/**
 * Le o catalogo que `make catalog` gerou. O dado chega **embutido no bundle**,
 * e por isso o navegador do visitante nao faz requisicao alguma (RNF-08).
 */
export class StaticCatalogRepository implements IStaticCatalogRepository {
  private parsed: CatalogDto | null = null;

  constructor(private readonly source: unknown = generatedCatalog) {}

  public load(): CatalogDto {
    this.parsed ??= parseCatalogDto(this.source);
    return this.parsed;
  }
}
