import {
  type GithubRepositoryDto,
  parseGithubRepositoryDto,
} from '../../core/domain/dtos/github_repository_dto.ts';
import {
  type CodeRepository,
  createCodeRepository,
} from '../../core/domain/entities/code_repository.ts';
import { CatalogSourceError } from '../../core/domain/errors/catalog_source_error.ts';
import type { IGithubOrganizationClient } from '../../interfaces/adapters/clients/i_github_organization_client.ts';
import type { IConfigTool } from '../../interfaces/infra/tools/i_config_tool.ts';

/** Repositorio vazio responde 409 `Git Repository is empty` neste recurso. */
const EMPTY_REPOSITORY_STATUS = 409;

/**
 * Fonte unica do catalogo (RF-02). O formato de fio da API morre aqui: o que
 * sai sao entidades de dominio, com a elegibilidade de RF-06 ja resolvida.
 */
export class GithubOrganizationClient implements IGithubOrganizationClient {
  constructor(private readonly config: IConfigTool) {}

  public async listRepositories(): Promise<readonly CodeRepository[]> {
    const path = `/orgs/${this.config.organizationLogin()}/repos?per_page=100&type=public`;
    const payload = await this.getJson(path);
    if (!Array.isArray(payload)) {
      throw new CatalogSourceError(`esperado array, recebido ${typeof payload}`, path);
    }
    const dtos = payload.map((item) => parseGithubRepositoryDto(item, path));
    return Promise.all(dtos.map(async (dto) => this.toEntity(dto)));
  }

  private async toEntity(dto: GithubRepositoryDto): Promise<CodeRepository> {
    return createCodeRepository({
      name: dto.name,
      url: dto.htmlUrl,
      description: dto.description,
      technology: dto.language,
      homepage: dto.homepage,
      lastActivityAt: dto.pushedAt,
      isPrivate: dto.isPrivate,
      isArchived: dto.isArchived,
      hasCommits: await this.hasCommits(dto.name),
    });
  }

  /**
   * Uma chamada por repositorio, e nao ha atalho: o campo `size` da API vale 0
   * tanto em repositorio vazio quanto em repositorio pequeno.
   */
  private async hasCommits(name: string): Promise<boolean> {
    const path = `/repos/${this.config.organizationLogin()}/${name}/commits?per_page=1`;
    const response = await this.request(path);
    if (response.status === EMPTY_REPOSITORY_STATUS) {
      return false;
    }
    if (!response.ok) {
      throw new CatalogSourceError(`resposta ${response.status}`, path);
    }
    return true;
  }

  private async getJson(path: string): Promise<unknown> {
    const response = await this.request(path);
    if (!response.ok) {
      throw new CatalogSourceError(`resposta ${response.status}`, path);
    }
    return response.json();
  }

  private async request(path: string): Promise<Response> {
    const token = this.config.githubToken();
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
    if (token !== null) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(`${this.config.githubApiBaseUrl()}${path}`, { headers });
  }
}
