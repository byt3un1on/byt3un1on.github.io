import { describe, expect, it, vi } from 'vitest';
import { mkdir, writeFile } from 'node:fs/promises';
import { CatalogFileRepository } from '../../../../adapters/repositories/catalog_file_repository.ts';
import type { CatalogDto } from '../../../../core/domain/dtos/catalog_dto.ts';
import type { IConfigTool } from '../../../../interfaces/infra/tools/i_config_tool.ts';

vi.mock('node:fs/promises', () => ({ mkdir: vi.fn(), writeFile: vi.fn() }));

function config(): IConfigTool {
  return {
    githubApiBaseUrl: vi.fn(),
    organizationLogin: vi.fn(),
    githubToken: vi.fn(),
    curationPath: vi.fn(),
    catalogOutputPath: vi.fn().mockReturnValue('data/catalog.generated.json'),
    prerenderRoutesPath: vi.fn().mockReturnValue('data/prerender-routes.txt'),
    siteRepositoryFullName: vi.fn(),
    pipelineMode: vi.fn().mockReturnValue(null),
    pipelineModeLabel: vi.fn().mockReturnValue(null),
    runSummaryPath: vi.fn().mockReturnValue(null),
    pipelineResults: vi.fn().mockReturnValue(null),
    summaryJob: vi.fn().mockReturnValue(null),
    summaryStatus: vi.fn().mockReturnValue(null),
    summaryDetail: vi.fn().mockReturnValue(null),
  };
}

const CATALOGO: CatalogDto = { generatedAt: '2026-08-31T09:00:00.000Z', projects: [] };

describe('CatalogFileRepository', () => {
  it('deve gravar o catalogo em JSON identado quando solicitado', async () => {
    // Arrange
    const repository = new CatalogFileRepository(config());

    // Act
    await repository.writeCatalog(CATALOGO);

    // Assert
    expect(writeFile).toHaveBeenCalledWith(
      'data/catalog.generated.json',
      `${JSON.stringify(CATALOGO, null, 2)}\n`,
      'utf8',
    );
  });

  it('deve garantir o diretorio antes de gravar o catalogo', async () => {
    // Arrange
    const repository = new CatalogFileRepository(config());

    // Act
    await repository.writeCatalog(CATALOGO);

    // Assert
    expect(mkdir).toHaveBeenCalledWith('data', { recursive: true });
  });

  it('deve gravar uma rota por linha quando ha varias', async () => {
    // Arrange
    const repository = new CatalogFileRepository(config());

    // Act
    await repository.writePrerenderRoutes(['/', '/projetos', '/projetos/shortsmaker']);

    // Assert
    expect(writeFile).toHaveBeenCalledWith(
      'data/prerender-routes.txt',
      '/\n/projetos\n/projetos/shortsmaker\n',
      'utf8',
    );
  });

  it('deve gravar arquivo com apenas a quebra final quando nao ha rota alguma', async () => {
    // Arrange
    const repository = new CatalogFileRepository(config());

    // Act
    await repository.writePrerenderRoutes([]);

    // Assert
    expect(writeFile).toHaveBeenCalledWith('data/prerender-routes.txt', '\n', 'utf8');
  });
});
