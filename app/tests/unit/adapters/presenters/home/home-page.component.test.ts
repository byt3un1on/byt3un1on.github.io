import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { HomePageComponent } from '../../../../../adapters/presenters/home/home-page.component.ts';
import { ORGANIZATION } from '../../../../../core/domain/constants/organization_constants.ts';
import { SEO_TOOL } from '../../../../../infra/init/ioc_init.ts';
import type { ISeoTool } from '../../../../../interfaces/infra/tools/i_seo_tool.ts';

function montar(tool: ISeoTool = { apply: vi.fn() }): Promise<unknown> {
  return render(HomePageComponent, {
    providers: [provideRouter([]), { provide: SEO_TOOL, useValue: tool }],
  });
}

describe('HomePageComponent', () => {
  it('deve apresentar o nome da organizacao quando renderizada', async () => {
    // Arrange
    await montar();

    // Act
    const titulo = screen.getByRole('heading', { name: ORGANIZATION.name });

    // Assert
    expect(titulo).toBeDefined();
  });

  it('deve declarar a que a oficina se propoe quando renderizada', async () => {
    // Arrange
    await montar();

    // Act
    const texto = screen.getByText(/oficina de projetos/i);

    // Assert
    expect(texto).toBeDefined();
  });

  it('deve levar ao catalogo quando renderizada', async () => {
    // Arrange
    await montar();

    // Act
    const ligacao = screen.getByRole('link', { name: 'Ver os projetos' });

    // Assert
    expect(ligacao.getAttribute('href')).toBe('/projetos');
  });

  it('deve definir titulo e descricao proprios quando renderizada', async () => {
    // Arrange
    const tool: ISeoTool = { apply: vi.fn() };

    // Act
    await montar(tool);

    // Assert
    expect(tool.apply).toHaveBeenCalledExactlyOnceWith(
      'Byte Union — oficina de projetos',
      'O que a Byte Union constroi, em que tecnologias, e onde esta o codigo.',
    );
  });
});
