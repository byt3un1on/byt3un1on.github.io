import { describe, expect, it, vi } from 'vitest';
import { FilterProjectsByTechnologyUseCase } from '../../../../../core/application/showcase/filter_projects_by_technology_use_case';
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

describe('FilterProjectsByTechnologyUseCase', () => {
  it('deve alcancar o projeto multi-tecnologia quando a escolhida esta na lista dele', () => {
    // Arrange
    const repository = duble([projeto('shortsmaker', ['Python', 'TypeScript'])]);

    // Act
    const projetos = new FilterProjectsByTechnologyUseCase(repository).execute('TypeScript');

    // Assert
    expect(projetos.map((p) => p.slug)).toEqual(['shortsmaker']);
  });

  it('deve devolver so os projetos que empregam a tecnologia quando ha varios', () => {
    // Arrange
    const repository = duble([
      projeto('shortsmaker', ['Python', 'TypeScript']),
      projeto('templates', ['Go']),
    ]);

    // Act
    const projetos = new FilterProjectsByTechnologyUseCase(repository).execute('Go');

    // Assert
    expect(projetos.map((p) => p.slug)).toEqual(['templates']);
  });

  it('deve devolver o catalogo inteiro quando nenhuma tecnologia e escolhida', () => {
    // Arrange
    const repository = duble([projeto('a', ['Go']), projeto('b', ['Python'])]);

    // Act
    const projetos = new FilterProjectsByTechnologyUseCase(repository).execute(null);

    // Assert
    expect(projetos.map((p) => p.slug)).toEqual(['a', 'b']);
  });

  it('deve devolver lista vazia quando nenhum projeto emprega a tecnologia', () => {
    // Arrange
    const repository = duble([projeto('templates', ['Go'])]);

    // Act
    const projetos = new FilterProjectsByTechnologyUseCase(repository).execute('Rust');

    // Assert
    expect(projetos).toEqual([]);
  });

  it('deve distinguir maiusculas quando a tecnologia difere so no caso', () => {
    // Arrange
    const repository = duble([projeto('templates', ['Go'])]);

    // Act
    const projetos = new FilterProjectsByTechnologyUseCase(repository).execute('go');

    // Assert
    expect(projetos).toEqual([]);
  });

  it('deve ler o catalogo exatamente uma vez quando executa', () => {
    // Arrange
    const repository = duble([projeto('a', ['Go'])]);

    // Act
    new FilterProjectsByTechnologyUseCase(repository).execute('Go');

    // Assert
    expect(repository.load).toHaveBeenCalledTimes(1);
  });
});
