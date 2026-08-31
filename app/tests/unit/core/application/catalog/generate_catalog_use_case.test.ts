import { describe, expect, it, vi } from 'vitest';
import { GenerateCatalogUseCase } from '../../../../../core/application/catalog/generate_catalog_use_case';
import type { CatalogDto } from '../../../../../core/domain/dtos/catalog_dto';
import type { CurationDto } from '../../../../../core/domain/dtos/curation_dto';
import {
  type CodeRepository,
  createCodeRepository,
} from '../../../../../core/domain/entities/code_repository';
import { CurationValidationError } from '../../../../../core/domain/errors/curation_validation_error';
import type { IGithubOrganizationClient } from '../../../../../interfaces/adapters/clients/i_github_organization_client';
import type { ICatalogFileRepository } from '../../../../../interfaces/adapters/repositories/i_catalog_file_repository';
import type { ICurationRepository } from '../../../../../interfaces/adapters/repositories/i_curation_repository';
import type { IAssembleCatalogUseCase } from '../../../../../interfaces/core/application/catalog/i_assemble_catalog_use_case';
import type { IValidateCurationUseCase } from '../../../../../interfaces/core/application/catalog/i_validate_curation_use_case';
import type { ILoggerTool } from '../../../../../interfaces/infra/tools/i_logger_tool';

const CURACAO: CurationDto = {
  projects: [
    {
      slug: 'shortsmaker',
      name: 'Shortsmaker',
      summary: 'Pipeline de videos curtos.',
      highlighted: false,
      repositories: ['shortsmaker-api'],
    },
  ],
};

const CATALOGO: CatalogDto = {
  generatedAt: '2026-08-31T09:00:00.000Z',
  projects: [
    {
      slug: 'shortsmaker',
      name: 'Shortsmaker',
      summary: 'Pipeline de videos curtos.',
      highlighted: false,
      technologies: ['Python'],
      lastActivityAt: '2026-01-14T05:31:18.000Z',
      homepage: null,
      repositories: [
        {
          name: 'shortsmaker-api',
          url: 'https://github.com/byt3un1on/shortsmaker-api',
          description: null,
          technology: 'Python',
          homepage: null,
          lastActivityAt: '2026-01-14T05:31:18.000Z',
        },
      ],
    },
  ],
};

function repositorio(name: string): CodeRepository {
  return createCodeRepository({
    name,
    url: `https://github.com/byt3un1on/${name}`,
    description: null,
    technology: 'Python',
    homepage: null,
    lastActivityAt: '2026-01-14T05:31:18Z',
    isPrivate: false,
    isArchived: false,
    hasCommits: true,
  });
}

interface Dublês {
  readonly curationRepository: ICurationRepository;
  readonly organizationClient: IGithubOrganizationClient;
  readonly validateCuration: IValidateCurationUseCase;
  readonly assembleCatalog: IAssembleCatalogUseCase;
  readonly catalogFileRepository: ICatalogFileRepository;
  readonly logger: ILoggerTool;
}

function dubles(
  repositories: readonly CodeRepository[] = [repositorio('shortsmaker-api')],
): Dublês {
  return {
    curationRepository: { read: vi.fn().mockResolvedValue(CURACAO) },
    organizationClient: { listRepositories: vi.fn().mockResolvedValue(repositories) },
    validateCuration: { execute: vi.fn() },
    assembleCatalog: { execute: vi.fn().mockReturnValue(CATALOGO) },
    catalogFileRepository: {
      writeCatalog: vi.fn().mockResolvedValue(undefined),
      writePrerenderRoutes: vi.fn().mockResolvedValue(undefined),
    },
    logger: { info: vi.fn(), error: vi.fn() },
  };
}

function construir(d: Dublês): GenerateCatalogUseCase {
  return new GenerateCatalogUseCase(
    d.curationRepository,
    d.organizationClient,
    d.validateCuration,
    d.assembleCatalog,
    d.catalogFileRepository,
    d.logger,
  );
}

