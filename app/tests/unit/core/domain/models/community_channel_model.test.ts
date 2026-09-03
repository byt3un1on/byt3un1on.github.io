import { describe, expect, it } from 'vitest';
import {
  CHANNEL_KIND_LABEL,
  isPublicCategory,
  type CommunityCategory,
} from '../../../../../core/domain/models/community_channel_model.ts';

function categoria(visibility: CommunityCategory['visibility']): CommunityCategory {
  return { name: 'X', visibility, purpose: 'p', channels: [] };
}

describe('CHANNEL_KIND_LABEL', () => {
  it('deve rotular o forum com acento quando consultado', () => {
    // Arrange
    const tipo = 'forum' as const;

    // Act
    const rotulo = CHANNEL_KIND_LABEL[tipo];

    // Assert
    expect(rotulo).toBe('fórum');
  });

  it('deve cobrir os tres tipos de canal quando consultado', () => {
    // Arrange
    const esperados = ['texto', 'voz', 'forum'];

    // Act
    const tipos = Object.keys(CHANNEL_KIND_LABEL);

    // Assert
    expect(tipos.sort()).toEqual(esperados.sort());
  });
});

describe('isPublicCategory', () => {
  it('deve reconhecer categoria publica quando a visibilidade e publica', () => {
    // Arrange
    const alvo = categoria('publica');

    // Act
    const publica = isPublicCategory(alvo);

    // Assert
    expect(publica).toBe(true);
  });

  it('deve recusar categoria fechada quando a visibilidade e fechada', () => {
    // Arrange
    const alvo = categoria('fechada');

    // Act
    const publica = isPublicCategory(alvo);

    // Assert
    expect(publica).toBe(false);
  });
});
