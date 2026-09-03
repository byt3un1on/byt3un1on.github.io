import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { SiteFooterComponent } from '../../../../../adapters/presenters/layout/site-footer.component.ts';
import {
  ORGANIZATION,
  pendingContactChannels,
  readyContactChannels,
} from '../../../../../core/domain/constants/organization_constants.ts';

describe('SiteFooterComponent', () => {
  it('deve apresentar a autoria como organizacao quando renderizado', async () => {
    // Arrange
    await render(SiteFooterComponent);

    // Act
    const texto = screen.getByText(`Mantido por ${ORGANIZATION.name}.`);

    // Assert
    expect(texto).toBeDefined();
  });

  it('deve oferecer o perfil da organizacao no GitHub quando renderizado', async () => {
    // Arrange
    await render(SiteFooterComponent);

    // Act
    const ligacao = screen.getByRole('link', { name: 'Organizacao no GitHub' });

    // Assert
    expect(ligacao.getAttribute('href')).toBe(ORGANIZATION.githubUrl);
  });

  it('deve oferecer uma ligacao por canal pronto quando renderizado', async () => {
    // Arrange
    await render(SiteFooterComponent);

    // Act
    const ligacoes = screen.getAllByRole('link');

    // Assert
    expect(ligacoes).toHaveLength(readyContactChannels().length);
  });

  it('deve nao oferecer canal pendente quando renderizado', async () => {
    // Arrange
    await render(SiteFooterComponent);
    const pendente = pendingContactChannels()[0];

    // Act
    const encontrado = screen.queryByRole('link', { name: pendente?.label ?? 'nenhum' });

    // Assert
    expect(encontrado).toBeNull();
  });

  it('deve rotular a navegacao de contato quando renderizado', async () => {
    // Arrange
    await render(SiteFooterComponent);

    // Act
    const navegacao = screen.getByRole('navigation', { name: 'Contato' });

    // Assert
    expect(navegacao).toBeDefined();
  });
});

describe('SiteFooterComponent e os dois tipos de canal', () => {
  it('deve navegar por rota interna quando o canal e interno', async () => {
    // Arrange
    await render(SiteFooterComponent, { providers: [provideRouter([])] });
    const interno = readyContactChannels().find((canal) => canal.target === 'interno');

    // Act
    const ligacao = screen.getByRole('link', { name: interno?.label ?? '' });

    // Assert
    expect(ligacao.getAttribute('rel')).toBeNull();
  });

  it('deve sair com noopener quando o canal e externo', async () => {
    // Arrange
    await render(SiteFooterComponent, { providers: [provideRouter([])] });
    const externo = readyContactChannels().find((canal) => canal.id === 'discord');

    // Act
    const ligacao = screen.getByRole('link', { name: externo?.label ?? '' });

    // Assert
    expect(ligacao.getAttribute('rel')).toBe('noopener');
  });

  it('deve oferecer o convite do Discord quando renderizado', async () => {
    // Arrange
    await render(SiteFooterComponent, { providers: [provideRouter([])] });
    const externo = readyContactChannels().find((canal) => canal.id === 'discord');

    // Act
    const ligacao = screen.getByRole('link', { name: externo?.label ?? '' });

    // Assert
    expect(ligacao.getAttribute('href')).toBe(externo?.url);
  });
});
