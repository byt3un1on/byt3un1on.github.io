import { describe, expect, it } from 'vitest';
import { isPipelineFailureCause } from '../../../../../core/domain/enums/pipeline_failure_cause_enum.ts';

describe('isPipelineFailureCause', () => {
  it('deve reconhecer a causa quando o valor e permissao', () => {
    // Arrange
    const valor: unknown = 'permissao';

    // Act
    const reconhecida = isPipelineFailureCause(valor);

    // Assert
    expect(reconhecida).toBe(true);
  });

  it('deve reconhecer a causa quando o valor e credencial', () => {
    // Arrange
    const valor: unknown = 'credencial';

    // Act
    const reconhecida = isPipelineFailureCause(valor);

    // Assert
    expect(reconhecida).toBe(true);
  });

  it('deve reconhecer a causa quando o valor e conflito', () => {
    // Arrange
    const valor: unknown = 'conflito';

    // Act
    const reconhecida = isPipelineFailureCause(valor);

    // Assert
    expect(reconhecida).toBe(true);
  });

  it('deve reconhecer a causa quando o valor e desconhecida', () => {
    // Arrange
    const valor: unknown = 'desconhecida';

    // Act
    const reconhecida = isPipelineFailureCause(valor);

    // Assert
    expect(reconhecida).toBe(true);
  });

  it('deve recusar quando o valor e um texto fora das causas declaradas', () => {
    // Arrange
    const valor: unknown = 'timeout';

    // Act
    const reconhecida = isPipelineFailureCause(valor);

    // Assert
    expect(reconhecida).toBe(false);
  });

  it('deve recusar quando o valor e um texto vazio', () => {
    // Arrange
    const valor: unknown = '';

    // Act
    const reconhecida = isPipelineFailureCause(valor);

    // Assert
    expect(reconhecida).toBe(false);
  });

  it('deve recusar quando o valor e nulo', () => {
    // Arrange
    const valor: unknown = null;

    // Act
    const reconhecida = isPipelineFailureCause(valor);

    // Assert
    expect(reconhecida).toBe(false);
  });

  it('deve recusar quando o valor e indefinido', () => {
    // Arrange
    const valor: unknown = undefined;

    // Act
    const reconhecida = isPipelineFailureCause(valor);

    // Assert
    expect(reconhecida).toBe(false);
  });

  it('deve recusar quando o valor e um numero', () => {
    // Arrange
    const valor: unknown = 3;

    // Act
    const reconhecida = isPipelineFailureCause(valor);

    // Assert
    expect(reconhecida).toBe(false);
  });

  it('deve recusar quando o valor e um objeto', () => {
    // Arrange
    const valor: unknown = { causa: 'conflito' };

    // Act
    const reconhecida = isPipelineFailureCause(valor);

    // Assert
    expect(reconhecida).toBe(false);
  });
});
