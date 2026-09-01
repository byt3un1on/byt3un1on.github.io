import { appendFile } from 'node:fs/promises';
import type { IRunSummaryRepository } from '../../interfaces/adapters/repositories/i_run_summary_repository.ts';
import type { IConfigTool } from '../../interfaces/infra/tools/i_config_tool.ts';

/**
 * Acrescenta um bloco ao resumo da execucao (RF-12). E o unico ponto da esteira
 * que escreve saida: os casos de uso apenas devolvem texto.
 *
 * O caminho do resumo e opcional porque o container nao enxerga o arquivo de
 * resumo do executor. Ausente o caminho, o bloco sai por stdout e e o YAML que
 * o redireciona, com `make -s pipeline summary >> "$GITHUB_STEP_SUMMARY"`.
 */
export class RunSummaryRepository implements IRunSummaryRepository {
  constructor(
    private readonly config: IConfigTool,
    private readonly writeStdout: (text: string) => void = (text) => {
      process.stdout.write(text);
    },
    private readonly appendToFile: (path: string, text: string) => Promise<void> = (path, text) =>
      appendFile(path, text, 'utf8'),
  ) {}

  /** Bloco em branco nao e escrito por caminho nenhum: resumo vazio e ruido. */
  public async append(block: string): Promise<void> {
    if (block.trim() === '') {
      return;
    }
    const path: string | null = this.config.runSummaryPath();
    if (path === null) {
      this.writeStdout(block);
      return;
    }
    await this.appendToFile(path, block);
  }
}
