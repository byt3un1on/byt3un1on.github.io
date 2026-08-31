import type { CatalogProjectDto } from '../../domain/dtos/catalog_dto';
import type { IStaticCatalogRepository } from '../../../interfaces/adapters/repositories/i_static_catalog_repository';
import type { IFilterProjectsByTechnologyUseCase } from '../../../interfaces/core/application/showcase/i_filter_projects_by_technology_use_case';

/**
 * RF-11. A correspondencia e por conter, e nao por ser principal: projeto
 * multi-repositorio emprega varias tecnologias, e restringir por TypeScript
 * precisa alcancar o sistema que tambem usa Python.
 */
export class FilterProjectsByTechnologyUseCase implements IFilterProjectsByTechnologyUseCase {
  constructor(private readonly catalogRepository: IStaticCatalogRepository) {}

  public execute(technology: string | null): readonly CatalogProjectDto[] {
    const projects = this.catalogRepository.load().projects;
    if (technology === null) {
      return projects;
    }
    return projects.filter((project) => project.technologies.includes(technology));
  }
}
