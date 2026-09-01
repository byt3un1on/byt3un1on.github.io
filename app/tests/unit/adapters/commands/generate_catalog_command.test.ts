import { describe, expect, it, vi } from 'vitest';
import { GenerateCatalogCommand } from '../../../../adapters/commands/generate_catalog_command.ts';
import type { CatalogDto } from '../../../../core/domain/dtos/catalog_dto.ts';
import { CurationValidationError } from '../../../../core/domain/errors/curation_validation_error.ts';
import type { IGenerateCatalogUseCase } from '../../../../interfaces/core/application/catalog/i_generate_catalog_use_case.ts';
import type { ILoggerTool } from '../../../../interfaces/infra/tools/i_logger_tool.ts';

const CATALOGO: CatalogDto = {
  generatedAt: '2026-08-31T09:00:00.000Z',
  projects: [
    {
      slug: 'shortsmaker',
      name: 'Shortsmaker',
      summary: 'resumo',
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

function logger(): ILoggerTool {
  return { info: vi.fn(), error: vi.fn() };
}

describe('GenerateCatalogCommand', () => {
  it('deve devolver zero quando o catalogo e gerado', async () => {
    // Arrange
    const useCase: IGenerateCatalogUseCase = { execute: vi.fn().mockResolvedValue(CATALOGO) };

    // Act
    const codigo = await new GenerateCatalogCommand(useCase, logger()).execute();

    // Assert
    expect(codigo).toBe(0);
  });

  it('deve registrar quantos projetos entraram quando o catalogo e gerado', async () => {
    // Arrange
    const useCase: IGenerateCatalogUseCase = { execute: vi.fn().mockResolvedValue(CATALOGO) };
    const log = logger();

    // Act
    await new GenerateCatalogCommand(useCase, log).execute();

    // Assert
    expect(log.info).toHaveBeenCalledExactlyOnceWith('catalogo gerado', { projects: 1 });
  });

  it('deve devolver codigo diferente de zero quando a curadoria e invalida', async () => {
    // Arrange
    const useCase: IGenerateCatalogUseCase = {
      execute: vi
        .fn()
        .mockRejectedValue(new CurationValidationError('entrada sem resumo escrito', ['a'])),
    };

    // Act
    const codigo = await new GenerateCatalogCommand(useCase, logger()).execute();

    // Assert
    expect(codigo).toBe(1);
  });

  it('deve registrar o motivo do aborto quando a geracao falha', async () => {
    // Arrange
    const useCase: IGenerateCatalogUseCase = {
      execute: vi
        .fn()
        .mockRejectedValue(new CurationValidationError('entrada sem resumo escrito', ['a'])),
    };
    const log = logger();

    // Act
    await new GenerateCatalogCommand(useCase, log).execute();

    // Assert
    expect(log.error).toHaveBeenCalledExactlyOnceWith('publicacao abortada', {
      error: 'CurationValidationError',
      reason: 'curadoria invalida: entrada sem resumo escrito; entradas afetadas: a',
    });
  });

  it('deve registrar falha desconhecida quando o erro nao e um Error', async () => {
    // Arrange
    const useCase: IGenerateCatalogUseCase = { execute: vi.fn().mockRejectedValue('pane') };
    const log = logger();

    // Act
    await new GenerateCatalogCommand(useCase, log).execute();

    // Assert
    expect(log.error).toHaveBeenCalledExactlyOnceWith('publicacao abortada', {
      error: 'Unknown',
      reason: 'pane',
    });
  });

  it('deve nao registrar sucesso quando a geracao falha', async () => {
    // Arrange
    const useCase: IGenerateCatalogUseCase = {
      execute: vi.fn().mockRejectedValue(new Error('rede')),
    };
    const log = logger();

    // Act
    await new GenerateCatalogCommand(useCase, log).execute();

    // Assert
    expect(log.info).not.toHaveBeenCalled();
  });
});
