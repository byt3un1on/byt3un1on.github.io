import { describe, expect, it } from 'vitest';
import {
  highestVersionBump,
  isVersionBump,
} from '../../../../../core/domain/enums/version_bump_enum.ts';

describe('isVersionBump', () => {
  it('deve reconhecer o incremento quando o valor e patch', () => {
    // Arrange
    const valor: unknown = 'patch';

    // Act
    const reconhecido = isVersionBump(valor);

    // Assert
    expect(reconhecido).toBe(true);
  });

  it('deve reconhecer o incremento quando o valor e minor', () => {
    // Arrange
    const valor: unknown = 'minor';

    // Act
    const reconhecido = isVersionBump(valor);

    // Assert
    expect(reconhecido).toBe(true);
  });

  it('deve reconhecer o incremento quando o valor e major', () => {
    // Arrange
    const valor: unknown = 'major';

    // Act
    const reconhecido = isVersionBump(valor);

    // Assert
    expect(reconhecido).toBe(true);
  });

  it('deve recusar quando o valor e um texto fora dos incrementos declarados', () => {
    // Arrange
    const valor: unknown = 'breaking';

    // Act
    const reconhecido = isVersionBump(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor e um texto vazio', () => {
    // Arrange
    const valor: unknown = '';

    // Act
    const reconhecido = isVersionBump(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor e nulo', () => {
    // Arrange
    const valor: unknown = null;

    // Act
    const reconhecido = isVersionBump(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor e indefinido', () => {
    // Arrange
    const valor: unknown = undefined;

    // Act
    const reconhecido = isVersionBump(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor e um numero', () => {
    // Arrange
    const valor: unknown = 1;

    // Act
    const reconhecido = isVersionBump(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor e um objeto', () => {
    // Arrange
    const valor: unknown = { bump: 'major' };

    // Act
    const reconhecido = isVersionBump(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });
});

describe('highestVersionBump', () => {
  it('deve devolver major quando ele vem a esquerda de patch', () => {
    // Arrange
    const esquerda = 'major' as const;
    const direita = 'patch' as const;

    // Act
    const maior = highestVersionBump(esquerda, direita);

    // Assert
    expect(maior).toBe('major');
  });

  it('deve devolver major quando ele vem a direita de patch', () => {
    // Arrange
    const esquerda = 'patch' as const;
    const direita = 'major' as const;

    // Act
    const maior = highestVersionBump(esquerda, direita);

    // Assert
    expect(maior).toBe('major');
  });

  it('deve devolver major quando ele vem a direita de minor', () => {
    // Arrange
    const esquerda = 'minor' as const;
    const direita = 'major' as const;

    // Act
    const maior = highestVersionBump(esquerda, direita);

    // Assert
    expect(maior).toBe('major');
  });

  it('deve devolver minor quando ele vem a esquerda de patch', () => {
    // Arrange
    const esquerda = 'minor' as const;
    const direita = 'patch' as const;

    // Act
    const maior = highestVersionBump(esquerda, direita);

    // Assert
    expect(maior).toBe('minor');
  });

  it('deve devolver minor quando ele vem a direita de patch', () => {
    // Arrange
    const esquerda = 'patch' as const;
    const direita = 'minor' as const;

    // Act
    const maior = highestVersionBump(esquerda, direita);

    // Assert
    expect(maior).toBe('minor');
  });

  it('deve devolver o mesmo incremento quando os dois lados sao iguais', () => {
    // Arrange
    const esquerda = 'minor' as const;
    const direita = 'minor' as const;

    // Act
    const maior = highestVersionBump(esquerda, direita);

    // Assert
    expect(maior).toBe('minor');
  });

  it('deve devolver patch quando os dois lados sao o menor incremento', () => {
    // Arrange
    const esquerda = 'patch' as const;
    const direita = 'patch' as const;

    // Act
    const maior = highestVersionBump(esquerda, direita);

    // Assert
    expect(maior).toBe('patch');
  });
});
