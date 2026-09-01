import { GithubIssueClient } from '../../adapters/clients/github_issue_client.ts';
import { GithubOrganizationClient } from '../../adapters/clients/github_organization_client.ts';
import { GenerateCatalogCommand } from '../../adapters/commands/generate_catalog_command.ts';
import { ReportPublicationCommand } from '../../adapters/commands/report_publication_command.ts';
import { CatalogFileRepository } from '../../adapters/repositories/catalog_file_repository.ts';
import { CurationRepository } from '../../adapters/repositories/curation_repository.ts';
import { AssembleCatalogUseCase } from '../../core/application/catalog/assemble_catalog_use_case.ts';
import { GenerateCatalogUseCase } from '../../core/application/catalog/generate_catalog_use_case.ts';
import { ReportPublicationStatusUseCase } from '../../core/application/catalog/report_publication_status_use_case.ts';
import { ValidateCurationUseCase } from '../../core/application/catalog/validate_curation_use_case.ts';
import { CliEntry } from '../cli/cli_entry.ts';
import { ConfigTool } from '../tools/config_tool.ts';
import { LoggerTool } from '../tools/logger_tool.ts';
import type { ICliEntry } from '../../interfaces/infra/cli/i_cli_entry.ts';

/** Liga interface a implementacao. Sem condicao a decidir: cada interface tem
 *  uma implementacao so, ligada uma vez. Por isso e isento de cobertura. */
export function buildCliEntry(): ICliEntry {
  const config = new ConfigTool();
  const logger = new LoggerTool();
  const generateCatalog = new GenerateCatalogUseCase(
    new CurationRepository(config),
    new GithubOrganizationClient(config),
    new ValidateCurationUseCase(),
    new AssembleCatalogUseCase(),
    new CatalogFileRepository(config),
    logger,
  );
  const reportStatus = new ReportPublicationStatusUseCase(new GithubIssueClient(config), logger);
  return new CliEntry(
    new GenerateCatalogCommand(generateCatalog, logger),
    new ReportPublicationCommand(reportStatus, logger),
    logger,
  );
}
