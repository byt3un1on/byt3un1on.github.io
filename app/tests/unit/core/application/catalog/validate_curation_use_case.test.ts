import { describe, expect, it } from 'vitest';
import { ValidateCurationUseCase } from '../../../../../core/application/catalog/validate_curation_use_case.ts';
import type {
  CurationDto,
  CurationProjectDto,
} from '../../../../../core/domain/dtos/curation_dto.ts';
import { CurationValidationError } from '../../../../../core/domain/errors/curation_validation_error.ts';

function entrada(overrides: Partial<CurationProjectDto> = {}): CurationProjectDto {
  return {
    slug: 'shortsmaker',
    name: 'Shortsmaker',
    summary: 'Pipeline de geracao de videos curtos.',
    highlighted: false,
    repositories: ['shortsmaker-api'],
    ...overrides,
  };
}

function curadoria(projects: readonly CurationProjectDto[]): CurationDto {
  return { projects };
}

const DISPONIVEIS = ['shortsmaker-api', 'shortsmaker-frontend', 'templates-library'];

describe('ValidateCurationUseCase', () => {
  it('deve aceitar a curadoria quando todas as entradas sao validas', () => {
    // Arrange
    const useCase = new ValidateCurationUseCase();
    const curation = curadoria([
      entrada(),
      entrada({ slug: 'templates', repositories: ['templates-library'] }),
    ]);

    // Act
    const act = (): void => useCase.execute(curation, DISPONIVEIS);

    // Assert
    expect(act).not.toThrow();
  });

  it('deve aceitar a curadoria quando ela nao declara projeto algum', () => {
    // Arrange
    const useCase = new ValidateCurationUseCase();
    const curation = curadoria([]);

    // Act
    const act = (): void => useCase.execute(curation, DISPONIVEIS);

    // Assert
    expect(act).not.toThrow();
  });

  it('deve recusar a curadoria quando uma entrada nao tem resumo escrito', () => {
    // Arrange
    const useCase = new ValidateCurationUseCase();
    const curation = curadoria([entrada({ summary: '   ' })]);

    // Act
    const act = (): void => useCase.execute(curation, DISPONIVEIS);

    // Assert
    expect(act).toThrow(
      'curadoria invalida: entrada sem resumo escrito; entradas afetadas: shortsmaker',
    );
  });

  it('deve apontar todas as entradas sem resumo quando ha mais de uma', () => {
    // Arrange
    const useCase = new ValidateCurationUseCase();
    const curation = curadoria([
      entrada({ slug: 'a', summary: '' }),
      entrada({ slug: 'b', summary: ' ' }),
    ]);

    // Act
    let capturado: CurationValidationError | undefined;
    try {
      useCase.execute(curation, DISPONIVEIS);
    } catch (error) {
      capturado = error as CurationValidationError;
    }

    // Assert
    expect(capturado?.entries).toEqual(['a', 'b']);
  });

  it('deve recusar a curadoria quando ela referencia repositorio inexistente', () => {
    // Arrange
    const useCase = new ValidateCurationUseCase();
    const curation = curadoria([entrada({ repositories: ['repositorio-que-sumiu'] })]);

    // Act
    const act = (): void => useCase.execute(curation, DISPONIVEIS);

    // Assert
    expect(act).toThrow(
      'curadoria invalida: referencia a repositorio inexistente; entradas afetadas: repositorio-que-sumiu',
    );
  });

  it('deve recusar a curadoria quando o mesmo repositorio esta em dois projetos', () => {
    // Arrange
    const useCase = new ValidateCurationUseCase();
    const curation = curadoria([
      entrada({ slug: 'a', repositories: ['shortsmaker-api'] }),
      entrada({ slug: 'b', repositories: ['shortsmaker-api'] }),
    ]);

    // Act
    const act = (): void => useCase.execute(curation, DISPONIVEIS);

    // Assert
    expect(act).toThrow(
      'curadoria invalida: repositorio declarado em mais de um projeto; entradas afetadas: shortsmaker-api',
    );
  });

  it('deve recusar a curadoria quando o mesmo repositorio se repete na mesma entrada', () => {
    // Arrange
    const useCase = new ValidateCurationUseCase();
    const curation = curadoria([entrada({ repositories: ['shortsmaker-api', 'shortsmaker-api'] })]);

    // Act
    const act = (): void => useCase.execute(curation, DISPONIVEIS);

    // Assert
    expect(act).toThrow('repositorio declarado em mais de um projeto');
  });

  it('deve reclamar do resumo antes da referencia quando os dois defeitos coexistem', () => {
    // Arrange
    const useCase = new ValidateCurationUseCase();
    const curation = curadoria([entrada({ summary: '', repositories: ['inexistente'] })]);

    // Act
    const act = (): void => useCase.execute(curation, DISPONIVEIS);

    // Assert
    expect(act).toThrow('entrada sem resumo escrito');
  });
});
