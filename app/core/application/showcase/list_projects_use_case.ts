import type { CatalogProjectDto } from '../../domain/dtos/catalog_dto.ts';
import type { IStaticCatalogRepository } from '../../../interfaces/adapters/repositories/i_static_catalog_repository.ts';
import type { IListProjectsUseCase } from '../../../interfaces/core/application/showcase/i_list_projects_use_case.ts';

/** RF-02 e RF-04: a ordem entregue e a ordem da curadoria, sem reordenacao. */
export class ListProjectsUseCase implements IListProjectsUseCase {
  constructor(private readonly catalogRepository: IStaticCatalogRepository) {}

  public execute(): readonly CatalogProjectDto[] {
    return this.catalogRepository.load().projects;
  }
}
