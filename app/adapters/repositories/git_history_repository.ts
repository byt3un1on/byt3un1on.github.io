import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
  formatSemanticVersion,
  parseSemanticVersion,
  type SemanticVersion,
} from '../../core/domain/models/semantic_version_model.ts';
import type { IGitHistoryRepository } from '../../interfaces/adapters/repositories/i_git_history_repository.ts';

/** Roda o `git` com os argumentos dados e devolve o stdout cru. */
export type GitExecutor = (args: readonly string[]) => Promise<string>;

const runGitProcess = promisify(execFile);

/**
 * Executor padrao: o `git` do clone. E injetavel porque o teste unitario nao
 * deve depender de processo nem de repositorio real.
 */
export const gitCommandExecutor: GitExecutor = async (args: readonly string[]): Promise<string> => {
  const { stdout } = await runGitProcess('git', [...args]);
  return stdout;
};

/**
 * NUL separa os commits porque mensagem de commit e multilinha: quebra de linha
 * dividiria o corpo do commit em mensagens que nunca existiram.
 */
const COMMIT_SEPARATOR = '\0';

/** Le do clone o que a esteira precisa para versionar (RF-10). */
export class GitHistoryRepository implements IGitHistoryRepository {
  constructor(private readonly git: GitExecutor = gitCommandExecutor) {}

  /**
   * Recusa clone raso antes de olhar etiqueta alguma: com historico truncado o
   * `git tag` responde menos do que o repositorio tem, e a esteira publicaria
   * versao errada em silencio.
   */
  public async findLatestVersion(): Promise<SemanticVersion | null> {
    await this.refuseShallowClone();
    const output: string = await this.git(['tag', '--list', 'v*.*.*', '--sort=-v:refname']);
    for (const line of output.split('\n')) {
      const version: SemanticVersion | null = this.parseOrNull(line.trim());
      if (version !== null) {
        return version;
      }
    }
    return null;
  }

  public async listCommitMessagesSince(
    version: SemanticVersion | null,
  ): Promise<readonly string[]> {
    const range: readonly string[] =
      version === null ? [] : [`${formatSemanticVersion(version)}..HEAD`];
    const output: string = await this.git(['log', ...range, '--format=%B%x00']);
    return output
      .split(COMMIT_SEPARATOR)
      .map((message: string) => message.trim())
      .filter((message: string) => message !== '');
  }

  private async refuseShallowClone(): Promise<void> {
    const output: string = await this.git(['rev-parse', '--is-shallow-repository']);
    if (output.trim() === 'true') {
      throw new Error(
        'historico raso: recebido clone shallow, esperado historico completo ' +
          '(checkout com fetch-depth 0)',
      );
    }
  }

  private parseOrNull(line: string): SemanticVersion | null {
    try {
      return parseSemanticVersion(line);
    } catch {
      return null;
    }
  }
}
