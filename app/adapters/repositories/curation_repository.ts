import { readFile } from 'node:fs/promises';
import { type CurationDto, parseCurationDto } from '../../core/domain/dtos/curation_dto.ts';
import { CurationValidationError } from '../../core/domain/errors/curation_validation_error.ts';
import type { ICurationRepository } from '../../interfaces/adapters/repositories/i_curation_repository.ts';
import type { IConfigTool } from '../../interfaces/infra/tools/i_config_tool.ts';

/** Le a curadoria versionada (RF-04). O caminho vem do ambiente, o que permite
 *  ao BDD apontar para fixture sem tocar na curadoria de producao. */
export class CurationRepository implements ICurationRepository {
  constructor(private readonly config: IConfigTool) {}

  public async read(): Promise<CurationDto> {
    const path = this.config.curationPath();
    const content = await readFile(path, 'utf8');
    return parseCurationDto(this.parseJson(content, path));
  }

  private parseJson(content: string, path: string): unknown {
    try {
      return JSON.parse(content);
    } catch (error) {
      // String() cobre Error e nao-Error sem ramo: JSON.parse so lanca
      // SyntaxError, e um `instanceof` aqui seria ramo que nenhum teste honesto
      // alcanca.
      throw new CurationValidationError(`arquivo ${path} nao e JSON valido: ${String(error)}`, []);
    }
  }
}
