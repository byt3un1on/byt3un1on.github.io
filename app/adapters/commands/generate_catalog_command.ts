import { COMMUNITY_INVITE_URL } from '../../core/domain/constants/community_space_constants.ts';
import type { IGenerateCatalogCommand } from '../../interfaces/adapters/commands/i_generate_catalog_command.ts';
import type { IValidateCommunityInviteUseCase } from '../../interfaces/core/application/community/i_validate_community_invite_use_case.ts';
import type { IGenerateCatalogUseCase } from '../../interfaces/core/application/catalog/i_generate_catalog_use_case.ts';
import type { ILoggerTool } from '../../interfaces/infra/tools/i_logger_tool.ts';

/**
 * Alvo `make catalog`. E aqui que RF-14 vira codigo de saida: qualquer falha
 * — curadoria invalida, convite de comunidade invalido ou fonte indisponivel —
 * aborta a publicacao, e o fluxo de CI para antes do build, preservando a
 * versao anterior no ar.
 *
 * O convite entra neste passo, e nao em alvo proprio, porque este ja e o unico
 * ponto que roda antes do build em todos os fluxos e cujo significado e
 * "dado declarado esta integro" (RF-10).
 */
export class GenerateCatalogCommand implements IGenerateCatalogCommand {
  constructor(
    private readonly generateCatalog: IGenerateCatalogUseCase,
    private readonly validateCommunityInvite: IValidateCommunityInviteUseCase,
    private readonly logger: ILoggerTool,
  ) {}

  public async execute(): Promise<number> {
    try {
      this.validateCommunityInvite.execute(COMMUNITY_INVITE_URL);
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
