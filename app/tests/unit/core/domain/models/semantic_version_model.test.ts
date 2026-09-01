import { describe, expect, it } from 'vitest';
import {
  FIRST_SEMANTIC_VERSION,
  bumpSemanticVersion,
  formatSemanticVersion,
  parseSemanticVersion,
  type SemanticVersion,
} from '../../../../../core/domain/models/semantic_version_model.ts';

function version(overrides: Partial<SemanticVersion> = {}): SemanticVersion {
  return { major: 1, minor: 2, patch: 3, ...overrides };
}

describe('FIRST_SEMANTIC_VERSION', () => {
  it('deve valer 1.0.0 quando nenhuma etiqueta existe no repositorio', () => {
    // Arrange
    const esperada: SemanticVersion = { major: 1, minor: 0, patch: 0 };

    // Act
    const primeira = FIRST_SEMANTIC_VERSION;

    // Assert
    expect(primeira).toEqual(esperada);
  });

  it('deve estar congelada quando o modulo e carregado', () => {
    // Arrange
    const primeira = FIRST_SEMANTIC_VERSION;

    // Act
    const congelada = Object.isFrozen(primeira);

    // Assert
    expect(congelada).toBe(true);
  });
});

describe('parseSemanticVersion', () => {
  it('deve separar major, minor e patch quando a versao vem com o prefixo v', () => {
    // Arrange
    const texto = 'v1.2.3';

    // Act
    const versao = parseSemanticVersion(texto);

    // Assert
    expect(versao).toEqual({ major: 1, minor: 2, patch: 3 });
  });

  it('deve separar major, minor e patch quando a versao vem sem o prefixo v', () => {
    // Arrange
    const texto = '10.20.30';

    // Act
    const versao = parseSemanticVersion(texto);

    // Assert
    expect(versao).toEqual({ major: 10, minor: 20, patch: 30 });
  });

  it('deve aceitar zeros quando cada parte da versao e zero', () => {
    // Arrange
    const texto = 'v0.0.0';

    // Act
    const versao = parseSemanticVersion(texto);

    // Assert
    expect(versao).toEqual({ major: 0, minor: 0, patch: 0 });
  });

  it('deve congelar a versao quando ela e interpretada', () => {
    // Arrange
    const texto = 'v1.2.3';

    // Act
    const versao = parseSemanticVersion(texto);

    // Assert
    expect(Object.isFrozen(versao)).toBe(true);
  });

  it('deve recusar a interpretacao quando o texto e vazio', () => {
    // Arrange
    const texto = '';

    // Act
    const act = (): unknown => parseSemanticVersion(texto);

    // Assert
    expect(act).toThrow('versao invalida: recebido "", esperado vX.Y.Z com inteiros nao negativos');
  });

  it('deve recusar a interpretacao quando falta a parte de correcao', () => {
    // Arrange
    const texto = 'v1.2';

    // Act
    const act = (): unknown => parseSemanticVersion(texto);

    // Assert
    expect(act).toThrow(
      'versao invalida: recebido "v1.2", esperado vX.Y.Z com inteiros nao negativos',
    );
  });

  it('deve recusar a interpretacao quando ha uma quarta parte', () => {
    // Arrange
    const texto = 'v1.2.3.4';

    // Act
    const act = (): unknown => parseSemanticVersion(texto);

    // Assert
    expect(act).toThrow(
      'versao invalida: recebido "v1.2.3.4", esperado vX.Y.Z com inteiros nao negativos',
    );
  });

  it('deve recusar a interpretacao quando as partes nao sao numeros', () => {
    // Arrange
    const texto = 'va.b.c';

    // Act
    const act = (): unknown => parseSemanticVersion(texto);

    // Assert
    expect(act).toThrow(
      'versao invalida: recebido "va.b.c", esperado vX.Y.Z com inteiros nao negativos',
    );
  });

  it('deve recusar a interpretacao quando alguma parte e negativa', () => {
    // Arrange
    const texto = 'v-1.2.3';

    // Act
    const act = (): unknown => parseSemanticVersion(texto);

    // Assert
    expect(act).toThrow(
      'versao invalida: recebido "v-1.2.3", esperado vX.Y.Z com inteiros nao negativos',
    );
  });

  it('deve recusar a interpretacao quando alguma parte tem zero a esquerda', () => {
    // Arrange
    const texto = 'v01.2.3';

    // Act
    const act = (): unknown => parseSemanticVersion(texto);

    // Assert
    expect(act).toThrow(
      'versao invalida: recebido "v01.2.3", esperado vX.Y.Z com inteiros nao negativos',
    );
  });

  it('deve recusar a interpretacao quando a versao traz sufixo de pre-lancamento', () => {
    // Arrange
    const texto = 'v1.2.3-rc1';

    // Act
    const act = (): unknown => parseSemanticVersion(texto);

    // Assert
    expect(act).toThrow(
      'versao invalida: recebido "v1.2.3-rc1", esperado vX.Y.Z com inteiros nao negativos',
    );
  });

  it('deve recusar a interpretacao quando o texto vem com espaco ao redor', () => {
    // Arrange
    const texto = ' v1.2.3 ';

    // Act
    const act = (): unknown => parseSemanticVersion(texto);

    // Assert
    expect(act).toThrow(
      'versao invalida: recebido " v1.2.3 ", esperado vX.Y.Z com inteiros nao negativos',
    );
  });
});

describe('formatSemanticVersion', () => {
  it('deve escrever a versao com o prefixo v quando ela e formatada', () => {
    // Arrange
    const versao = version();

    // Act
    const texto = formatSemanticVersion(versao);

    // Assert
    expect(texto).toBe('v1.2.3');
  });

  it('deve escrever zeros quando a versao e 0.0.0', () => {
    // Arrange
    const versao = version({ major: 0, minor: 0, patch: 0 });

    // Act
    const texto = formatSemanticVersion(versao);

    // Assert
    expect(texto).toBe('v0.0.0');
  });
});

describe('bumpSemanticVersion', () => {
  it('deve zerar minor e patch quando o incremento e major', () => {
    // Arrange
    const versao = version();

    // Act
    const elevada = bumpSemanticVersion(versao, 'major');

    // Assert
    expect(elevada).toEqual({ major: 2, minor: 0, patch: 0 });
  });

  it('deve zerar apenas o patch quando o incremento e minor', () => {
    // Arrange
    const versao = version();

    // Act
    const elevada = bumpSemanticVersion(versao, 'minor');

    // Assert
    expect(elevada).toEqual({ major: 1, minor: 3, patch: 0 });
  });

  it('deve somar um ao patch quando o incremento e patch', () => {
    // Arrange
    const versao = version();

    // Act
    const elevada = bumpSemanticVersion(versao, 'patch');

    // Assert
    expect(elevada).toEqual({ major: 1, minor: 2, patch: 4 });
  });

  it('deve congelar a versao elevada quando ela e produzida', () => {
    // Arrange
    const versao = version();

    // Act
    const elevada = bumpSemanticVersion(versao, 'patch');

    // Assert
    expect(Object.isFrozen(elevada)).toBe(true);
  });

  it('deve preservar a versao de entrada quando ela e elevada', () => {
    // Arrange
    const versao = version();

    // Act
    bumpSemanticVersion(versao, 'major');

    // Assert
    expect(versao).toEqual({ major: 1, minor: 2, patch: 3 });
  });
});
