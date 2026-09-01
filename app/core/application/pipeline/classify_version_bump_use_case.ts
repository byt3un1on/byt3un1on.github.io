import {
  type ConventionalCommitDto,
  parseConventionalCommit,
} from '../../domain/dtos/conventional_commit_dto.ts';
import { highestVersionBump, type VersionBump } from '../../domain/enums/version_bump_enum.ts';
import type { IClassifyVersionBumpUseCase } from '../../../interfaces/core/application/pipeline/i_classify_version_bump_use_case.ts';

/**
 * Piso da dobra e tambem o incremento de quem nao contribui: `patch` e o menor
 * da precedencia, entao semear com ele mantem a lista vazia e a mensagem fora
 * do padrao sem efeito sobre o resultado.
 */
const BASE_BUMP: VersionBump = 'patch';

/**
 * RF-10: deriva o incremento semantico das mensagens promovidas. A dobra usa
 * `highestVersionBump`, de modo que um unico commit incompativel no meio de dez
 * correcoes eleva a release a major.
 */
export class ClassifyVersionBumpUseCase implements IClassifyVersionBumpUseCase {
  public execute(commitMessages: readonly string[]): VersionBump {
    return commitMessages.reduce(
      (accumulated: VersionBump, message: string): VersionBump =>
        highestVersionBump(accumulated, this.classifyMessage(message)),
      BASE_BUMP,
    );
  }

  private classifyMessage(message: string): VersionBump {
    const commit: ConventionalCommitDto | null = parseConventionalCommit(message);
    if (commit === null) {
      return BASE_BUMP;
    }
    if (commit.isBreaking) {
      return 'major';
    }
    return commit.type === 'feat' ? 'minor' : 'patch';
  }
}
