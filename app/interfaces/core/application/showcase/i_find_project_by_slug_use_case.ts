import type { CatalogProjectDto } from '../../../../core/domain/dtos/catalog_dto.ts';

/**
 * RF-08. Devolve nulo quando o slug nao existe, para a rota cair na pagina de
 * erro propria de RF-12 em vez de estourar.
 */
export interface IFindProjectBySlugUseCase {
  execute(slug: string): CatalogProjectDto | null;
}
