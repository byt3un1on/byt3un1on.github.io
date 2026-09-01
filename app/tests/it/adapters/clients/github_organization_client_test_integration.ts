import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GithubOrganizationClient } from '../../../../adapters/clients/github_organization_client.ts';
import { CatalogSourceError } from '../../../../core/domain/errors/catalog_source_error.ts';
import { ConfigTool } from '../../../../infra/tools/config_tool.ts';
import {
  repositoryPayload,
  stubCommits,
  stubOrganizationRepositories,
  stubOrganizationUnavailable,
} from '../../stubs/organization_stubs.ts';
import { resetStubs } from '../../stubs/wiremock.ts';

function client(): GithubOrganizationClient {
  return new GithubOrganizationClient(
    new ConfigTool({
      GITHUB_API_BASE_URL: process.env['WIREMOCK_BASE_URL'] ?? 'http://wiremock:8080',
      GITHUB_ORG: 'byt3un1on',
    }),
  );
}

describe('GithubOrganizationClient contra a API simulada', () => {
  beforeEach(async () => {
    await resetStubs();
  });

  afterEach(async () => {
    await resetStubs();
  });

  it('deve traduzir a resposta real da API em entidades quando a organizacao responde', async () => {
    // Arrange
    await stubOrganizationRepositories([repositoryPayload()]);
    await stubCommits('shortsmaker-api', 200);

    // Act
    const repositorios = await client().listRepositories();

    // Assert
    expect(repositorios[0]).toMatchObject({
      name: 'shortsmaker-api',
      url: 'https://github.com/byt3un1on/shortsmaker-api',
      technology: 'Python',
      isPrivate: false,
      hasCommits: true,
    });
  });

  it('deve reconhecer repositorio vazio quando o recurso de commits responde 409', async () => {
    // Arrange
    await stubOrganizationRepositories([
      repositoryPayload({ name: 'documentation-site', language: null }),
    ]);
    await stubCommits('documentation-site', 409);

    // Act
    const repositorios = await client().listRepositories();

    // Assert
    expect(repositorios[0]?.hasCommits).toBe(false);
  });

  it('deve resolver a elegibilidade de cada repositorio quando a listagem traz varios', async () => {
    // Arrange
    await stubOrganizationRepositories([
      repositoryPayload({ name: 'com-commits' }),
      repositoryPayload({ name: 'sem-commits' }),
    ]);
    await stubCommits('com-commits', 200);
    await stubCommits('sem-commits', 409);

    // Act
    const repositorios = await client().listRepositories();

    // Assert
    expect(repositorios.map((r) => [r.name, r.hasCommits])).toEqual([
      ['com-commits', true],
      ['sem-commits', false],
    ]);
  });

  it('deve converter a data textual da API em Date quando traduz', async () => {
    // Arrange
    await stubOrganizationRepositories([repositoryPayload({ pushed_at: '2025-10-04T22:19:52Z' })]);
    await stubCommits('shortsmaker-api', 200);

    // Act
    const repositorios = await client().listRepositories();

    // Assert
    expect(repositorios[0]?.lastActivityAt.toISOString()).toBe('2025-10-04T22:19:52.000Z');
  });

  it('deve abortar quando a organizacao nao pode ser obtida', async () => {
    // Arrange
    await stubOrganizationUnavailable(503);

    // Act
    const act = async (): Promise<unknown> => client().listRepositories();

    // Assert
    await expect(act).rejects.toThrow(CatalogSourceError);
  });

  it('deve devolver lista vazia quando a organizacao nao tem repositorio publico', async () => {
    // Arrange
    await stubOrganizationRepositories([]);

    // Act
    const repositorios = await client().listRepositories();

    // Assert
    expect(repositorios).toEqual([]);
  });
});
