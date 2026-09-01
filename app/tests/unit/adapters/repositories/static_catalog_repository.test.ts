import { describe, expect, it } from 'vitest';
import { StaticCatalogRepository } from '../../../../adapters/repositories/static_catalog_repository.ts';
import { CatalogSourceError } from '../../../../core/domain/errors/catalog_source_error.ts';

const CATALOGO = {
  generatedAt: '2026-08-31T09:00:00.000Z',
  projects: [
    {
      slug: 'shortsmaker',
      name: 'Shortsmaker',
      summary: 'resumo',
      highlighted: false,
      technologies: ['Python'],
      lastActivityAt: '2026-01-14T05:31:18.000Z',
      homepage: null,
      repositories: [
        {
          name: 'shortsmaker-api',
          url: 'https://github.com/byt3un1on/shortsmaker-api',
          description: null,
          technology: 'Python',
          homepage: null,
          lastActivityAt: '2026-01-14T05:31:18.000Z',
        },
      ],
    },
  ],
};

describe('StaticCatalogRepository', () => {
  it('deve devolver o catalogo quando a fonte e valida', () => {
    // Arrange
    const repository = new StaticCatalogRepository(CATALOGO);

    // Act
    const catalogo = repository.load();

    // Assert
    expect(catalogo.projects.map((p) => p.slug)).toEqual(['shortsmaker']);
  });

  it('deve devolver a mesma instancia quando lido duas vezes', () => {
    // Arrange
    const repository = new StaticCatalogRepository(CATALOGO);

    // Act
    const primeira = repository.load();
    const segunda = repository.load();

    // Assert
    expect(segunda).toBe(primeira);
  });

  it('deve aceitar catalogo sem projeto quando a organizacao nao tem nenhum curado', () => {
    // Arrange
    const repository = new StaticCatalogRepository({
      generatedAt: '2026-01-01T00:00:00.000Z',
      projects: [],
    });

    // Act
    const catalogo = repository.load();

    // Assert
    expect(catalogo.projects).toEqual([]);
  });

  it('deve recusar quando o artefato gerado esta corrompido', () => {
    // Arrange
    const repository = new StaticCatalogRepository({ projects: 'nao e lista' });

    // Act
    const act = (): unknown => repository.load();

    // Assert
    expect(act).toThrow(CatalogSourceError);
  });
});
