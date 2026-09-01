import { describe, expect, it, vi } from 'vitest';
import { CliEntry } from '../../../../infra/cli/cli_entry.ts';
import type { IGenerateCatalogCommand } from '../../../../interfaces/adapters/commands/i_generate_catalog_command.ts';
import type { IReportPublicationCommand } from '../../../../interfaces/adapters/commands/i_report_publication_command.ts';
import type { ILoggerTool } from '../../../../interfaces/infra/tools/i_logger_tool.ts';

const USO = 'uso: catalog | report <success|failure> [motivo]';

interface Dubles {
  readonly generateCatalog: IGenerateCatalogCommand;
  readonly reportPublication: IReportPublicationCommand;
  readonly logger: ILoggerTool;
}

function dubles(): Dubles {
  return {
    generateCatalog: { execute: vi.fn().mockResolvedValue(0) },
    reportPublication: { execute: vi.fn().mockResolvedValue(0) },
    logger: { info: vi.fn(), error: vi.fn() },
  };
}

function construir(d: Dubles): CliEntry {
  return new CliEntry(d.generateCatalog, d.reportPublication, d.logger);
}

describe('CliEntry', () => {
  it('deve acionar a geracao do catalogo quando o comando e catalog', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run(['catalog']);

    // Assert
    expect(d.generateCatalog.execute).toHaveBeenCalledTimes(1);
  });

  it('deve devolver o codigo do comando quando ele aborta', async () => {
    // Arrange
    const d = dubles();
    vi.mocked(d.generateCatalog.execute).mockResolvedValue(1);

    // Act
    const codigo = await construir(d).run(['catalog']);

    // Assert
    expect(codigo).toBe(1);
  });

  it('deve acionar o reporte com o desfecho e o motivo quando o comando e report', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run(['report', 'failure', 'catalogo', 'indisponivel']);

    // Assert
    expect(d.reportPublication.execute).toHaveBeenCalledExactlyOnceWith(
      'failure',
      'catalogo indisponivel',
    );
  });

  it('deve aceitar reporte de sucesso sem motivo quando nenhum e passado', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run(['report', 'success']);

    // Assert
    expect(d.reportPublication.execute).toHaveBeenCalledExactlyOnceWith('success', '');
  });

  it('deve recusar quando o desfecho do reporte e invalido', async () => {
    // Arrange
    const d = dubles();

    // Act
    const codigo = await construir(d).run(['report', 'talvez']);

    // Assert
    expect(codigo).toBe(2);
  });

  it('deve dizer o esperado quando o desfecho e invalido', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run(['report', 'talvez']);

    // Assert
    expect(d.logger.error).toHaveBeenCalledExactlyOnceWith('desfecho invalido', {
      received: 'talvez',
      expected: USO,
    });
  });

  it('deve recusar quando o reporte vem sem desfecho', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run(['report']);

    // Assert
    expect(d.logger.error).toHaveBeenCalledExactlyOnceWith('desfecho invalido', {
      received: null,
      expected: USO,
    });
  });

  it('deve recusar quando o comando e desconhecido', async () => {
    // Arrange
    const d = dubles();

    // Act
    const codigo = await construir(d).run(['publicar']);

    // Assert
    expect(codigo).toBe(2);
  });

  it('deve dizer o esperado quando nenhum comando e passado', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run([]);

    // Assert
    expect(d.logger.error).toHaveBeenCalledExactlyOnceWith('comando desconhecido', {
      received: null,
      expected: USO,
    });
  });

  it('deve nao acionar comando algum quando a entrada e invalida', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).run(['publicar']);

    // Assert
    expect(d.generateCatalog.execute).not.toHaveBeenCalled();
  });
});
