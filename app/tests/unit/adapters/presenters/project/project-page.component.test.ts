import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { ProjectPageComponent } from '../../../../../adapters/presenters/project/project-page.component.ts';
import type { CatalogProjectDto } from '../../../../../core/domain/dtos/catalog_dto.ts';
import { FIND_PROJECT_USE_CASE, SEO_TOOL } from '../../../../../infra/init/ioc_init.ts';
import type { IFindProjectBySlugUseCase } from '../../../../../interfaces/core/application/showcase/i_find_project_by_slug_use_case.ts';
import type { ISeoTool } from '../../../../../interfaces/infra/tools/i_seo_tool.ts';

function projeto(overrides: Partial<CatalogProjectDto> = {}): CatalogProjectDto {
  return {
    slug: 'shortsmaker',
    name: 'Shortsmaker',
    summary: 'Pipeline de geracao de videos curtos.',
    highlighted: false,
    technologies: ['Python', 'TypeScript'],
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
      {
        name: 'shortsmaker-frontend',
        url: 'https://github.com/byt3un1on/shortsmaker-frontend',
        description: null,
        technology: 'TypeScript',
        homepage: null,
        lastActivityAt: '2026-01-14T05:26:03.000Z',
      },
    ],
    ...overrides,
  };
}

function montar(
  encontrado: CatalogProjectDto | null,
  tool: ISeoTool = { apply: vi.fn() },
): Promise<unknown> {
  const busca: IFindProjectBySlugUseCase = { execute: vi.fn().mockReturnValue(encontrado) };
  return render(ProjectPageComponent, {
    inputs: { slug: 'shortsmaker' },
    providers: [
      provideRouter([]),
      { provide: FIND_PROJECT_USE_CASE, useValue: busca },
      { provide: SEO_TOOL, useValue: tool },
    ],
  });
}

describe('ProjectPageComponent', () => {
  it('deve exibir o nome do projeto quando ele existe', async () => {
    // Arrange
    await montar(projeto());

    // Act
    const titulo = screen.getByRole('heading', { level: 1, name: 'Shortsmaker' });

    // Assert
    expect(titulo).toBeDefined();
  });

  it('deve listar todos os repositorios que compoem o projeto quando ele agrupa varios', async () => {
    // Arrange
    await montar(projeto());

    // Act
    const ligacoes = screen.getAllByRole('link');

    // Assert
    expect(ligacoes.map((l) => l.textContent?.trim())).toEqual([
      'shortsmaker-api',
      'shortsmaker-frontend',
    ]);
  });

  it('deve oferecer o endereco publicado como ligacao distinta quando ele existe', async () => {
    // Arrange
    await montar(projeto({ homepage: 'https://byt3un1on.github.io' }));

    // Act
    const ligacao = screen.getByRole('link', { name: 'Abrir o endereco publicado' });

    // Assert
    expect(ligacao.getAttribute('href')).toBe('https://byt3un1on.github.io');
  });

  it('deve omitir o endereco publicado quando o projeto nao tem um', async () => {
    // Arrange
    await montar(projeto({ homepage: null }));

    // Act
    const ligacao = screen.queryByRole('link', { name: 'Abrir o endereco publicado' });

    // Assert
    expect(ligacao).toBeNull();
  });

  it('deve listar as tecnologias do projeto quando ele existe', async () => {
    // Arrange
    await montar(projeto());

    // Act
    const lista = screen.getByRole('list', { name: 'Tecnologias' });

    // Assert
    expect(lista.textContent).toContain('Python');
  });

  it('deve informar que o projeto nao existe quando o slug e desconhecido', async () => {
    // Arrange
    await montar(null);

    // Act
    const titulo = screen.getByRole('heading', { level: 1, name: 'Projeto nao encontrado' });

    // Assert
    expect(titulo).toBeDefined();
  });

  it('deve oferecer volta ao catalogo quando o projeto nao existe', async () => {
    // Arrange
    await montar(null);

    // Act
    const ligacao = screen.getByRole('link', { name: 'Ver os projetos' });

    // Assert
    expect(ligacao.getAttribute('href')).toBe('/projetos');
  });

  it('deve definir titulo e descricao do projeto quando ele existe', async () => {
    // Arrange
    const tool: ISeoTool = { apply: vi.fn() };

    // Act
    await montar(projeto(), tool);

    // Assert
    expect(tool.apply).toHaveBeenCalledWith(
      'Shortsmaker — Byte Union',
      'Pipeline de geracao de videos curtos.',
    );
  });

  it('deve definir titulo de ausencia quando o projeto nao existe', async () => {
    // Arrange
    const tool: ISeoTool = { apply: vi.fn() };

    // Act
    await montar(null, tool);

    // Assert
    expect(tool.apply).toHaveBeenCalledWith(
      'Projeto nao encontrado — Byte Union',
      'Projeto inexistente na vitrine.',
    );
  });
});
