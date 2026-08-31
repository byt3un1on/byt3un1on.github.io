import type { CatalogProjectDto } from '../../../../core/domain/dtos/catalog_dto';

/** Projetos na ordem da curadoria, com o destaque a frente (RF-02, RF-04). */
export interface IListProjectsUseCase {
  execute(): readonly CatalogProjectDto[];
}
