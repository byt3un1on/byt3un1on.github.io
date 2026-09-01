import type { IGenerateCatalogCommand } from '../../interfaces/adapters/commands/i_generate_catalog_command.ts';
import type { IGenerateCatalogUseCase } from '../../interfaces/core/application/catalog/i_generate_catalog_use_case.ts';
import type { ILoggerTool } from '../../interfaces/infra/tools/i_logger_tool.ts';

/**
 * Alvo `make catalog`. E aqui que RF-14 vira codigo de saida: qualquer falha
 * — curadoria invalida ou fonte indisponivel — aborta a publicacao, e o fluxo
 * de CI para antes do build, preservando a versao anterior no ar.
 */
export class GenerateCatalogCommand implements IGenerateCatalogCommand {
  constructor(
    private readonly generateCatalog: IGenerateCatalogUseCase,
    private readonly logger: ILoggerTool,
  ) {}

  public async execute(): Promise<number> {
    try {
      const catalog = await this.generateCatalog.execute();
      this.logger.info('catalogo gerado', { projects: catalog.projects.length });
      return 0;
    } catch (error) {
      this.logger.error('publicacao abortada', {
        error: error instanceof Error ? error.name : 'Unknown',
        reason: error instanceof Error ? error.message : String(error),
      });
      return 1;
    }
  }
}
