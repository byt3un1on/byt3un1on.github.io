import {
  bumpSemanticVersion,
  FIRST_SEMANTIC_VERSION,
  type SemanticVersion,
} from '../../domain/models/semantic_version_model.ts';
import type { IGitHistoryRepository } from '../../../interfaces/adapters/repositories/i_git_history_repository.ts';
import type { IClassifyVersionBumpUseCase } from '../../../interfaces/core/application/pipeline/i_classify_version_bump_use_case.ts';
import type { IResolveNextVersionUseCase } from '../../../interfaces/core/application/pipeline/i_resolve_next_version_use_case.ts';

/**
 * RF-10: decide a versao da proxima release a partir da ultima marca do
 * repositorio e dos commits desde ela.
 */
export class ResolveNextVersionUseCase implements IResolveNextVersionUseCase {
  constructor(
    private readonly gitHistoryRepository: IGitHistoryRepository,
    private readonly classifyVersionBump: IClassifyVersionBumpUseCase,
  ) {}

  /**
   * Sem marca anterior devolve `FIRST_SEMANTIC_VERSION` **sem** incremento e
   * sem ler o historico (RF-10, esclarecimento 11): o repositorio nao tem tag
   * alguma, nao ha o que elevar, e a primeira release precisa dizer a verdade
   * sobre um sitio que ja esta no ar.
   */
  public async execute(): Promise<SemanticVersion> {
    const latest: SemanticVersion | null = await this.gitHistoryRepository.findLatestVersion();
    if (latest === null) {
      return FIRST_SEMANTIC_VERSION;
    }
    const messages: readonly string[] =
      await this.gitHistoryRepository.listCommitMessagesSince(latest);
    return bumpSemanticVersion(latest, this.classifyVersionBump.execute(messages));
  }
}
