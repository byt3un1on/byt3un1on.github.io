import { describe, expect, it, vi } from 'vitest';
import { ListProjectsUseCase } from '../../../../../core/application/showcase/list_projects_use_case.ts';
import type { CatalogDto, CatalogProjectDto } from '../../../../../core/domain/dtos/catalog_dto.ts';
import type { IStaticCatalogRepository } from '../../../../../interfaces/adapters/repositories/i_static_catalog_repository.ts';

function projeto(slug: string, technologies: readonly string[] = ['Python']): CatalogProjectDto {
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

describe('ListProjectsUseCase', () => {
  it('deve devolver os projetos na ordem do catalogo quando ha varios', () => {
    // Arrange
    const repository = duble([projeto('b'), projeto('a')]);

    // Act
    const projetos = new ListProjectsUseCase(repository).execute();

    // Assert
    expect(projetos.map((p) => p.slug)).toEqual(['b', 'a']);
  });

  it('deve ler o catalogo exatamente uma vez quando executa', () => {
    // Arrange
    const repository = duble([projeto('a')]);

    // Act
    new ListProjectsUseCase(repository).execute();

    // Assert
    expect(repository.load).toHaveBeenCalledTimes(1);
  });

  it('deve devolver lista vazia quando o catalogo nao tem projeto', () => {
    // Arrange
    const repository = duble([]);

    // Act
    const projetos = new ListProjectsUseCase(repository).execute();

    // Assert
    expect(projetos).toEqual([]);
  });
});
