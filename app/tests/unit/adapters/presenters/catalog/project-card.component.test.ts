import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { ProjectCardComponent } from '../../../../../adapters/presenters/catalog/project-card.component.ts';
import type { CatalogProjectDto } from '../../../../../core/domain/dtos/catalog_dto.ts';

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
    ],
    ...overrides,
  };
}

function montar(project: CatalogProjectDto): Promise<unknown> {
  return render(ProjectCardComponent, {
    inputs: { project },
    providers: [provideRouter([])],
  });
}

describe('ProjectCardComponent', () => {
  it('deve exibir o nome do projeto quando renderizado', async () => {
    // Arrange
    await montar(projeto());

    // Act
    const titulo = screen.getByRole('heading', { name: 'Shortsmaker' });

    // Assert
    expect(titulo).toBeDefined();
  });

  it('deve exibir o resumo do projeto quando renderizado', async () => {
    // Arrange
    await montar(projeto());

    // Act
    const resumo = screen.getByText('Pipeline de geracao de videos curtos.');

    // Assert
    expect(resumo).toBeDefined();
  });

  it('deve listar as tecnologias do projeto quando renderizado', async () => {
    // Arrange
    await montar(projeto());

    // Act
    const lista = screen.getByRole('list', { name: 'Tecnologias' });

    // Assert
    expect(lista.textContent).toContain('TypeScript');
  });

  it('deve exibir a atividade em portugues quando renderizado', async () => {
    // Arrange
    await montar(projeto());

    // Act
    const atividade = screen.getByText(/Atividade mais recente em/);

    // Assert
    expect(atividade.textContent).toContain('de janeiro de 2026');
  });

  it('deve levar a pagina propria do projeto quando renderizado', async () => {
    // Arrange
    await montar(projeto());

    // Act
    const ligacao = screen.getByRole('link', { name: 'Shortsmaker' });

    // Assert
    expect(ligacao.getAttribute('href')).toBe('/projetos/shortsmaker');
  });

  it('deve levar ao repositorio de origem quando renderizado', async () => {
    // Arrange
    await montar(projeto());

    // Act
    const ligacao = screen.getByRole('link', { name: 'Ver o repositório' });

    // Assert
    expect(ligacao.getAttribute('href')).toBe('https://github.com/byt3un1on/shortsmaker-api');
  });

  it('deve sinalizar o destaque quando a curadoria o declara', async () => {
    // Arrange
    await montar(projeto({ highlighted: true }));

    // Act
    const selo = screen.getByText('Em destaque');

    // Assert
    expect(selo).toBeDefined();
  });

  it('deve omitir o selo de destaque quando a curadoria nao o declara', async () => {
    // Arrange
    await montar(projeto({ highlighted: false }));

    // Act
    const selo = screen.queryByText('Em destaque');

    // Assert
    expect(selo).toBeNull();
  });

  it('deve exibir lista de tecnologias vazia quando o projeto nao declara nenhuma', async () => {
    // Arrange
    await montar(projeto({ technologies: [] }));

    // Act
    const lista = screen.getByRole('list', { name: 'Tecnologias' });

    // Assert
    expect(lista.textContent?.trim()).toBe('');
  });
});
