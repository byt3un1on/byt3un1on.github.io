import { describe, expect, it, vi } from 'vitest';
import { FindProjectBySlugUseCase } from '../../../../../core/application/showcase/find_project_by_slug_use_case';
import type { CatalogDto, CatalogProjectDto } from '../../../../../core/domain/dtos/catalog_dto';
import type { IStaticCatalogRepository } from '../../../../../interfaces/adapters/repositories/i_static_catalog_repository';

function projeto(slug: string, technologies: readonly string[]): CatalogProjectDto {
  return {
    slug,
    name: slug,
    summary: 'resumo',
    highlighted: false,
    technologies,
    lastActivityAt: '2026-01-14T05:31:18.000Z',
    homepage: null,
    repositories: [
      {
        name: `${slug}-repo`,
        url: `https://github.com/byt3un1on/${slug}-repo`,
        description: null,
        technology: technologies[0] ?? null,
        homepage: null,
        lastActivityAt: '2026-01-14T05:31:18.000Z',
      },
    ],
  };
}

function catalogo(projects: readonly CatalogProjectDto[]): CatalogDto {
  return { generatedAt: '2026-08-31T09:00:00.000Z', projects };
}

function duble(projects: readonly CatalogProjectDto[]): IStaticCatalogRepository {
  return { load: vi.fn().mockReturnValue(catalogo(projects)) };
}

describe('FindProjectBySlugUseCase', () => {
  it('deve devolver o projeto quando o slug existe', () => {
    // Arrange
    const repository = duble([projeto('shortsmaker', ['Python'])]);

    // Act
    const encontrado = new FindProjectBySlugUseCase(repository).execute('shortsmaker');

    // Assert
    expect(encontrado?.slug).toBe('shortsmaker');
  });

  it('deve devolver nulo quando o slug nao existe', () => {
    // Arrange
    const repository = duble([projeto('shortsmaker', ['Python'])]);

    // Act
    const encontrado = new FindProjectBySlugUseCase(repository).execute('inexistente');

    // Assert
    expect(encontrado).toBeNull();
  });

  it('deve devolver nulo quando o catalogo esta vazio', () => {
    // Arrange
    const repository = duble([]);

    // Act
    const encontrado = new FindProjectBySlugUseCase(repository).execute('shortsmaker');

    // Assert
    expect(encontrado).toBeNull();
  });

  it('deve ler o catalogo exatamente uma vez quando executa', () => {
    // Arrange
    const repository = duble([projeto('a', ['Go'])]);

    // Act
    new FindProjectBySlugUseCase(repository).execute('a');

    // Assert
    expect(repository.load).toHaveBeenCalledTimes(1);
  });
});
