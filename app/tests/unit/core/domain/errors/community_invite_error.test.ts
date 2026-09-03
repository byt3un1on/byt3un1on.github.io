import { describe, expect, it } from 'vitest';
import { CommunityInviteError } from '../../../../../core/domain/errors/community_invite_error.ts';

describe('CommunityInviteError', () => {
  it('deve nomear o valor recebido quando construido', () => {
    // Arrange
    const recebido = 'https://example.com/x';

    // Act
    const erro = new CommunityInviteError(recebido, 'convite discord.gg');

    // Assert
    expect(erro.message).toContain(JSON.stringify(recebido));
  });

  it('deve nomear o formato esperado quando construido', () => {
    // Arrange
    const esperado = 'convite discord.gg';

    // Act
    const erro = new CommunityInviteError('', esperado);

    // Assert
    expect(erro.message).toContain(esperado);
  });

  it('deve identificar-se pelo proprio nome quando construido', () => {
    // Arrange
    const esperado = 'CommunityInviteError';

    // Act
    const erro = new CommunityInviteError('x', 'y');

    // Assert
    expect(erro.name).toBe(esperado);
  });
});
