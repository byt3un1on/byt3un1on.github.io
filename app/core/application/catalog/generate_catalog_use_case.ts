import type { CatalogDto } from '../../domain/dtos/catalog_dto';
import { projectRoute, staticRoutes } from '../../domain/constants/site_routes_constants';
import type { IAssembleCatalogUseCase } from '../../../interfaces/core/application/catalog/i_assemble_catalog_use_case';
import type { IGenerateCatalogUseCase } from '../../../interfaces/core/application/catalog/i_generate_catalog_use_case';
import type { IValidateCurationUseCase } from '../../../interfaces/core/application/catalog/i_validate_curation_use_case';
import type { IGithubOrganizationClient } from '../../../interfaces/adapters/clients/i_github_organization_client';
import type { ICatalogFileRepository } from '../../../interfaces/adapters/repositories/i_catalog_file_repository';
import type { ICurationRepository } from '../../../interfaces/adapters/repositories/i_curation_repository';
import type { ILoggerTool } from '../../../interfaces/infra/tools/i_logger_tool';

/**
 * Orquestra a geracao do catalogo. Nao captura erro: falha de curadoria ou de
 * fonte sobe ate o comando, que e onde RF-14 vira codigo de saida.
 */
export class GenerateCatalogUseCase implements IGenerateCatalogUseCase {
  constructor(
    private readonly curationRepository: ICurationRepository,
    private readonly organizationClient: IGithubOrganizationClient,
    private readonly validateCuration: IValidateCurationUseCase,
    private readonly assembleCatalog: IAssembleCatalogUseCase,
    private readonly catalogFileRepository: ICatalogFileRepository,
    private readonly logger: ILoggerTool,
  ) {}

  public async execute(): Promise<CatalogDto> {
    const curation = await this.curationRepository.read();
    const repositories = await this.organizationClient.listRepositories();
    this.validateCuration.execute(
      curation,
      repositories.map((repository) => repository.name),
    );
    const catalog = this.assembleCatalog.execute(curation, repositories);
    await this.catalogFileRepository.writeCatalog(catalog);
    await this.catalogFileRepository.writePrerenderRoutes(this.routesOf(catalog));
    this.reportUncurated(
      curation.projects.flatMap((p) => p.repositories),
      repositories,
    );
    return catalog;
  }

  private routesOf(catalog: CatalogDto): readonly string[] {
    return [...staticRoutes(), ...catalog.projects.map((project) => projectRoute(project.slug))];
  }

  /** A curadoria e de inclusao explicita, entao esquecer um repositorio e mudo.
   *  O log torna a omissao visivel sem quebrar a publicacao. */
  private reportUncurated(
    curated: readonly string[],
    repositories: readonly { readonly name: string }[],
  ): void {
    const declared = new Set(curated);
    const missing = repositories.map((r) => r.name).filter((name) => !declared.has(name));
    if (missing.length > 0) {
      this.logger.info('repositorios fora da curadoria', { repositories: missing });
    }
  }
}
