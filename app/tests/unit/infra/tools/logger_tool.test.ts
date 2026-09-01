import { describe, expect, it, vi } from 'vitest';
import { LoggerTool } from '../../../../infra/tools/logger_tool.ts';

describe('LoggerTool', () => {
  it('deve emitir JSON de uma linha com nivel e mensagem quando registra informacao', () => {
    // Arrange
    const sink = vi.fn();
    const logger = new LoggerTool(sink);

    // Act
    logger.info('catalogo gerado');

    // Assert
    expect(sink).toHaveBeenCalledExactlyOnceWith('{"level":"info","message":"catalogo gerado"}');
  });

  it('deve acrescentar os campos nomeados quando eles sao informados', () => {
    // Arrange
    const sink = vi.fn();
    const logger = new LoggerTool(sink);

    // Act
    logger.info('repositorios fora da curadoria', { repositories: ['a', 'b'] });

    // Assert
    expect(sink).toHaveBeenCalledExactlyOnceWith(
      '{"level":"info","message":"repositorios fora da curadoria","repositories":["a","b"]}',
    );
  });

  it('deve marcar o nivel de erro quando registra falha', () => {
    // Arrange
    const sink = vi.fn();
    const logger = new LoggerTool(sink);

    // Act
    logger.error('publicacao abortada', { reason: 'catalogo indisponivel' });

    // Assert
    expect(sink).toHaveBeenCalledExactlyOnceWith(
      '{"level":"error","message":"publicacao abortada","reason":"catalogo indisponivel"}',
    );
  });

  it('deve emitir sem campos extras quando nenhum e informado', () => {
    // Arrange
    const sink = vi.fn();
    const logger = new LoggerTool(sink);

    // Act
    logger.error('falha');

    // Assert
    expect(sink).toHaveBeenCalledExactlyOnceWith('{"level":"error","message":"falha"}');
  });
});
