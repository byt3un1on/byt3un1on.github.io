import type { SemanticVersion } from '../../../../core/domain/models/semantic_version_model.ts';

/**
 * RF-10: decide a versao da release a partir da ultima marca e dos commits
 * desde ela. Sem marca anterior devolve a primeira versao **sem** aplicar
 * incremento — o repositorio comeca sem tag alguma, e a primeira release
 * precisa dizer a verdade sobre um sitio que ja esta no ar.
 */
export interface IResolveNextVersionUseCase {
  execute(): Promise<SemanticVersion>;
}
