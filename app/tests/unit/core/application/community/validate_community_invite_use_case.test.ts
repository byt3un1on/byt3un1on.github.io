import { describe, expect, it } from 'vitest';
import { ValidateCommunityInviteUseCase } from '../../../../../core/application/community/validate_community_invite_use_case.ts';
import { CommunityInviteError } from '../../../../../core/domain/errors/community_invite_error.ts';

describe('ValidateCommunityInviteUseCase', () => {
  it('deve aceitar o convite quando o endereco e um convite do Discord', () => {
    // Arrange
    const caso = new ValidateCommunityInviteUseCase();

    // Act
    const acao = (): void => caso.execute('https://discord.gg/fZ3sNap5vJ');

    // Assert
    expect(acao).not.toThrow();
  });

  it('deve recusar quando o endereco esta vazio', () => {
    // Arrange
    const caso = new ValidateCommunityInviteUseCase();

    // Act
    const acao = (): void => caso.execute('');

    // Assert
    expect(acao).toThrow(CommunityInviteError);
  });

  it('deve recusar quando o endereco tem apenas espacos', () => {
    // Arrange
    const caso = new ValidateCommunityInviteUseCase();

    // Act
    const acao = (): void => caso.execute('   ');

    // Assert
    expect(acao).toThrow(CommunityInviteError);
  });

  it('deve recusar quando o dominio nao e do Discord', () => {
    // Arrange
    const caso = new ValidateCommunityInviteUseCase();

    // Act
    const acao = (): void => caso.execute('https://exemplo.com/fZ3sNap5vJ');

    // Assert
    expect(acao).toThrow(CommunityInviteError);
  });

  it('deve recusar quando falta o codigo do convite', () => {
    // Arrange
    const caso = new ValidateCommunityInviteUseCase();

    // Act
    const acao = (): void => caso.execute('https://discord.gg/');

    // Assert
    expect(acao).toThrow(CommunityInviteError);
  });

  it('deve recusar quando o caminho tem mais de um nivel', () => {
    // Arrange
    const caso = new ValidateCommunityInviteUseCase();

    // Act
    const acao = (): void => caso.execute('https://discord.gg/a/b');

    // Assert
    expect(acao).toThrow(CommunityInviteError);
  });

  it('deve nomear o valor recebido quando recusa', () => {
    // Arrange
    const caso = new ValidateCommunityInviteUseCase();
    const recebido = 'http://discord.gg/x';

    // Act
    let mensagem = '';
    try {
      caso.execute(recebido);
    } catch (erro) {
      mensagem = erro instanceof Error ? erro.message : '';
    }

    // Assert
    expect(mensagem).toContain(JSON.stringify(recebido));
  });

  it('deve aceitar convite cercado de espacos quando o miolo e valido', () => {
    // Arrange
    const caso = new ValidateCommunityInviteUseCase();

    // Act
    const acao = (): void => caso.execute('  https://discord.gg/abc  ');

    // Assert
    expect(acao).not.toThrow();
  });
});
