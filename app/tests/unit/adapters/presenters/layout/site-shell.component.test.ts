import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { SiteShellComponent } from '../../../../../adapters/presenters/layout/site-shell.component.ts';

describe('SiteShellComponent', () => {
  it('deve compor o cabecalho quando renderizado', async () => {
    // Arrange
    await render(SiteShellComponent, { providers: [provideRouter([])] });

    // Act
    const cabecalho = screen.getByRole('banner');

    // Assert
    expect(cabecalho).toBeDefined();
  });

  it('deve compor o rodape quando renderizado', async () => {
    // Arrange
    await render(SiteShellComponent, { providers: [provideRouter([])] });

    // Act
    const rodape = screen.getByRole('contentinfo');

    // Assert
    expect(rodape).toBeDefined();
  });

  it('deve oferecer a regiao principal como alvo do atalho quando renderizado', async () => {
    // Arrange
    const { container } = await render(SiteShellComponent, { providers: [provideRouter([])] });

    // Act
    const principal = container.querySelector('main#conteudo');

    // Assert
    expect(principal).not.toBeNull();
  });
});
