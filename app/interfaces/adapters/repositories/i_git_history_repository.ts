import type { SemanticVersion } from '../../../core/domain/models/semantic_version_model.ts';

/**
 * Le do clone o que a esteira precisa para versionar (RF-10). O dado ja esta em
 * disco depois do checkout: um cliente HTTP para a API de releases so somaria
 * rede e cota para responder o que `git tag` responde de graca.
 */
export interface IGitHistoryRepository {
  /** Ultima versao marcada, ou `null` quando o repositorio nao tem marca alguma. */
  findLatestVersion(): Promise<SemanticVersion | null>;
  /** Mensagens completas dos commits desde a versao dada; todas, quando `null`. */
  listCommitMessagesSince(version: SemanticVersion | null): Promise<readonly string[]>;
}
