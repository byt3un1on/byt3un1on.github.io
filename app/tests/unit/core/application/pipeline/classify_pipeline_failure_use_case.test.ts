import { describe, expect, it } from 'vitest';
import { ClassifyPipelineFailureUseCase } from '../../../../../core/application/pipeline/classify_pipeline_failure_use_case.ts';

function construir(): ClassifyPipelineFailureUseCase {
  return new ClassifyPipelineFailureUseCase();
}

describe('ClassifyPipelineFailureUseCase', () => {
  it('deve devolver conflito quando a saida traz o conflito de conteudo do merge', () => {
    // Arrange
    const saida = 'CONFLICT (content): Merge conflict in app/styles.css';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('conflito');
  });

  it('deve devolver conflito quando a saida diz que a Pull Request nao e integravel', () => {
    // Arrange
    const saida = 'GraphQL: Pull Request is not mergeable (enablePullRequestAutoMerge)';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('conflito');
  });

  it('deve devolver credencial quando a saida traz a recusa de credencial da API', () => {
    // Arrange
    const saida = 'gh: Bad credentials (HTTP 401)';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('credencial');
  });

  it('deve devolver credencial quando a saida acusa o segredo da esteira ausente', () => {
    // Arrange
    const saida = 'Error: o segredo ESTEIRA_TOKEN nao foi definido no repositorio';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('credencial');
  });

  it('deve devolver credencial quando a saida acusa a variavel de credencial ausente', () => {
    // Arrange
    const saida = 'gh: To use GitHub CLI in a GitHub Actions workflow, set the GH_TOKEN env var.';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('credencial');
  });

  it('deve devolver credencial quando a saida nomeia a credencial em portugues', () => {
    // Arrange
    const saida = 'A publicacao foi abortada: credencial de build indisponivel.';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('credencial');
  });

  it('deve devolver credencial quando a saida traz a falha de autenticacao do git', () => {
    // Arrange
    const saida = 'fatal: Authentication failed for https://github.com/byt3un1on/site.git/';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('credencial');
  });

  it('deve devolver permissao quando a saida traz a recusa de escrita no repositorio', () => {
    // Arrange
    const saida = 'remote: Permission to byt3un1on/byt3un1on.github.io.git denied to user.';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('permissao');
  });

  it('deve devolver permissao quando a saida traz o codigo de recurso inacessivel', () => {
    // Arrange
    const saida = 'HTTP 403: Resource not accessible by integration';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('permissao');
  });

  it('deve devolver permissao quando a saida acusa recusa de autorizacao', () => {
    // Arrange
    const saida = 'GraphQL: user is not authorized to approve this pull request';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('permissao');
  });

  it('deve devolver permissao quando a saida acusa a protecao da branch', () => {
    // Arrange
    const saida = 'remote: error: GH006: Protected branch update failed for refs/heads/main.';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('permissao');
  });

  it('deve devolver conflito quando a saida traz pistas de conflito e de permissao', () => {
    // Arrange
    const saida = 'remote: Permission denied\nCONFLICT (content): Merge conflict in app/styles.css';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('conflito');
  });

  it('deve devolver credencial quando a saida traz pistas de credencial e de permissao', () => {
    // Arrange
    const saida = 'HTTP 403: Bad credentials, permission denied';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('credencial');
  });

  it('deve devolver desconhecida quando a saida e texto vazio', () => {
    // Arrange
    const saida = '';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('desconhecida');
  });

  it('deve devolver desconhecida quando a saida nao traz pista alguma', () => {
    // Arrange
    const saida = 'npm ERR! code ELIFECYCLE\nnpm ERR! errno 1';

    // Act
    const causa = construir().execute(saida);

    // Assert
    expect(causa).toBe('desconhecida');
  });
});
