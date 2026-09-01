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
