/** Recusa convite que a vitrine nao pode publicar (RF-10). */
export interface IValidateCommunityInviteUseCase {
  /** Lanca `CommunityInviteError` quando o endereco nao serve. */
  execute(invite: string): void;
}
