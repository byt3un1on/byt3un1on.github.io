import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PIPELINE_MODE,
  isPipelineMode,
} from '../../../../../core/domain/enums/pipeline_mode_enum.ts';

describe('isPipelineMode', () => {
  it('deve reconhecer o modo quando o valor e automatico', () => {
    // Arrange
    const valor: unknown = 'automatico';

    // Act
    const reconhecido = isPipelineMode(valor);

    // Assert
    expect(reconhecido).toBe(true);
  });

  it('deve reconhecer o modo quando o valor e manual', () => {
    // Arrange
    const valor: unknown = 'manual';

    // Act
    const reconhecido = isPipelineMode(valor);

    // Assert
    expect(reconhecido).toBe(true);
  });

  it('deve recusar quando o valor e um texto fora dos modos declarados', () => {
    // Arrange
    const valor: unknown = 'semiautomatico';

    // Act
    const reconhecido = isPipelineMode(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor e um texto vazio', () => {
    // Arrange
    const valor: unknown = '';

    // Act
    const reconhecido = isPipelineMode(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor difere apenas na caixa das letras', () => {
    // Arrange
    const valor: unknown = 'Automatico';

    // Act
    const reconhecido = isPipelineMode(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor e nulo', () => {
    // Arrange
    const valor: unknown = null;

    // Act
    const reconhecido = isPipelineMode(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor e indefinido', () => {
    // Arrange
    const valor: unknown = undefined;

    // Act
    const reconhecido = isPipelineMode(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor e um numero', () => {
    // Arrange
    const valor: unknown = 0;

    // Act
    const reconhecido = isPipelineMode(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor e um objeto', () => {
    // Arrange
    const valor: unknown = { modo: 'manual' };

    // Act
    const reconhecido = isPipelineMode(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });
});

describe('DEFAULT_PIPELINE_MODE', () => {
  it('deve ser aceito pelo verificador quando nenhum modo e informado', () => {
    // Arrange
    const padrao: unknown = DEFAULT_PIPELINE_MODE;

    // Act
    const reconhecido = isPipelineMode(padrao);

    // Assert
    expect(reconhecido).toBe(true);
  });

  it('deve dispensar a espera por gente quando o modo cai no padrao', () => {
    // Arrange
    const padrao = DEFAULT_PIPELINE_MODE;

    // Act
    const exigeAprovacaoManual = padrao === 'manual';

    // Assert
    expect(exigeAprovacaoManual).toBe(false);
  });
});
