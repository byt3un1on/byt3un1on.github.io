import { describe, expect, it, vi } from 'vitest';
import { ListTechnologiesUseCase } from '../../../../../core/application/showcase/list_technologies_use_case.ts';
import type { CatalogDto, CatalogProjectDto } from '../../../../../core/domain/dtos/catalog_dto.ts';
import type { IStaticCatalogRepository } from '../../../../../interfaces/adapters/repositories/i_static_catalog_repository.ts';

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

describe('ListTechnologiesUseCase', () => {
  it('deve reunir as tecnologias de todos os projetos quando ha varios', () => {
    // Arrange
    const repository = duble([projeto('a', ['Python']), projeto('b', ['Go'])]);

    // Act
    const tecnologias = new ListTechnologiesUseCase(repository).execute();

    // Assert
    expect(tecnologias).toEqual(['Go', 'Python']);
  });

  it('deve descartar repeticao quando dois projetos empregam a mesma', () => {
    // Arrange
    const repository = duble([projeto('a', ['TypeScript']), projeto('b', ['TypeScript'])]);

    // Act
    const tecnologias = new ListTechnologiesUseCase(repository).execute();

    // Assert
    expect(tecnologias).toEqual(['TypeScript']);
  });

  it('deve devolver lista vazia quando o catalogo nao tem projeto', () => {
    // Arrange
    const repository = duble([]);

    // Act
    const tecnologias = new ListTechnologiesUseCase(repository).execute();

    // Assert
    expect(tecnologias).toEqual([]);
  });

  it('deve devolver lista vazia quando nenhum projeto declara tecnologia', () => {
    // Arrange
    const repository = duble([projeto('a', [])]);

    // Act
    const tecnologias = new ListTechnologiesUseCase(repository).execute();

    // Assert
    expect(tecnologias).toEqual([]);
  });
});
