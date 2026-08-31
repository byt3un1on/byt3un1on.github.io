import { describe, expect, it } from 'vitest';
import { parseGithubRepositoryDto } from '../../../../../core/domain/dtos/github_repository_dto.ts';
import { CatalogSourceError } from '../../../../../core/domain/errors/catalog_source_error.ts';

const RESOURCE = '/orgs/byt3un1on/repos';

function repositorioCru(): Record<string, unknown> {
  return {
    name: 'shortsmaker-api',
    description: null,
    html_url: 'https://github.com/byt3un1on/shortsmaker-api',
    homepage: null,
    language: 'Python',
    private: false,
    archived: false,
    pushed_at: '2026-01-14T05:31:18Z',
  };
}

describe('parseGithubRepositoryDto', () => {
  it('deve traduzir os campos para o recorte do dominio quando a resposta e completa', () => {
    // Arrange
    const cru = repositorioCru();

    // Act
    const dto = parseGithubRepositoryDto(cru, RESOURCE);

    // Assert
    expect(dto).toEqual({
      name: 'shortsmaker-api',
      description: null,
      htmlUrl: 'https://github.com/byt3un1on/shortsmaker-api',
      homepage: null,
      language: 'Python',
      isPrivate: false,
      isArchived: false,
      pushedAt: '2026-01-14T05:31:18Z',
    });
  });

  it('deve preservar descricao e endereco publicado quando ambos vem preenchidos', () => {
    // Arrange
    const cru = {
      ...repositorioCru(),
      description: 'Site institucional',
      homepage: 'https://byt3un1on.github.io',
    };

    // Act
    const dto = parseGithubRepositoryDto(cru, RESOURCE);

    // Assert
    expect([dto.description, dto.homepage]).toEqual([
      'Site institucional',
      'https://byt3un1on.github.io',
    ]);
  });

  it('deve tratar campo ausente como nulo quando ele e opcional', () => {
    // Arrange
    const cru = repositorioCru();
    delete cru['language'];

    // Act
    const dto = parseGithubRepositoryDto(cru, RESOURCE);

    // Assert
    expect(dto.language).toBeNull();
  });

  it('deve recusar a resposta quando ela nao e um objeto', () => {
    // Arrange
    const cru = 'nao sou objeto';

    // Act
    const act = (): unknown => parseGithubRepositoryDto(cru, RESOURCE);

    // Assert
    expect(act).toThrow(CatalogSourceError);
  });

  it('deve dizer o tipo recebido quando a resposta e um array', () => {
    // Arrange
    const cru: unknown[] = [];

    // Act
    const act = (): unknown => parseGithubRepositoryDto(cru, RESOURCE);

    // Assert
    expect(act).toThrow('esperado objeto, recebido array');
  });

  it('deve recusar a resposta quando ela e nula', () => {
    // Arrange
    const cru = null;

    // Act
    const act = (): unknown => parseGithubRepositoryDto(cru, RESOURCE);

    // Assert
    expect(act).toThrow('esperado objeto, recebido object');
  });

  it('deve recusar a resposta quando um campo obrigatorio de texto falta', () => {
    // Arrange
    const cru = repositorioCru();
    delete cru['name'];

    // Act
    const act = (): unknown => parseGithubRepositoryDto(cru, RESOURCE);

    // Assert
    expect(act).toThrow('campo "name" esperado string, recebido undefined');
  });

  it('deve recusar a resposta quando um campo opcional vem com tipo errado', () => {
    // Arrange
    const cru = { ...repositorioCru(), description: 42 };

    // Act
    const act = (): unknown => parseGithubRepositoryDto(cru, RESOURCE);

    // Assert
    expect(act).toThrow('campo "description" esperado string ou nulo, recebido number');
  });

  it('deve recusar a resposta quando um campo booleano vem com tipo errado', () => {
    // Arrange
    const cru = { ...repositorioCru(), archived: 'sim' };

    // Act
    const act = (): unknown => parseGithubRepositoryDto(cru, RESOURCE);

    // Assert
    expect(act).toThrow('campo "archived" esperado booleano, recebido string');
  });

  it('deve informar o recurso pedido quando a traducao falha', () => {
    // Arrange
    const cru = repositorioCru();
    delete cru['html_url'];

    // Act
    let capturado: CatalogSourceError | undefined;
    try {
      parseGithubRepositoryDto(cru, RESOURCE);
    } catch (error) {
      capturado = error as CatalogSourceError;
    }

    // Assert
    expect(capturado?.resource).toBe(RESOURCE);
  });
});
