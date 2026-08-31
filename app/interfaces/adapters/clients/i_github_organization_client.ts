import type { CodeRepository } from '../../../core/domain/entities/code_repository.ts';

/**
 * Fonte unica do catalogo (RF-02). Devolve entidades ja traduzidas: o formato
 * de fio da API morre dentro do adaptador, e nenhuma camada acima o conhece.
 *
 * A elegibilidade de RF-06 vem preenchida em cada entidade — inclusive
 * `hasCommits`, que exige uma chamada por repositorio porque o campo `size` da
 * API vale 0 tanto em repositorio vazio quanto em repositorio pequeno.
 */
export interface IGithubOrganizationClient {
  listRepositories(): Promise<readonly CodeRepository[]>;
}
