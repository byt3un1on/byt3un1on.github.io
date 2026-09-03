import { describe, expect, it } from 'vitest';
import {
  CONTACT_CHANNELS,
  ORGANIZATION,
  pendingContactChannels,
  readyContactChannels,
} from '../../../../../core/domain/constants/organization_constants.ts';

describe('ORGANIZATION', () => {
  it('deve identificar a organizacao pelo nome quando consultada', () => {
    // Arrange
    const esperado = 'Byte Union';

    // Act
    const nome = ORGANIZATION.name;

    // Assert
    expect(nome).toBe(esperado);
  });

  it('deve apontar para o perfil real da organizacao quando consultada', () => {
    // Arrange
    const esperado = `https://github.com/${ORGANIZATION.login}`;

    // Act
    const url = ORGANIZATION.githubUrl;

    // Assert
    expect(url).toBe(esperado);
  });
});

describe('readyContactChannels', () => {
  it('deve devolver apenas canais com endereco quando consultada', () => {
    // Arrange
    const total = CONTACT_CHANNELS.length;

    // Act
    const prontos = readyContactChannels();

    // Assert
    expect(prontos.length).toBe(total);
  });

  it('deve oferecer o GitHub quando consultada', () => {
    // Arrange
    const esperado = 'github';

    // Act
    const ids = readyContactChannels().map((channel) => channel.id);

    // Assert
    expect(ids).toContain(esperado);
  });

  it('deve entregar endereco absoluto em https em todo canal externo', () => {
    // Arrange
    const externos = readyContactChannels().filter((channel) => channel.target === 'externo');

    // Act
    const invalidos = externos.filter((channel) => !channel.url.startsWith('https://'));

    // Assert
    expect(invalidos).toEqual([]);
  });

  it('deve entregar rota relativa em todo canal interno', () => {
    // Arrange
    const internos = readyContactChannels().filter((channel) => channel.target === 'interno');

    // Act
    const invalidos = internos.filter((channel) => !channel.url.startsWith('/'));

    // Assert
    expect(invalidos).toEqual([]);
  });

  it('deve entregar rotulo nao vazio em todo canal pronto', () => {
    // Arrange
    const prontos = readyContactChannels();

    // Act
    const semRotulo = prontos.filter((channel) => channel.label.trim().length === 0);

    // Assert
    expect(semRotulo).toEqual([]);
  });
});

describe('pendingContactChannels', () => {
  it('deve nao registrar o Discord como pendente depois de o servidor existir', () => {
    // Arrange
    const naoEsperado = 'discord';

    // Act
    const ids = pendingContactChannels().map((channel) => channel.id);

    // Assert
    expect(ids).not.toContain(naoEsperado);
  });

  it('deve declarar o motivo da pendencia em todo canal pendente', () => {
    // Arrange
    const pendentes = pendingContactChannels();

    // Act
    const semMotivo = pendentes.filter((channel) => channel.reason.trim().length === 0);

    // Assert
    expect(semMotivo).toEqual([]);
  });

  it('deve manter canal pendente fora da lista oferecida ao visitante', () => {
    // Arrange
    const pendentes = pendingContactChannels().map((channel) => channel.id);

    // Act
    const oferecidos = readyContactChannels().map((channel) => channel.id);

    // Assert
    expect(oferecidos.filter((id) => pendentes.includes(id))).toEqual([]);
  });
});

describe('CONTACT_CHANNELS apos a criacao do servidor', () => {
  it('deve nao deixar canal pendente algum quando consultada', () => {
    // Arrange
    const esperado = 0;

    // Act
    const pendentes = pendingContactChannels();

    // Assert
    expect(pendentes).toHaveLength(esperado);
  });

  it('deve oferecer o Discord pelo convite permanente quando consultada', () => {
    // Arrange
    const prefixo = 'https://discord.gg/';

    // Act
    const discord = readyContactChannels().find((canal) => canal.id === 'discord');

    // Assert
    expect(discord?.url.startsWith(prefixo)).toBe(true);
  });

  it('deve marcar o convite do Discord como endereco externo quando consultada', () => {
    // Arrange
    const esperado = 'externo';

    // Act
    const discord = readyContactChannels().find((canal) => canal.id === 'discord');

    // Assert
    expect(discord?.target).toBe(esperado);
  });

  it('deve oferecer a pagina da comunidade como navegacao interna quando consultada', () => {
    // Arrange
    const esperado = 'interno';

    // Act
    const pagina = readyContactChannels().find((canal) => canal.id === 'comunidade');

    // Assert
    expect(pagina?.target).toBe(esperado);
  });

  it('deve apontar a pagina da comunidade para a rota do sitio quando consultada', () => {
    // Arrange
    const esperado = '/comunidade';

    // Act
    const pagina = readyContactChannels().find((canal) => canal.id === 'comunidade');

    // Assert
    expect(pagina?.url).toBe(esperado);
  });
});
