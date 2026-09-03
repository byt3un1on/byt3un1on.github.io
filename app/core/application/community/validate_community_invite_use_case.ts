import { CommunityInviteError } from '../../domain/errors/community_invite_error.ts';
import type { IValidateCommunityInviteUseCase } from '../../../interfaces/core/application/community/i_validate_community_invite_use_case.ts';

const INVITE_PREFIX = 'https://discord.gg/';
const EXPECTED = `endereco comecando por ${INVITE_PREFIX} seguido do codigo do convite`;

/**
 * RF-10: a vitrine nao publica ligacao morta.
 *
 * A checagem e de forma, e nao de existencia: seguir o convite exigiria rede em
 * tempo de construcao, e construcao que depende de rede deixa de ser
 * determinista. Convite revogado continua sendo risco aceito e registrado.
 */
export class ValidateCommunityInviteUseCase implements IValidateCommunityInviteUseCase {
  public execute(invite: string): void {
    const trimmed: string = invite.trim();
    if (!trimmed.startsWith(INVITE_PREFIX)) {
      throw new CommunityInviteError(invite, EXPECTED);
    }
    const code: string = trimmed.slice(INVITE_PREFIX.length);
    if (code.length === 0 || code.includes('/')) {
      throw new CommunityInviteError(invite, EXPECTED);
    }
  }
}
