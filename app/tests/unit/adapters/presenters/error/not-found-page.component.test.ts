import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { NotFoundPageComponent } from '../../../../../adapters/presenters/error/not-found-page.component.ts';
import { SEO_TOOL } from '../../../../../infra/init/ioc_init.ts';
import type { ISeoTool } from '../../../../../interfaces/infra/tools/i_seo_tool.ts';

function seo(): ISeoTool {
  return { apply: vi.fn() };
}

describe('NotFoundPageComponent', () => {
  it('deve anunciar que o endereco nao existe quando renderizado', async () => {
    // Arrange
    await render(NotFoundPageComponent, {
      providers: [provideRouter([]), { provide: SEO_TOOL, useValue: seo() }],
    });

    // Act
    const titulo = screen.getByRole('heading', { name: 'Endereco nao encontrado' });

    // Assert
    expect(titulo).toBeDefined();
  });

  it('deve oferecer caminho de volta ao catalogo quando renderizado', async () => {
    // Arrange
    await render(NotFoundPageComponent, {
      providers: [provideRouter([]), { provide: SEO_TOOL, useValue: seo() }],
    });

    // Act
    const ligacao = screen.getByRole('link', { name: 'Ver os projetos' });

    // Assert
    expect(ligacao.getAttribute('href')).toBe('/projetos');
  });

  it('deve definir titulo e descricao proprios quando renderizado', async () => {
    // Arrange
    const tool = seo();

    // Act
    await render(NotFoundPageComponent, {
      providers: [provideRouter([]), { provide: SEO_TOOL, useValue: tool }],
    });

    // Assert
    expect(tool.apply).toHaveBeenCalledExactlyOnceWith(
      'Endereco nao encontrado — Byte Union',
      'A pagina procurada nao existe na vitrine da Byte Union.',
    );
  });
});
