import type { CatalogDto } from '../../../../core/domain/dtos/catalog_dto';
import type { CurationDto } from '../../../../core/domain/dtos/curation_dto';
import type { CodeRepository } from '../../../../core/domain/entities/code_repository';

/**
 * Cruza curadoria e organizacao e produz o catalogo: inclusao explicita
 * (RF-04), exclusao de inelegivel ainda que declarado (RF-06) e agrupamento
 * multi-repositorio com tecnologias e atividade derivadas (RF-07).
 */
export interface IAssembleCatalogUseCase {
  execute(curation: CurationDto, repositories: readonly CodeRepository[]): CatalogDto;
}
