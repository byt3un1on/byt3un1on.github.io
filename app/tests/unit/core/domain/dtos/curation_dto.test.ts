import { describe, expect, it } from 'vitest';
import { parseCurationDto } from '../../../../../core/domain/dtos/curation_dto.ts';
import { CurationValidationError } from '../../../../../core/domain/errors/curation_validation_error.ts';

function entradaValida(): Record<string, unknown> {
  return {
    slug: 'shortsmaker',
    name: 'Shortsmaker',
    summary: 'Pipeline de geracao de videos curtos.',
    highlighted: true,
    repositories: ['shortsmaker-api', 'shortsmaker-frontend'],
  };
}

describe('parseCurationDto', () => {
  it('deve ler as entradas na ordem do arquivo quando a curadoria e valida', () => {
    // Arrange
    const cru = {
      projects: [entradaValida(), { ...entradaValida(), slug: 'templates', name: 'Templates' }],
    };

    // Act
    const dto = parseCurationDto(cru);

    // Assert
    expect(dto.projects.map((p) => p.slug)).toEqual(['shortsmaker', 'templates']);
  });

  it('deve preservar os campos da entrada quando a curadoria e valida', () => {
    // Arrange
    const cru = { projects: [entradaValida()] };

    // Act
    const dto = parseCurationDto(cru);

    // Assert
    expect(dto.projects[0]).toEqual({
      slug: 'shortsmaker',
      name: 'Shortsmaker',
      summary: 'Pipeline de geracao de videos curtos.',
      highlighted: true,
      repositories: ['shortsmaker-api', 'shortsmaker-frontend'],
    });
  });

  it('deve aceitar curadoria sem nenhum projeto quando a lista vem vazia', () => {
    // Arrange
    const cru = { projects: [] };

    // Act
    const dto = parseCurationDto(cru);

    // Assert
    expect(dto.projects).toEqual([]);
  });

  it('deve recusar a curadoria quando a raiz nao e objeto', () => {
    // Arrange
    const cru: unknown[] = [];

    // Act
    const act = (): unknown => parseCurationDto(cru);

    // Assert
    expect(act).toThrow('raiz esperada objeto, recebido array');
  });

  it('deve recusar a curadoria quando o campo projects nao e lista', () => {
    // Arrange
    const cru = { projects: 'nenhum' };

    // Act
    const act = (): unknown => parseCurationDto(cru);

    // Assert
    expect(act).toThrow('campo "projects" esperado lista, recebido string');
  });

  it('deve recusar a entrada quando ela nao e objeto', () => {
    // Arrange
    const cru = { projects: ['shortsmaker'] };

    // Act
    const act = (): unknown => parseCurationDto(cru);

    // Assert
    expect(act).toThrow('entrada na posicao 0 esperada objeto');
  });

  it('deve recusar a entrada quando o destaque nao e booleano', () => {
    // Arrange
    const cru = { projects: [{ ...entradaValida(), highlighted: 'sim' }] };

    // Act
    const act = (): unknown => parseCurationDto(cru);

    // Assert
    expect(act).toThrow('campo "highlighted" esperado booleano, recebido string');
  });

  it('deve recusar a entrada quando um campo de texto tem tipo errado', () => {
    // Arrange
    const cru = { projects: [{ ...entradaValida(), name: 7 }] };

    // Act
    const act = (): unknown => parseCurationDto(cru);

    // Assert
    expect(act).toThrow('campo "name" esperado string, recebido number');
  });

  it('deve recusar a entrada quando a lista de repositorios vem vazia', () => {
    // Arrange
    const cru = { projects: [{ ...entradaValida(), repositories: [] }] };

    // Act
    const act = (): unknown => parseCurationDto(cru);

    // Assert
    expect(act).toThrow('campo "repositories" esperado lista nao vazia');
  });

  it('deve recusar a entrada quando a lista de repositorios tem item que nao e texto', () => {
    // Arrange
    const cru = { projects: [{ ...entradaValida(), repositories: ['ok', 3] }] };

    // Act
    const act = (): unknown => parseCurationDto(cru);

    // Assert
    expect(act).toThrow('campo "repositories" esperado lista de textos');
  });

  it('deve identificar a entrada pela posicao quando o slug nao e texto', () => {
    // Arrange
    const cru = { projects: [{ ...entradaValida(), slug: 9 }] };

    // Act
    let capturado: CurationValidationError | undefined;
    try {
      parseCurationDto(cru);
    } catch (error) {
      capturado = error as CurationValidationError;
    }

    // Assert
    expect(capturado?.entries).toEqual(['posicao 0']);
  });
});
