import { describe, expect, it } from 'vitest';
import { CurationValidationError } from '../../../../../core/domain/errors/curation_validation_error.ts';

describe('CurationValidationError', () => {
  it('deve compor a mensagem com o motivo e as entradas quando ha entradas afetadas', () => {
    // Arrange
    const reason = 'entrada sem resumo escrito';
    const entries = ['shortsmaker', 'templates-library'];

    // Act
    const error = new CurationValidationError(reason, entries);

    // Assert
    expect(error.message).toBe(
      'curadoria invalida: entrada sem resumo escrito; entradas afetadas: shortsmaker, templates-library',
    );
  });

  it('deve indicar ausencia de entradas quando a lista e vazia', () => {
    // Arrange
    const entries: readonly string[] = [];

    // Act
    const error = new CurationValidationError('arquivo vazio', entries);

    // Assert
    expect(error.message).toBe('curadoria invalida: arquivo vazio; entradas afetadas: (nenhuma)');
  });

  it('deve expor o nome proprio quando o erro e construido', () => {
    // Arrange
    const entries = ['niche-scout'];

    // Act
    const error = new CurationValidationError('referencia quebrada', entries);

    // Assert
    expect(error.name).toBe('CurationValidationError');
  });

  it('deve continuar sendo um Error quando construido', () => {
    // Arrange
    const entries = ['niche-scout'];

    // Act
    const error = new CurationValidationError('referencia quebrada', entries);

    // Assert
    expect(error).toBeInstanceOf(Error);
  });

  it('deve congelar as entradas quando o erro e construido', () => {
    // Arrange
    const entries = ['shortsmaker'];

    // Act
    const error = new CurationValidationError('duplicidade', entries);

    // Assert
    expect(Object.isFrozen(error.entries)).toBe(true);
  });

  it('deve preservar as entradas originais quando a lista de origem e alterada depois', () => {
    // Arrange
    const entries = ['shortsmaker'];
    const error = new CurationValidationError('duplicidade', entries);

    // Act
    entries.push('templates-library');

    // Assert
    expect(error.entries).toEqual(['shortsmaker']);
  });
});
