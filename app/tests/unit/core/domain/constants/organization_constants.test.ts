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
    expect(prontos.length).toBeLessThan(total);
  });

  it('deve oferecer o GitHub quando consultada', () => {
    // Arrange
    const esperado = 'github';

    // Act
    const ids = readyContactChannels().map((channel) => channel.id);

    // Assert
    expect(ids).toContain(esperado);
  });

  it('deve entregar endereco absoluto em https em todo canal pronto', () => {
    // Arrange
    const prontos = readyContactChannels();

    // Act
    const invalidos = prontos.filter((channel) => !channel.url.startsWith('https://'));

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
  it('deve registrar o Discord como pendente enquanto o grupo nao existir', () => {
    // Arrange
    const esperado = 'discord';

    // Act
    const ids = pendingContactChannels().map((channel) => channel.id);

    // Assert
    expect(ids).toContain(esperado);
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
