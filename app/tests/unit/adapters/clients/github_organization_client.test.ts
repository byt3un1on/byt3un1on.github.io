import { afterEach, describe, expect, it, vi } from 'vitest';
import { GithubOrganizationClient } from '../../../../adapters/clients/github_organization_client.ts';
import { CatalogSourceError } from '../../../../core/domain/errors/catalog_source_error.ts';
import type { IConfigTool } from '../../../../interfaces/infra/tools/i_config_tool.ts';

function config(token: string | null = null): IConfigTool {
  return {
    githubApiBaseUrl: vi.fn().mockReturnValue('http://wiremock:8080'),
    organizationLogin: vi.fn().mockReturnValue('byt3un1on'),
    githubToken: vi.fn().mockReturnValue(token),
    curationPath: vi.fn().mockReturnValue('data/curation.json'),
    catalogOutputPath: vi.fn().mockReturnValue('data/catalog.generated.json'),
    prerenderRoutesPath: vi.fn().mockReturnValue('data/prerender-routes.txt'),
    siteRepositoryFullName: vi.fn().mockReturnValue('byt3un1on/byt3un1on.github.io'),
  };
}

function repositorioCru(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    name: 'shortsmaker-api',
    description: null,
    html_url: 'https://github.com/byt3un1on/shortsmaker-api',
    homepage: null,
    language: 'Python',
    private: false,
    archived: false,
    pushed_at: '2026-01-14T05:31:18Z',
    ...overrides,
  };
}

function resposta(body: unknown, init: { status?: number; ok?: boolean } = {}): Response {
  const status = init.status ?? 200;
  return {
    ok: init.ok ?? status < 400,
    status,
    json: (): Promise<unknown> => Promise.resolve(body),
  } as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('GithubOrganizationClient', () => {
  it('deve traduzir a listagem em entidades quando a organizacao responde', async () => {
    // Arrange
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(resposta([repositorioCru()]))
      .mockResolvedValueOnce(resposta([{ sha: 'abc' }]));
    vi.stubGlobal('fetch', fetchMock);

    // Act
    const repositorios = await new GithubOrganizationClient(config()).listRepositories();

    // Assert
    expect(repositorios.map((r) => r.name)).toEqual(['shortsmaker-api']);
  });

  it('deve marcar o repositorio como tendo commit quando o recurso responde 200', async () => {
    // Arrange
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(resposta([repositorioCru()]))
      .mockResolvedValueOnce(resposta([{ sha: 'abc' }]));
    vi.stubGlobal('fetch', fetchMock);

    // Act
    const repositorios = await new GithubOrganizationClient(config()).listRepositories();

    // Assert
    expect(repositorios[0]?.hasCommits).toBe(true);
  });

  it('deve marcar o repositorio como vazio quando o recurso de commits responde 409', async () => {
    // Arrange
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(resposta([repositorioCru({ name: 'documentation-site' })]))
      .mockResolvedValueOnce(resposta({ message: 'Git Repository is empty.' }, { status: 409 }));
    vi.stubGlobal('fetch', fetchMock);

    // Act
    const repositorios = await new GithubOrganizationClient(config()).listRepositories();

    // Assert
    expect(repositorios[0]?.hasCommits).toBe(false);
  });

  it('deve pedir a listagem publica da organizacao quando executa', async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(resposta([]));
    vi.stubGlobal('fetch', fetchMock);

    // Act
    await new GithubOrganizationClient(config()).listRepositories();

    // Assert
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      'http://wiremock:8080/orgs/byt3un1on/repos?per_page=100&type=public',
      { headers: { Accept: 'application/vnd.github+json' } },
    );
  });

  it('deve enviar a credencial de build quando o ambiente a fornece', async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(resposta([]));
    vi.stubGlobal('fetch', fetchMock);

    // Act
    await new GithubOrganizationClient(config('ghs_exemplo')).listRepositories();

    // Assert
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), {
      headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ghs_exemplo' },
    });
  });

  it('deve devolver lista vazia quando a organizacao nao tem repositorio publico', async () => {
    // Arrange
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta([])));

    // Act
    const repositorios = await new GithubOrganizationClient(config()).listRepositories();

    // Assert
    expect(repositorios).toEqual([]);
  });

  it('deve recusar quando a listagem responde erro', async () => {
    // Arrange
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta(null, { status: 503 })));

    // Act
    const act = async (): Promise<unknown> =>
      new GithubOrganizationClient(config()).listRepositories();

    // Assert
    await expect(act).rejects.toThrow(CatalogSourceError);
  });

  it('deve informar o recurso e o status quando a listagem falha', async () => {
    // Arrange
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta(null, { status: 503 })));

    // Act
    const act = async (): Promise<unknown> =>
      new GithubOrganizationClient(config()).listRepositories();

    // Assert
    await expect(act).rejects.toThrow('resposta 503');
  });

  it('deve recusar quando a listagem nao devolve um array', async () => {
    // Arrange
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta({ message: 'Not Found' })));

    // Act
    const act = async (): Promise<unknown> =>
      new GithubOrganizationClient(config()).listRepositories();

    // Assert
    await expect(act).rejects.toThrow('esperado array, recebido object');
  });

  it('deve recusar quando a verificacao de commits falha por outro motivo', async () => {
    // Arrange
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(resposta([repositorioCru()]))
      .mockResolvedValueOnce(resposta(null, { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);

    // Act
    const act = async (): Promise<unknown> =>
      new GithubOrganizationClient(config()).listRepositories();

    // Assert
    await expect(act).rejects.toThrow('resposta 500');
  });
});
