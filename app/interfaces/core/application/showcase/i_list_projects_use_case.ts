import type { CatalogProjectDto } from '../../../../core/domain/dtos/catalog_dto.ts';

/**
 * Projetos na ordem em que a curadoria os declara (RF-02, RF-04). Destaque e
 * sinalizacao, nao ordenacao: a posicao ja e a ordem, e reordenar por destaque
 * tiraria da curadoria o controle que RF-04 lhe da.
 */
export interface IListProjectsUseCase {
  execute(): readonly CatalogProjectDto[];
}
