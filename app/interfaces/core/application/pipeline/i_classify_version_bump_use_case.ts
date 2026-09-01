import type { VersionBump } from '../../../../core/domain/enums/version_bump_enum.ts';

/**
 * RF-10: le as mensagens de commit promovidas e devolve o incremento que elas
 * justificam. Mensagem fora do padrao convencional nao contribui e nao aborta —
 * a esteira nao existe para policiar redacao de commit.
 */
export interface IClassifyVersionBumpUseCase {
  execute(commitMessages: readonly string[]): VersionBump;
}