describe('GenerateCatalogUseCase', () => {
  it('deve devolver o catalogo montado quando o fluxo conclui', async () => {
    // Arrange
    const d = dubles();

    // Act
    const catalogo = await construir(d).execute();

    // Assert
    expect(catalogo).toBe(CATALOGO);
  });

  it('deve ler a curadoria exatamente uma vez quando executa', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).execute();

    // Assert
    expect(d.curationRepository.read).toHaveBeenCalledTimes(1);
  });

  it('deve buscar os repositorios da organizacao exatamente uma vez quando executa', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).execute();

    // Assert
    expect(d.organizationClient.listRepositories).toHaveBeenCalledTimes(1);
  });

  it('deve validar a curadoria contra os nomes disponiveis quando executa', async () => {
    // Arrange
    const d = dubles([repositorio('shortsmaker-api'), repositorio('templates-library')]);

    // Act
    await construir(d).execute();

    // Assert
    expect(d.validateCuration.execute).toHaveBeenCalledWith(CURACAO, [
      'shortsmaker-api',
      'templates-library',
    ]);
  });

  it('deve montar o catalogo com a curadoria e os repositorios quando executa', async () => {
    // Arrange
    const repositorios = [repositorio('shortsmaker-api')];
    const d = dubles(repositorios);

    // Act
    await construir(d).execute();

    // Assert
    expect(d.assembleCatalog.execute).toHaveBeenCalledWith(CURACAO, repositorios);
  });

  it('deve gravar o catalogo exatamente uma vez quando executa', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).execute();

    // Assert
    expect(d.catalogFileRepository.writeCatalog).toHaveBeenCalledExactlyOnceWith(CATALOGO);
  });

  it('deve gravar as rotas fixas e a de cada projeto quando executa', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).execute();

    // Assert
    expect(d.catalogFileRepository.writePrerenderRoutes).toHaveBeenCalledExactlyOnceWith([
      '/',
      '/projetos',
      '/404',
      '/projetos/shortsmaker',
    ]);
  });

  it('deve registrar os repositorios fora da curadoria quando algum sobra', async () => {
    // Arrange
    const d = dubles([repositorio('shortsmaker-api'), repositorio('shared-claude-plugin')]);

    // Act
    await construir(d).execute();

    // Assert
    expect(d.logger.info).toHaveBeenCalledExactlyOnceWith('repositorios fora da curadoria', {
      repositories: ['shared-claude-plugin'],
    });
  });

  it('deve calar quando todo repositorio da organizacao esta na curadoria', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).execute();

    // Assert
    expect(d.logger.info).not.toHaveBeenCalled();
  });

  it('deve deixar o erro de curadoria subir quando a validacao reprova', async () => {
    // Arrange
    const d = dubles();
    vi.mocked(d.validateCuration.execute).mockImplementation(() => {
      throw new CurationValidationError('entrada sem resumo escrito', ['shortsmaker']);
    });

    // Act
    const act = async (): Promise<CatalogDto> => construir(d).execute();

    // Assert
    await expect(act).rejects.toThrow(CurationValidationError);
  });

  it('deve nao gravar nada quando a validacao reprova', async () => {
    // Arrange
    const d = dubles();
    vi.mocked(d.validateCuration.execute).mockImplementation(() => {
      throw new CurationValidationError('entrada sem resumo escrito', ['shortsmaker']);
    });

    // Act
    await construir(d)
      .execute()
      .catch(() => undefined);

    // Assert
    expect(d.catalogFileRepository.writeCatalog).not.toHaveBeenCalled();
  });

  it('deve deixar a falha da fonte subir quando a organizacao nao responde', async () => {
    // Arrange
    const d = dubles();
    vi.mocked(d.organizationClient.listRepositories).mockRejectedValue(
      new Error('rede indisponivel'),
    );

    // Act
    const act = async (): Promise<CatalogDto> => construir(d).execute();

    // Assert
    await expect(act).rejects.toThrow('rede indisponivel');
  });
});
