import { describe, expect, it } from 'vitest';
import { parseCatalogDto } from '../../../../../core/domain/dtos/catalog_dto';
import { CatalogSourceError } from '../../../../../core/domain/errors/catalog_source_error';

function repositorio(): Record<string, unknown> {
  return {
    name: 'shortsmaker-api',
    url: 'https://github.com/byt3un1on/shortsmaker-api',
    description: null,
    technology: 'Python',
    homepage: null,
    lastActivityAt: '2026-01-14T05:31:18Z',
  };
}

function projeto(): Record<string, unknown> {
  return {
    slug: 'shortsmaker',
    name: 'Shortsmaker',
    summary: 'Pipeline de geracao de videos curtos.',
    highlighted: true,
    technologies: ['Python', 'TypeScript'],
    lastActivityAt: '2026-01-14T05:31:18Z',
    homepage: null,
    repositories: [repositorio()],
  };
}

function catalogo(): Record<string, unknown> {
  return { generatedAt: '2026-08-31T00:00:00Z', projects: [projeto()] };
}

describe('parseCatalogDto', () => {
  it('deve ler o catalogo inteiro quando ele esta bem formado', () => {
    // Arrange
    const cru = catalogo();

    // Act
    const dto = parseCatalogDto(cru);

    // Assert
    expect(dto.projects[0]?.slug).toBe('shortsmaker');
  });

  it('deve preservar as tecnologias derivadas quando o projeto as declara', () => {
    // Arrange
    const cru = catalogo();

    // Act
    const dto = parseCatalogDto(cru);

    // Assert
    expect(dto.projects[0]?.technologies).toEqual(['Python', 'TypeScript']);
  });

  it('deve tratar destaque ausente como falso quando o campo nao vem', () => {
    // Arrange
    const semDestaque = projeto();
    delete semDestaque['highlighted'];
    const cru = { ...catalogo(), projects: [semDestaque] };

    // Act
    const dto = parseCatalogDto(cru);

    // Assert
    expect(dto.projects[0]?.highlighted).toBe(false);
  });

  it('deve aceitar catalogo sem projeto algum quando a lista vem vazia', () => {
    // Arrange
    const cru = { ...catalogo(), projects: [] };

    // Act
    const dto = parseCatalogDto(cru);

    // Assert
    expect(dto.projects).toEqual([]);
  });

  it('deve recusar o catalogo quando a raiz nao e objeto', () => {
    // Arrange
    const cru = 'nada';

    // Act
    const act = (): unknown => parseCatalogDto(cru);

    // Assert
    expect(act).toThrow('catalogo esperado objeto, recebido string');
  });

  it('deve recusar o catalogo quando a raiz e um array', () => {
    // Arrange
    const cru: unknown[] = [];

    // Act
    const act = (): unknown => parseCatalogDto(cru);

    // Assert
    expect(act).toThrow('catalogo esperado objeto, recebido array');
  });

  it('deve recusar o catalogo quando projects nao e lista', () => {
    // Arrange
    const cru = { ...catalogo(), projects: {} };

    // Act
    const act = (): unknown => parseCatalogDto(cru);

    // Assert
    expect(act).toThrow('catalogo: "projects" esperado lista, recebido object');
  });

  it('deve recusar o catalogo quando generatedAt falta', () => {
    // Arrange
    const cru = catalogo();
    delete cru['generatedAt'];

    // Act
    const act = (): unknown => parseCatalogDto(cru);

    // Assert
    expect(act).toThrow('catalogo: "generatedAt" esperado string, recebido undefined');
  });

  it('deve recusar o projeto quando ele nao tem repositorio algum', () => {
    // Arrange
    const cru = { ...catalogo(), projects: [{ ...projeto(), repositories: [] }] };

    // Act
    const act = (): unknown => parseCatalogDto(cru);

    // Assert
    expect(act).toThrow('projeto: "repositories" esperado lista nao vazia');
  });

  it('deve recusar o projeto quando as tecnologias nao sao lista de textos', () => {
    // Arrange
    const cru = { ...catalogo(), projects: [{ ...projeto(), technologies: [1, 2] }] };

    // Act
    const act = (): unknown => parseCatalogDto(cru);

    // Assert
    expect(act).toThrow('projeto: "technologies" esperado lista de textos');
  });

  it('deve recusar o projeto quando ele nao e objeto', () => {
    // Arrange
    const cru = { ...catalogo(), projects: ['shortsmaker'] };

    // Act
    const act = (): unknown => parseCatalogDto(cru);

    // Assert
    expect(act).toThrow('projeto esperado objeto, recebido string');
  });

  it('deve recusar o repositorio quando ele nao e objeto', () => {
    // Arrange
    const cru = { ...catalogo(), projects: [{ ...projeto(), repositories: ['api'] }] };

    // Act
    const act = (): unknown => parseCatalogDto(cru);

    // Assert
    expect(act).toThrow('repositorio esperado objeto, recebido string');
  });

  it('deve recusar o repositorio quando o endereco falta', () => {
    // Arrange
    const semUrl = repositorio();
    delete semUrl['url'];
    const cru = { ...catalogo(), projects: [{ ...projeto(), repositories: [semUrl] }] };

    // Act
    const act = (): unknown => parseCatalogDto(cru);

    // Assert
    expect(act).toThrow('repositorio: "url" esperado string, recebido undefined');
  });

  it('deve apontar o artefato gerado como recurso quando a leitura falha', () => {
    // Arrange
    const cru = { ...catalogo(), projects: 'nao e lista' };

    // Act
    let capturado: CatalogSourceError | undefined;
    try {
      parseCatalogDto(cru);
    } catch (error) {
      capturado = error as CatalogSourceError;
    }

    // Assert
    expect(capturado?.resource).toBe('data/catalog.generated.json');
  });
});
