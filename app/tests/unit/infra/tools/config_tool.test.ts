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
  it('deve devolver o modo da esteira quando o ambiente o declara', () => {
    // Arrange
    const config = new ConfigTool({ ESTEIRA_MODO: 'manual' });

    // Act
    const modo = config.pipelineMode();

    // Assert
    expect(modo).toBe('manual');
  });

  it('deve devolver nulo para o modo quando o ambiente nao o declara', () => {
    // Arrange
    const config = new ConfigTool({});

    // Act
    const modo = config.pipelineMode();

    // Assert
    expect(modo).toBeNull();
  });

  it('deve devolver nulo para o modo quando o ambiente o declara em branco', () => {
    // Arrange
    const config = new ConfigTool({ ESTEIRA_MODO: '   ' });

    // Act
    const modo = config.pipelineMode();

    // Assert
    expect(modo).toBeNull();
  });

  it('deve devolver as marcacoes da Pull Request quando o ambiente as declara', () => {
    // Arrange
    const config = new ConfigTool({ ESTEIRA_MODO_ROTULO: 'manual,urgente' });

    // Act
    const rotulos = config.pipelineModeLabel();

    // Assert
    expect(rotulos).toBe('manual,urgente');
  });

  it('deve devolver nulo para as marcacoes quando o ambiente nao as declara', () => {
    // Arrange
    const config = new ConfigTool({});

    // Act
    const rotulos = config.pipelineModeLabel();

    // Assert
    expect(rotulos).toBeNull();
  });

  it('deve devolver o arquivo de resumo quando o ambiente o declara', () => {
    // Arrange
    const config = new ConfigTool({ ESTEIRA_RESUMO: '/tmp/resumo.md' });

    // Act
    const caminho = config.runSummaryPath();

    // Assert
    expect(caminho).toBe('/tmp/resumo.md');
  });

  it('deve devolver nulo para o arquivo de resumo quando o ambiente nao o declara', () => {
    // Arrange
    const config = new ConfigTool({});

    // Act
    const caminho = config.runSummaryPath();

    // Assert
    expect(caminho).toBeNull();
  });
  it('deve devolver os resultados dos jobs quando o ambiente os declara', () => {
    // Arrange
    const config = new ConfigTool({ ESTEIRA_RESULTADOS: '[{"name":"Portão","status":"success"}]' });

    // Act
    const resultados = config.pipelineResults();

    // Assert
    expect(resultados).toBe('[{"name":"Portão","status":"success"}]');
  });

  it('deve devolver nulo para os resultados quando o ambiente nao os declara', () => {
    // Arrange
    const config = new ConfigTool({});

    // Act
    const resultados = config.pipelineResults();

    // Assert
    expect(resultados).toBeNull();
  });

  it('deve devolver o nome do job do resumo quando o ambiente o declara', () => {
    // Arrange
    const config = new ConfigTool({ ESTEIRA_JOB: 'Análise estática' });

    // Act
    const job = config.summaryJob();

    // Assert
    expect(job).toBe('Análise estática');
  });

  it('deve devolver nulo para o nome do job quando o ambiente nao o declara', () => {
    // Arrange
    const config = new ConfigTool({});

    // Act
    const job = config.summaryJob();

    // Assert
    expect(job).toBeNull();
  });

  it('deve devolver a situacao do job quando o ambiente a declara', () => {
    // Arrange
    const config = new ConfigTool({ ESTEIRA_STATUS: 'failure' });

    // Act
    const situacao = config.summaryStatus();

    // Assert
    expect(situacao).toBe('failure');
  });

  it('deve devolver nulo para a situacao quando o ambiente nao a declara', () => {
    // Arrange
    const config = new ConfigTool({});

    // Act
    const situacao = config.summaryStatus();

    // Assert
    expect(situacao).toBeNull();
  });

  it('deve devolver o detalhe do job quando o ambiente o declara', () => {
    // Arrange
    const config = new ConfigTool({ ESTEIRA_DETALHE: 'cobertura em 84%' });

    // Act
    const detalhe = config.summaryDetail();

    // Assert
    expect(detalhe).toBe('cobertura em 84%');
  });

  it('deve devolver nulo para o detalhe quando o ambiente o declara em branco', () => {
    // Arrange
    const config = new ConfigTool({ ESTEIRA_DETALHE: '' });

    // Act
    const detalhe = config.summaryDetail();

    // Assert
    expect(detalhe).toBeNull();
  });
});
