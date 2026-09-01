import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { fireEvent, render, screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { CatalogPageComponent } from '../../../../../adapters/presenters/catalog/catalog-page.component.ts';
import type { CatalogProjectDto } from '../../../../../core/domain/dtos/catalog_dto.ts';
import {
  FILTER_PROJECTS_USE_CASE,
  LIST_TECHNOLOGIES_USE_CASE,
  SEO_TOOL,
} from '../../../../../infra/init/ioc_init.ts';
import type { IFilterProjectsByTechnologyUseCase } from '../../../../../interfaces/core/application/showcase/i_filter_projects_by_technology_use_case.ts';
import type { IListTechnologiesUseCase } from '../../../../../interfaces/core/application/showcase/i_list_technologies_use_case.ts';

function projeto(slug: string, technologies: readonly string[] = ['Python']): CatalogProjectDto {
  return {
    slug,
    name: slug,
    summary: 'resumo do projeto',
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

function montar(
  porTecnologia: (tecnologia: string | null) => readonly CatalogProjectDto[],
  tecnologia: string | null = null,
  tecnologias: readonly string[] = ['Go', 'Python'],
): Promise<unknown> {
  const filtro: IFilterProjectsByTechnologyUseCase = { execute: vi.fn(porTecnologia) };
  const lista: IListTechnologiesUseCase = { execute: vi.fn().mockReturnValue(tecnologias) };
  return render(CatalogPageComponent, {
    inputs: { tecnologia },
    providers: [
      provideRouter([]),
      { provide: FILTER_PROJECTS_USE_CASE, useValue: filtro },
      { provide: LIST_TECHNOLOGIES_USE_CASE, useValue: lista },
      { provide: SEO_TOOL, useValue: { apply: vi.fn() } },
    ],
  });
}

describe('CatalogPageComponent', () => {
  it('deve exibir um cartao por projeto quando o catalogo tem varios', async () => {
    // Arrange
    await montar(() => [projeto('a'), projeto('b')]);

    // Act
    const titulos = screen.getAllByRole('heading', { level: 3 });

    // Assert
    expect(titulos.map((t) => t.textContent?.trim())).toEqual(['a', 'b']);
  });

  it('deve anunciar a quantidade de projetos quando o catalogo carrega', async () => {
    // Arrange
    await montar(() => [projeto('a'), projeto('b')]);

    // Act
    const anuncio = screen.getByRole('status');

    // Assert
    expect(anuncio.textContent?.trim()).toBe('2 projetos encontrados');
  });

  it('deve anunciar no singular quando so um projeto atende', async () => {
    // Arrange
    await montar(() => [projeto('a')]);

    // Act
    const anuncio = screen.getByRole('status');

    // Assert
    expect(anuncio.textContent?.trim()).toBe('1 projeto encontrado');
  });

  it('deve restringir o catalogo quando o endereco carrega a tecnologia', async () => {
    // Arrange
    await montar(
      (tecnologia) => (tecnologia === 'Go' ? [projeto('a')] : [projeto('a'), projeto('b')]),
      'Go',
    );

    // Act
    const anuncio = screen.getByRole('status');

    // Assert
    expect(anuncio.textContent?.trim()).toBe('1 projeto encontrado');
  });

  it('deve consultar o caso de uso com a tecnologia do endereco quando ela vem', async () => {
    // Arrange
    const porTecnologia = vi.fn().mockReturnValue([projeto('a')]);
    await montar(porTecnologia, 'Go');

    // Act
    const chamadas = porTecnologia.mock.calls;

    // Assert
    expect(chamadas).toEqual([['Go']]);
  });

  it('deve consultar o caso de uso com nulo quando o endereco nao restringe', async () => {
    // Arrange
    const porTecnologia = vi.fn().mockReturnValue([projeto('a')]);
    await montar(porTecnologia);

    // Act
    const chamadas = porTecnologia.mock.calls;

    // Assert
    expect(chamadas).toEqual([[null]]);
  });

  it('deve manter a regiao de anuncio educada quando renderizada', async () => {
    // Arrange
    await montar(() => [projeto('a')]);

    // Act
    const anuncio = screen.getByRole('status');

    // Assert
    expect(anuncio.getAttribute('aria-live')).toBe('polite');
  });

  it('deve explicar o vazio quando o endereco restringe a tecnologia ausente', async () => {
    // Arrange
    await montar(() => [], 'Rust');

    // Act
    const mensagem = screen.getByText('Nenhum projeto atende ao criterio escolhido.');

    // Assert
    expect(mensagem).toBeDefined();
  });

  it('deve oferecer remover a restricao quando o resultado e vazio', async () => {
    // Arrange
    await montar(() => [], 'Rust');

    // Act
    const botao = screen.getByRole('button', { name: 'Remover a restricao' });

    // Assert
    expect(botao).toBeDefined();
  });

  it('deve anunciar zero quando a restricao nao retorna projeto', async () => {
    // Arrange
    await montar(() => [], 'Rust');

    // Act
    const anuncio = screen.getByRole('status');

    // Assert
    expect(anuncio.textContent?.trim()).toBe('0 projetos encontrados');
  });

  it('deve levar a tecnologia para o endereco quando o visitante restringe', async () => {
    // Arrange
    await montar(() => [projeto('a')]);
    const router = TestBed.inject(Router);
    const rota = TestBed.inject(ActivatedRoute);
    const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));

    // Assert
    expect(navegar.mock.calls).toEqual([
      [[], { relativeTo: rota, queryParams: { tecnologia: 'Go' }, queryParamsHandling: 'merge' }],
    ]);
  });

  it('deve retirar a tecnologia do endereco quando o visitante remove a restricao', async () => {
    // Arrange
    await montar(() => [], 'Rust');
    const router = TestBed.inject(Router);
    const rota = TestBed.inject(ActivatedRoute);
    const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Remover a restricao' }));

    // Assert
    expect(navegar.mock.calls).toEqual([
      [[], { relativeTo: rota, queryParams: { tecnologia: null }, queryParamsHandling: 'merge' }],
    ]);
  });

  it('deve exibir titulo da pagina quando renderizada', async () => {
    // Arrange
    await montar(() => [projeto('a')]);

    // Act
    const titulo = screen.getByRole('heading', { level: 1, name: 'Projetos' });

    // Assert
    expect(titulo).toBeDefined();
  });
});
