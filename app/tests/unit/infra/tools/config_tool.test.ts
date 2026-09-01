import { describe, expect, it } from 'vitest';
import { ConfigTool } from '../../../../infra/tools/config_tool.ts';

describe('ConfigTool', () => {
  it('deve usar a API publica do GitHub quando o ambiente nao a redefine', () => {
    // Arrange
    const config = new ConfigTool({});

    // Act
    const base = config.githubApiBaseUrl();

    // Assert
    expect(base).toBe('https://api.github.com');
  });

  it('deve apontar para o endereco informado quando o ambiente o redefine', () => {
    // Arrange
    const config = new ConfigTool({ GITHUB_API_BASE_URL: 'http://wiremock:8080' });

    // Act
    const base = config.githubApiBaseUrl();

    // Assert
    expect(base).toBe('http://wiremock:8080');
  });

  it('deve ignorar valor em branco e cair no padrao quando o ambiente o traz vazio', () => {
    // Arrange
    const config = new ConfigTool({ GITHUB_API_BASE_URL: '   ' });

    // Act
    const base = config.githubApiBaseUrl();

    // Assert
    expect(base).toBe('https://api.github.com');
  });

  it('deve devolver a organizacao padrao quando o ambiente nao a redefine', () => {
    // Arrange
    const config = new ConfigTool({});

    // Act
    const login = config.organizationLogin();

    // Assert
    expect(login).toBe('byt3un1on');
  });

  it('deve devolver nulo para o token quando o ambiente nao o fornece', () => {
    // Arrange
    const config = new ConfigTool({});

    // Act
    const token = config.githubToken();

    // Assert
    expect(token).toBeNull();
  });

  it('deve devolver nulo para o token quando o ambiente o traz em branco', () => {
    // Arrange
    const config = new ConfigTool({ GITHUB_TOKEN: '  ' });

    // Act
    const token = config.githubToken();

    // Assert
    expect(token).toBeNull();
  });

  it('deve devolver o token quando o ambiente o fornece', () => {
    // Arrange
    const config = new ConfigTool({ GITHUB_TOKEN: 'ghs_exemplo' });

    // Act
    const token = config.githubToken();

    // Assert
    expect(token).toBe('ghs_exemplo');
  });

  it('deve apontar para a curadoria versionada quando o ambiente nao a redefine', () => {
    // Arrange
    const config = new ConfigTool({});

    // Act
    const caminho = config.curationPath();

    // Assert
    expect(caminho).toBe('data/curation.json');
  });

  it('deve apontar para curadoria isolada quando o ambiente a redefine', () => {
    // Arrange
    const config = new ConfigTool({ CURATION_PATH: 'tests/bdd/fixtures/curation/sem_resumo.json' });

    // Act
    const caminho = config.curationPath();

    // Assert
    expect(caminho).toBe('tests/bdd/fixtures/curation/sem_resumo.json');
  });

  it('deve apontar para o catalogo gerado quando o ambiente nao o redefine', () => {
    // Arrange
    const config = new ConfigTool({});

    // Act
    const caminho = config.catalogOutputPath();

    // Assert
    expect(caminho).toBe('data/catalog.generated.json');
  });

  it('deve apontar para a lista de rotas quando o ambiente nao a redefine', () => {
    // Arrange
    const config = new ConfigTool({});

    // Act
    const caminho = config.prerenderRoutesPath();

    // Assert
    expect(caminho).toBe('data/prerender-routes.txt');
  });

  it('deve apontar para o repositorio do sitio quando o ambiente nao o redefine', () => {
    // Arrange
    const config = new ConfigTool({});

    // Act
    const repositorio = config.siteRepositoryFullName();

    // Assert
    expect(repositorio).toBe('byt3un1on/byt3un1on.github.io');
  });
});
