import { render, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { CommunityPageComponent } from '../../../../../adapters/presenters/community/community-page.component.ts';
import {
  COMMUNITY_INVITE_URL,
  COMMUNITY_SPACE,
  GITHUB_TOPICS,
} from '../../../../../core/domain/constants/community_space_constants.ts';
import { IOC_PROVIDERS } from '../../../../../infra/init/ioc_init.ts';

async function montar(): Promise<void> {
  await render(CommunityPageComponent, { providers: [...IOC_PROVIDERS] });
}

describe('CommunityPageComponent', () => {
  it('deve nomear cada canal publico quando renderizada', async () => {
    // Arrange
    await montar();
    const publicos = COMMUNITY_SPACE.filter((c) => c.visibility === 'publica').flatMap(
      (c) => c.channels,
    );

    // Act
    const ausentes = publicos.filter((canal) => screen.queryAllByText(canal.name).length === 0);

    // Assert
    expect(ausentes).toHaveLength(0);
  });

  it('deve explicar cada canal publico quando renderizada', async () => {
    // Arrange
    await montar();
    const publicos = COMMUNITY_SPACE.filter((c) => c.visibility === 'publica').flatMap(
      (c) => c.channels,
    );

    // Act
    const semExplicacao = publicos.filter(
      (canal) => !document.body.textContent?.includes(canal.purpose),
    );

    // Assert
    expect(semExplicacao).toHaveLength(0);
  });

  it('deve citar a area fechada pelo nome quando renderizada', async () => {
    // Arrange
    await montar();
    const fechada = COMMUNITY_SPACE.find((c) => c.visibility === 'fechada');

    // Act
    const titulo = screen.queryAllByText(fechada?.name ?? '');

    // Assert
    expect(titulo.length).toBeGreaterThan(0);
  });

  it('deve nao listar canal algum da area fechada quando renderizada', async () => {
    // Arrange
    const fechada = COMMUNITY_SPACE.find((c) => c.visibility === 'fechada');
    await montar();

    // Act
    const canaisFechados = fechada?.channels ?? [];

    // Assert
    expect(canaisFechados).toHaveLength(0);
  });

  it('deve marcar os canais somente leitura quando renderizada', async () => {
    // Arrange
    await montar();
    const esperado = ', somente leitura';

    // Act
    const marcas = screen.queryAllByText(esperado);

    // Assert
    expect(marcas.length).toBe(2);
  });

  it('deve dar texto alternativo a toda imagem quando renderizada', async () => {
    // Arrange
    await montar();

    // Act
    const imagens = Array.from(document.querySelectorAll('img'));

    // Assert
    expect(
      imagens.filter((img) => (img.getAttribute('alt') ?? '').trim().length === 0),
    ).toHaveLength(0);
  });

  it('deve declarar largura e altura de toda imagem quando renderizada', async () => {
    // Arrange
    await montar();

    // Act
    const imagens = Array.from(document.querySelectorAll('img'));

    // Assert
    expect(
      imagens.filter((img) => !img.getAttribute('width') || !img.getAttribute('height')),
    ).toHaveLength(0);
  });

  it('deve ilustrar os quatro trechos previstos quando renderizada', async () => {
    // Arrange
    await montar();
    const esperado = 4;

    // Act
    const imagens = document.querySelectorAll('img');

    // Assert
    expect(imagens.length).toBe(esperado);
  });

  it('deve servir as imagens em formato comprimido quando renderizada', async () => {
    // Arrange
    await montar();

    // Act
    const imagens = Array.from(document.querySelectorAll('img'));

    // Assert
    expect(
      imagens.filter((img) => !(img.getAttribute('src') ?? '').endsWith('.webp')),
    ).toHaveLength(0);
  });

  it('deve servir as imagens do proprio sitio quando renderizada', async () => {
    // Arrange
    await montar();

    // Act
    const imagens = Array.from(document.querySelectorAll('img'));

    // Assert
    expect(
      imagens.filter((img) => !(img.getAttribute('src') ?? '').startsWith('imagens/')),
    ).toHaveLength(0);
  });

  it('deve dar legenda propria a cada imagem quando renderizada', async () => {
    // Arrange
    await montar();

    // Act
    const legendas = Array.from(document.querySelectorAll('figcaption'));

    // Assert
    expect(legendas.length).toBe(document.querySelectorAll('img').length);
  });

  it('deve nao repetir o texto alternativo na legenda quando renderizada', async () => {
    // Arrange
    await montar();
    const figuras = Array.from(document.querySelectorAll('figure'));

    // Act
    const repetidas = figuras.filter((figura) => {
      const alt = figura.querySelector('img')?.getAttribute('alt') ?? '';
      const legenda = figura.querySelector('figcaption')?.textContent ?? '';
      return alt.trim() === legenda.trim();
    });

    // Assert
    expect(repetidas).toHaveLength(0);
  });

  it('deve listar o que pertence ao GitHub quando renderizada', async () => {
    // Arrange
    await montar();

    // Act
    const ausentes = GITHUB_TOPICS.filter(
      (assunto) => !document.body.textContent?.includes(assunto),
    );

    // Assert
    expect(ausentes).toHaveLength(0);
  });

  it('deve oferecer a entrada pelo convite declarado quando renderizada', async () => {
    // Arrange
    await montar();

    // Act
    const ligacoes = Array.from(document.querySelectorAll('a')).map((a) => a.getAttribute('href'));

    // Assert
    expect(ligacoes).toContain(COMMUNITY_INVITE_URL);
  });

  it('deve marcar a ligacao de saida com noopener quando renderizada', async () => {
    // Arrange
    await montar();

    // Act
    const convite = Array.from(document.querySelectorAll('a')).find(
      (a) => a.getAttribute('href') === COMMUNITY_INVITE_URL,
    );

    // Assert
    expect(convite?.getAttribute('rel')).toBe('noopener');
  });
});
