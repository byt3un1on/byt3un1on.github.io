import type {
  CatalogDto,
  CatalogProjectDto,
  CatalogRepositoryDto,
} from '../../domain/dtos/catalog_dto';
import type { CurationDto, CurationProjectDto } from '../../domain/dtos/curation_dto';
import { type CodeRepository, isEligibleForShowcase } from '../../domain/entities/code_repository';
import {
  createProject,
  projectHomepage,
  projectLastActivityAt,
  projectTechnologies,
} from '../../domain/entities/project';
import type { IAssembleCatalogUseCase } from '../../../interfaces/core/application/catalog/i_assemble_catalog_use_case';

/**
 * Cruza curadoria e organizacao. A ordem do catalogo e a ordem da curadoria
 * (RF-04); nada e reordenado por destaque, que e sinalizacao.
 */
export class AssembleCatalogUseCase implements IAssembleCatalogUseCase {
  public execute(curation: CurationDto, repositories: readonly CodeRepository[]): CatalogDto {
    const byName = new Map(repositories.map((repository) => [repository.name, repository]));
    const projects = curation.projects
      .map((entry) => this.assembleProject(entry, byName))
      .filter((project): project is CatalogProjectDto => project !== null);
    return { generatedAt: new Date().toISOString(), projects };
  }

  /** Devolve nulo quando nenhum repositorio do projeto sobrevive ao RF-06. */
  private assembleProject(
    entry: CurationProjectDto,
    byName: ReadonlyMap<string, CodeRepository>,
  ): CatalogProjectDto | null {
    const eligible = entry.repositories
      .map((name) => byName.get(name))
      .filter((repository): repository is CodeRepository => repository !== undefined)
      .filter(isEligibleForShowcase);
    if (eligible.length === 0) {
      return null;
    }
    const project = createProject({
      slug: entry.slug,
      name: entry.name,
      summary: entry.summary,
      highlighted: entry.highlighted,
      repositories: eligible,
    });
    return {
      slug: project.slug,
      name: project.name,
      summary: project.summary,
      highlighted: project.highlighted,
      technologies: projectTechnologies(project),
      lastActivityAt: projectLastActivityAt(project).toISOString(),
      homepage: projectHomepage(project),
      repositories: eligible.map(toRepositoryDto),
    };
  }
}

/** Nao usa estado da classe, entao e funcao de modulo: metodo desacoplado do
 *  objeto e o que a regra `unbound-method` justamente adverte. */
function toRepositoryDto(repository: CodeRepository): CatalogRepositoryDto {
  return {
    name: repository.name,
    url: repository.url,
    description: repository.description,
    technology: repository.technology,
    homepage: repository.homepage,
    lastActivityAt: repository.lastActivityAt.toISOString(),
  };
}
