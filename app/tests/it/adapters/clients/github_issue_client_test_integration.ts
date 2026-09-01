import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GithubIssueClient } from '../../../../adapters/clients/github_issue_client.ts';
import { ConfigTool } from '../../../../infra/tools/config_tool.ts';
import {
  stubIssueClosure,
  stubOpenIssueCreation,
  stubOpenIssues,
} from '../../stubs/issue_stubs.ts';
import { resetStubs } from '../../stubs/wiremock.ts';

const TITULO = 'Publicacao da vitrine abortada';

function client(): GithubIssueClient {
  return new GithubIssueClient(
    new ConfigTool({
      GITHUB_API_BASE_URL: process.env['WIREMOCK_BASE_URL'] ?? 'http://wiremock:8080',
      SITE_REPOSITORY: 'byt3un1on/byt3un1on.github.io',
      GITHUB_TOKEN: 'ghs_teste',
    }),
  );
}

describe('GithubIssueClient contra a API simulada', () => {
  beforeEach(async () => {
    await resetStubs();
  });

  afterEach(async () => {
    await resetStubs();
  });

  it('deve encontrar a questao aberta quando ela existe no repositorio', async () => {
    // Arrange
    await stubOpenIssues([{ number: 7, title: TITULO }]);

    // Act
    const encontrada = await client().findOpenIssueByTitle(TITULO);

    // Assert
    expect(encontrada).toEqual({ number: 7, title: TITULO });
  });

  it('deve devolver nulo quando nenhuma questao aberta tem o titulo', async () => {
    // Arrange
    await stubOpenIssues([{ number: 3, title: 'outro assunto' }]);

    // Act
    const encontrada = await client().findOpenIssueByTitle(TITULO);

    // Assert
    expect(encontrada).toBeNull();
  });

  it('deve abrir a questao quando a publicacao aborta', async () => {
    // Arrange
    await stubOpenIssueCreation(12);

    // Act
    const aberta = await client().openIssue(TITULO, 'catalogo indisponivel');

    // Assert
    expect(aberta).toEqual({ number: 12, title: TITULO });
  });

  it('deve encerrar a questao quando a publicacao conclui', async () => {
    // Arrange
    await stubIssueClosure(7);

    // Act
    const act = async (): Promise<void> => client().closeIssue(7);

    // Assert
    await expect(act()).resolves.toBeUndefined();
  });

  it('deve abortar quando a API de questoes recusa a escrita', async () => {
    // Arrange — sem stub de POST, o WireMock responde 404

    // Act
    const act = async (): Promise<unknown> => client().openIssue(TITULO, 'motivo');

    // Assert
    await expect(act).rejects.toThrow('resposta 404');
  });
});
