import { describe, expect, it } from 'vitest';
import { PipelineFailureError } from '../../../../../core/domain/errors/pipeline_failure_error.ts';

describe('PipelineFailureError', () => {
  it('deve expor a causa permissao quando construido com permissao', () => {
    // Arrange
    const original = 'o token nao pode escrever em gh-pages';

    // Act
    const error = new PipelineFailureError('permissao', original);

    // Assert
    expect(error.cause).toBe('permissao');
  });

  it('deve expor a causa credencial quando construido com credencial', () => {
    // Arrange
    const original = 'GITHUB_TOKEN ausente no ambiente';

    // Act
    const error = new PipelineFailureError('credencial', original);

    // Assert
    expect(error.cause).toBe('credencial');
  });

  it('deve expor a causa conflito quando construido com conflito', () => {
    // Arrange
    const original = 'push rejeitado: a referencia remota avancou';

    // Act
    const error = new PipelineFailureError('conflito', original);

    // Assert
    expect(error.cause).toBe('conflito');
  });

  it('deve expor a causa desconhecida quando construido com desconhecida', () => {
    // Arrange
    const original = 'processo encerrado com codigo 137';

    // Act
    const error = new PipelineFailureError('desconhecida', original);

    // Assert
    expect(error.cause).toBe('desconhecida');
  });

  it('deve compor a mensagem com a causa e o texto original quando construido', () => {
    // Arrange
    const original = 'push rejeitado: a referencia remota avancou';

    // Act
    const error = new PipelineFailureError('conflito', original);

    // Assert
    expect(error.message).toBe(
      'esteira interrompida por conflito: push rejeitado: a referencia remota avancou',
    );
  });

  it('deve expor o texto original quando construido', () => {
    // Arrange
    const original = 'GITHUB_TOKEN ausente no ambiente';

    // Act
    const error = new PipelineFailureError('credencial', original);

    // Assert
    expect(error.original).toBe('GITHUB_TOKEN ausente no ambiente');
  });

  it('deve expor o nome proprio quando construido', () => {
    // Arrange
    const original = 'o token nao pode escrever em gh-pages';

    // Act
    const error = new PipelineFailureError('permissao', original);

    // Assert
    expect(error.name).toBe('PipelineFailureError');
  });

  it('deve continuar sendo um Error quando construido', () => {
    // Arrange
    const original = 'processo encerrado com codigo 137';

    // Act
    const error = new PipelineFailureError('desconhecida', original);

    // Assert
    expect(error).toBeInstanceOf(Error);
  });

  it('deve ser um PipelineFailureError quando construido', () => {
    // Arrange
    const original = 'processo encerrado com codigo 137';

    // Act
    const error = new PipelineFailureError('desconhecida', original);

    // Assert
    expect(error).toBeInstanceOf(PipelineFailureError);
  });

  it('deve remover os espacos das pontas quando o original vem com espacos', () => {
    // Arrange
    const original = '   o token nao pode escrever em gh-pages \n';

    // Act
    const error = new PipelineFailureError('permissao', original);

    // Assert
    expect(error.original).toBe('o token nao pode escrever em gh-pages');
  });

  it('deve compor a mensagem sem os espacos das pontas quando o original vem com espacos', () => {
    // Arrange
    const original = '  push rejeitado  ';

    // Act
    const error = new PipelineFailureError('conflito', original);

    // Assert
    expect(error.message).toBe('esteira interrompida por conflito: push rejeitado');
  });

  it('deve anunciar motivo nao informado quando o original e vazio', () => {
    // Arrange
    const original = '';

    // Act
    const error = new PipelineFailureError('desconhecida', original);

    // Assert
    expect(error.message).toBe('esteira interrompida por desconhecida: motivo nao informado');
  });

  it('deve anunciar motivo nao informado quando o original e so espacos', () => {
    // Arrange
    const original = '   \t  ';

    // Act
    const error = new PipelineFailureError('credencial', original);

    // Assert
    expect(error.message).toBe('esteira interrompida por credencial: motivo nao informado');
  });

  it('deve expor o original vazio quando o texto recebido e so espacos', () => {
    // Arrange
    const original = '   \t  ';

    // Act
    const error = new PipelineFailureError('credencial', original);

    // Assert
    expect(error.original).toBe('');
  });
});
