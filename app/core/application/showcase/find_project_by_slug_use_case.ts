import type { CatalogProjectDto } from '../../domain/dtos/catalog_dto';
import type { IStaticCatalogRepository } from '../../../interfaces/adapters/repositories/i_static_catalog_repository';
import type { IFindProjectBySlugUseCase } from '../../../interfaces/core/application/showcase/i_find_project_by_slug_use_case';

/** RF-08. Nulo quando o slug nao existe, para a rota cair no 404 de RF-12. */
export class FindProjectBySlugUseCase implements IFindProjectBySlugUseCase {
  constructor(private readonly catalogRepository: IStaticCatalogRepository) {}

  public execute(slug: string): CatalogProjectDto | null {
    const found = this.catalogRepository.load().projects.find((project) => project.slug === slug);
    return found ?? null;
  }
}
