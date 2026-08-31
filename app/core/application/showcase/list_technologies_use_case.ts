import type { IStaticCatalogRepository } from '../../../interfaces/adapters/repositories/i_static_catalog_repository';
import type { IListTechnologiesUseCase } from '../../../interfaces/core/application/showcase/i_list_technologies_use_case';

/** RF-11: os criterios oferecidos ao visitante saem do proprio catalogo. */
export class ListTechnologiesUseCase implements IListTechnologiesUseCase {
  constructor(private readonly catalogRepository: IStaticCatalogRepository) {}

  public execute(): readonly string[] {
    const found = this.catalogRepository.load().projects.flatMap((project) => project.technologies);
    return [...new Set(found)].sort((a, b) => a.localeCompare(b));
  }
}
