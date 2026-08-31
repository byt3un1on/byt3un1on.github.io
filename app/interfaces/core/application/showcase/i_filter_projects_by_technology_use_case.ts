import type { CatalogProjectDto } from '../../../../core/domain/dtos/catalog_dto';

/**
 * RF-11: devolve o projeto cuja lista de tecnologias **contenha** a escolhida —
 * e nao o que a tenha como principal, porque projeto multi-repositorio emprega
 * varias. Tecnologia nula devolve o catalogo inteiro.
 */
export interface IFilterProjectsByTechnologyUseCase {
  execute(technology: string | null): readonly CatalogProjectDto[];
}
