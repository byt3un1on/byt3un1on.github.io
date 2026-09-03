import { describe, expect, it } from 'vitest';
import {
  COMMUNITY_INVITE_URL,
  COMMUNITY_SPACE,
  GITHUB_TOPICS,
} from '../../../../../core/domain/constants/community_space_constants.ts';
import { isPublicCategory } from '../../../../../core/domain/models/community_channel_model.ts';

const LIMITE_DE_LINHA = 110;

describe('COMMUNITY_SPACE', () => {
  it('deve descrever as tres categorias do servidor quando consultado', () => {
    // Arrange
    const esperadas = ['PÚBLICO', 'OFICINA', 'PROJETOS'];

    // Act
    const nomes = COMMUNITY_SPACE.map((categoria) => categoria.name);

    // Assert
    expect(nomes).toEqual(esperadas);
  });

  it('deve marcar apenas a oficina como fechada quando consultado', () => {
    // Arrange
    const esperado = ['OFICINA'];

    // Act
    const fechadas = COMMUNITY_SPACE.filter((c) => !isPublicCategory(c)).map((c) => c.name);

    // Assert
    expect(fechadas).toEqual(esperado);
  });

  it('deve deixar a categoria fechada sem canal algum quando consultado', () => {
    // Arrange
    const fechada = COMMUNITY_SPACE.find((c) => !isPublicCategory(c));

    // Act
    const canais = fechada?.channels ?? [{ name: 'x' }];

    // Assert
    expect(canais).toHaveLength(0);
  });

  it('deve dar proposito escrito a toda categoria quando consultado', () => {
    // Arrange
    const categorias = COMMUNITY_SPACE;

    // Act
    const semProposito = categorias.filter((c) => c.purpose.trim().length === 0);

    // Assert
    expect(semProposito).toHaveLength(0);
  });

  it('deve dar proposito escrito a todo canal quando consultado', () => {
    // Arrange
    const canais = COMMUNITY_SPACE.flatMap((c) => c.channels);

    // Act
    const semProposito = canais.filter((canal) => canal.purpose.trim().length === 0);

    // Assert
    expect(semProposito).toHaveLength(0);
  });

  it('deve manter cada proposito curto o bastante para duas linhas quando consultado', () => {
    // Arrange
    const canais = COMMUNITY_SPACE.flatMap((c) => c.channels);

    // Act
    const longos = canais.filter((canal) => canal.purpose.length > LIMITE_DE_LINHA);

    // Assert
    expect(longos).toHaveLength(0);
  });

  it('deve declarar os canais somente leitura quando consultado', () => {
    // Arrange
    const esperados = ['boas-vindas', 'anúncios'];

    // Act
    const somenteLeitura = COMMUNITY_SPACE.flatMap((c) => c.channels)
      .filter((canal) => !canal.writable)
      .map((canal) => canal.name);

    // Assert
    expect(somenteLeitura).toEqual(esperados);
  });

  it('deve recusar alteracao das categorias quando tentada', () => {
    // Arrange
    const antes = COMMUNITY_SPACE.length;

    // Act
    const congelado = Object.isFrozen(COMMUNITY_SPACE);

    // Assert
    expect(congelado && COMMUNITY_SPACE.length === antes).toBe(true);
  });
});

describe('COMMUNITY_INVITE_URL', () => {
  it('deve apontar para um convite do Discord quando consultado', () => {
    // Arrange
    const prefixo = 'https://discord.gg/';

    // Act
    const url = COMMUNITY_INVITE_URL;

    // Assert
    expect(url.startsWith(prefixo)).toBe(true);
  });

  it('deve carregar codigo de convite quando consultado', () => {
    // Arrange
    const prefixo = 'https://discord.gg/';

    // Act
    const codigo = COMMUNITY_INVITE_URL.slice(prefixo.length);

    // Assert
    expect(codigo.length).toBeGreaterThan(0);
  });
});

describe('GITHUB_TOPICS', () => {
  it('deve listar o que nao e assunto do Discord quando consultado', () => {
    // Arrange
    const minimo = 1;

    // Act
    const total = GITHUB_TOPICS.length;

    // Assert
    expect(total).toBeGreaterThanOrEqual(minimo);
  });

  it('deve descrever cada assunto com texto escrito quando consultado', () => {
    // Arrange
    const assuntos = GITHUB_TOPICS;

    // Act
    const vazios = assuntos.filter((assunto) => assunto.trim().length === 0);

    // Assert
    expect(vazios).toHaveLength(0);
  });
});
