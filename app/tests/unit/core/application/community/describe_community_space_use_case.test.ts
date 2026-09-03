import { describe, expect, it } from 'vitest';
import { DescribeCommunitySpaceUseCase } from '../../../../../core/application/community/describe_community_space_use_case.ts';
import { COMMUNITY_SPACE } from '../../../../../core/domain/constants/community_space_constants.ts';

describe('DescribeCommunitySpaceUseCase', () => {
  it('deve devolver todas as categorias quando executado', () => {
    // Arrange
    const caso = new DescribeCommunitySpaceUseCase();

    // Act
    const categorias = caso.execute();

    // Assert
    expect(categorias).toHaveLength(COMMUNITY_SPACE.length);
  });

  it('deve preservar a ordem declarada quando executado', () => {
    // Arrange
    const caso = new DescribeCommunitySpaceUseCase();
    const esperada = COMMUNITY_SPACE.map((categoria) => categoria.name);

    // Act
    const nomes = caso.execute().map((categoria) => categoria.name);

    // Assert
    expect(nomes).toEqual(esperada);
  });

  it('deve entregar os canais das categorias publicas quando executado', () => {
    // Arrange
    const caso = new DescribeCommunitySpaceUseCase();

    // Act
    const publica = caso.execute().find((categoria) => categoria.visibility === 'publica');

    // Assert
    expect(publica?.channels.length).toBeGreaterThan(0);
  });

  it('deve esconder os canais da categoria fechada quando executado', () => {
    // Arrange
    const caso = new DescribeCommunitySpaceUseCase();

    // Act
    const fechada = caso.execute().find((categoria) => categoria.visibility === 'fechada');

    // Assert
    expect(fechada?.channels).toHaveLength(0);
  });

  it('deve manter o proposito da categoria fechada quando executado', () => {
    // Arrange
    const caso = new DescribeCommunitySpaceUseCase();

    // Act
    const fechada = caso.execute().find((categoria) => categoria.visibility === 'fechada');

    // Assert
    expect(fechada?.purpose.trim().length).toBeGreaterThan(0);
  });
});
