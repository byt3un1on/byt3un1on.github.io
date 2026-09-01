import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { CatalogDto } from '../../core/domain/dtos/catalog_dto.ts';
import type { ICatalogFileRepository } from '../../interfaces/adapters/repositories/i_catalog_file_repository.ts';
import type { IConfigTool } from '../../interfaces/infra/tools/i_config_tool.ts';

/**
 * Grava os dois artefatos que o build consome. A lista de rotas e o que faz
 * cada pagina de projeto existir como arquivo (RF-08, RF-15).
 */
export class CatalogFileRepository implements ICatalogFileRepository {
  constructor(private readonly config: IConfigTool) {}

  public async writeCatalog(catalog: CatalogDto): Promise<void> {
    await this.write(this.config.catalogOutputPath(), `${JSON.stringify(catalog, null, 2)}\n`);
  }

  public async writePrerenderRoutes(routes: readonly string[]): Promise<void> {
    await this.write(this.config.prerenderRoutesPath(), `${routes.join('\n')}\n`);
  }

  private async write(path: string, content: string): Promise<void> {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content, 'utf8');
  }
}
