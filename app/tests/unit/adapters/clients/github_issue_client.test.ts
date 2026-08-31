import { afterEach, describe, expect, it, vi } from 'vitest';
import { GithubIssueClient } from '../../../../adapters/clients/github_issue_client.ts';
import { CatalogSourceError } from '../../../../core/domain/errors/catalog_source_error.ts';
import type { IConfigTool } from '../../../../interfaces/infra/tools/i_config_tool.ts';

const TITULO = 'Publicacao da vitrine abortada';

function config(): IConfigTool {
  return {
    githubApiBaseUrl: vi.fn().mockReturnValue('http://wiremock:8080'),
    organizationLogin: vi.fn().mockReturnValue('byt3un1on'),
    githubToken: vi.fn().mockReturnValue('ghs_exemplo'),
    curationPath: vi.fn().mockReturnValue('data/curation.json'),
    catalogOutputPath: vi.fn().mockReturnValue('data/catalog.generated.json'),
    prerenderRoutesPath: vi.fn().mockReturnValue('data/prerender-routes.txt'),
    siteRepositoryFullName: vi.fn().mockReturnValue('byt3un1on/byt3un1on.github.io'),
  };
}

function resposta(body: unknown, status = 200): Response {
  return {
    ok: status < 400,
    status,
    json: (): Promise<unknown> => Promise.resolve(body),
  } as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('GithubIssueClient', () => {
  it('deve encontrar a questao aberta quando o titulo confere', async () => {
    // Arrange
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta([{ number: 7, title: TITULO }])));

    // Act
    const encontrada = await new GithubIssueClient(config()).findOpenIssueByTitle(TITULO);

    // Assert
    expect(encontrada).toEqual({ number: 7, title: TITULO });
  });

  it('deve devolver nulo quando nenhuma questao aberta tem o titulo', async () => {
    // Arrange
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta([{ number: 3, title: 'outra' }])));

    // Act
    const encontrada = await new GithubIssueClient(config()).findOpenIssueByTitle(TITULO);

    // Assert
    expect(encontrada).toBeNull();
  });

  it('deve devolver nulo quando nao ha questao aberta alguma', async () => {
    // Arrange
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta([])));

    // Act
    const encontrada = await new GithubIssueClient(config()).findOpenIssueByTitle(TITULO);

    // Assert
    expect(encontrada).toBeNull();
  });

  it('deve ignorar item sem titulo textual quando a listagem o traz', async () => {
    // Arrange
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta([{ number: 9, title: 42 }])));

    // Act
    const encontrada = await new GithubIssueClient(config()).findOpenIssueByTitle(TITULO);

    // Assert
    expect(encontrada).toBeNull();
  });

  it('deve pedir apenas as questoes abertas quando procura', async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(resposta([]));
    vi.stubGlobal('fetch', fetchMock);

    // Act
    await new GithubIssueClient(config()).findOpenIssueByTitle(TITULO);

    // Assert
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      'http://wiremock:8080/repos/byt3un1on/byt3un1on.github.io/issues?state=open&per_page=100',
      {
        method: 'GET',
        headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ghs_exemplo' },
      },
    );
  });

  it('deve recusar quando a listagem de questoes nao e array', async () => {
    // Arrange
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta({ message: 'Not Found' })));

    // Act
    const act = async (): Promise<unknown> =>
      new GithubIssueClient(config()).findOpenIssueByTitle(TITULO);

    // Assert
    await expect(act).rejects.toThrow('esperado array, recebido object');
  });

  it('deve abrir a questao com titulo e corpo quando solicitada', async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(resposta({ number: 12 }));
    vi.stubGlobal('fetch', fetchMock);

    // Act
    const aberta = await new GithubIssueClient(config()).openIssue(TITULO, 'motivo');

    // Assert
    expect(aberta).toEqual({ number: 12, title: TITULO });
  });

  it('deve enviar o corpo em JSON quando abre a questao', async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(resposta({ number: 12 }));
    vi.stubGlobal('fetch', fetchMock);

    // Act
    await new GithubIssueClient(config()).openIssue(TITULO, 'motivo');

    // Assert
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: 'Bearer ghs_exemplo',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: TITULO, body: 'motivo' }),
    });
  });

  it('deve recusar quando a questao aberta volta sem numero', async () => {
    // Arrange
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta({})));

    // Act
    const act = async (): Promise<unknown> =>
      new GithubIssueClient(config()).openIssue(TITULO, 'motivo');

    // Assert
    await expect(act).rejects.toThrow('questao sem numero na resposta');
  });

  it('deve encerrar a questao pelo numero quando solicitada', async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(resposta({ number: 7 }));
    vi.stubGlobal('fetch', fetchMock);

    // Act
    await new GithubIssueClient(config()).closeIssue(7);

    // Assert
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      'http://wiremock:8080/repos/byt3un1on/byt3un1on.github.io/issues/7',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ state: 'closed' }) }),
    );
  });

  it('deve recusar quando a API responde erro', async () => {
    // Arrange
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta(null, 403)));

    // Act
    const act = async (): Promise<unknown> => new GithubIssueClient(config()).closeIssue(7);

    // Assert
    await expect(act).rejects.toThrow(CatalogSourceError);
  });
});
