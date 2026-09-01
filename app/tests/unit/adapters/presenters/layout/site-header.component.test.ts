import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { SiteHeaderComponent } from '../../../../../adapters/presenters/layout/site-header.component.ts';
import { ORGANIZATION } from '../../../../../core/domain/constants/organization_constants.ts';

describe('SiteHeaderComponent', () => {
  it('deve rotular a navegacao principal quando renderizado', async () => {
    // Arrange
    await render(SiteHeaderComponent, { providers: [provideRouter([])] });

    // Act
    const navegacao = screen.getByRole('navigation', { name: 'Principal' });

    // Assert
    expect(navegacao).toBeDefined();
  });

  it('deve levar a pagina inicial pelo nome da organizacao quando renderizado', async () => {
    // Arrange
    await render(SiteHeaderComponent, { providers: [provideRouter([])] });

    // Act
    const ligacao = screen.getByRole('link', { name: ORGANIZATION.name });

    // Assert
    expect(ligacao.getAttribute('href')).toBe('/');
  });

  it('deve levar ao catalogo quando renderizado', async () => {
    // Arrange
    await render(SiteHeaderComponent, { providers: [provideRouter([])] });

    // Act
    const ligacao = screen.getByRole('link', { name: 'Projetos' });

    // Assert
    expect(ligacao.getAttribute('href')).toBe('/projetos');
  });

  it('deve oferecer atalho para o conteudo quando renderizado', async () => {
    // Arrange
    await render(SiteHeaderComponent, { providers: [provideRouter([])] });

    // Act
    const atalho = screen.getByRole('link', { name: 'Pular para o conteudo' });

    // Assert
    expect(atalho.getAttribute('href')).toBe('#conteudo');
  });
});
