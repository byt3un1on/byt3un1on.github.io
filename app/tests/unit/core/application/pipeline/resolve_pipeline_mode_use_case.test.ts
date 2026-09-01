import { describe, expect, it, vi } from 'vitest';
import { ResolvePipelineModeUseCase } from '../../../../../core/application/pipeline/resolve_pipeline_mode_use_case.ts';
import type { IConfigTool } from '../../../../../interfaces/infra/tools/i_config_tool.ts';

interface Dubles {
  readonly config: IConfigTool;
}

function dubles(modo: string | null = null, marcacoes: string | null = null): Dubles {
  return {
    config: {
      githubApiBaseUrl: vi.fn().mockReturnValue('http://wiremock:8080'),
      organizationLogin: vi.fn().mockReturnValue('byt3un1on'),
      githubToken: vi.fn().mockReturnValue(null),
      curationPath: vi.fn().mockReturnValue('data/curation.json'),
      catalogOutputPath: vi.fn().mockReturnValue('data/catalog.json'),
      prerenderRoutesPath: vi.fn().mockReturnValue('routes.txt'),
      siteRepositoryFullName: vi.fn().mockReturnValue('byt3un1on/byt3un1on.github.io'),
      pipelineMode: vi.fn().mockReturnValue(modo),
      pipelineModeLabel: vi.fn().mockReturnValue(marcacoes),
      runSummaryPath: vi.fn().mockReturnValue(null),
      pipelineResults: vi.fn().mockReturnValue(null),
      summaryJob: vi.fn().mockReturnValue(null),
      summaryStatus: vi.fn().mockReturnValue(null),
      summaryDetail: vi.fn().mockReturnValue(null),
    },
  };
}

function construir(d: Dubles): ResolvePipelineModeUseCase {
  return new ResolvePipelineModeUseCase(d.config);
}

describe('ResolvePipelineModeUseCase', () => {
  it('deve devolver manual quando a marcacao manual e a unica da Pull Request', () => {
    // Arrange
    const d = dubles(null, 'manual');

    // Act
    const modo = construir(d).execute();

    // Assert
    expect(modo).toBe('manual');
  });

  it('deve devolver manual quando a marcacao manual acompanha outras marcacoes', () => {
    // Arrange
    const d = dubles(null, 'documentacao,manual,urgente');

    // Act
    const modo = construir(d).execute();

    // Assert
    expect(modo).toBe('manual');
  });

  it('deve devolver manual quando a marcacao vem com espacos nas pontas e em maiusculas', () => {
    // Arrange
    const d = dubles(null, 'urgente,  MANUAL  ');

    // Act
    const modo = construir(d).execute();

    // Assert
    expect(modo).toBe('manual');
  });

  it('deve devolver manual quando a marcacao sobrepoe a configuracao automatica', () => {
    // Arrange
    const d = dubles('automatico', 'manual');

    // Act
    const modo = construir(d).execute();

    // Assert
    expect(modo).toBe('manual');
  });

  it('deve nao consultar a configuracao quando a marcacao ja forca o modo manual', () => {
    // Arrange
    const d = dubles('automatico', 'manual');

    // Act
    construir(d).execute();

    // Assert
    expect(d.config.pipelineMode).not.toHaveBeenCalled();
  });

  it('deve devolver manual quando a marcacao e irrelevante e a configuracao diz manual', () => {
    // Arrange
    const d = dubles('manual', 'urgente');

    // Act
    const modo = construir(d).execute();

    // Assert
    expect(modo).toBe('manual');
  });

  it('deve devolver automatico quando a configuracao diz automatico e nao ha marcacao', () => {
    // Arrange
    const d = dubles('automatico', null);

    // Act
    const modo = construir(d).execute();

    // Assert
    expect(modo).toBe('automatico');
  });

  it('deve devolver automatico quando a configuracao traz manual com espaco e maiusculas', () => {
    // Arrange
    const d = dubles('MANUAL ', null);

    // Act
    const modo = construir(d).execute();

    // Assert
    expect(modo).toBe('automatico');
  });

  it('deve devolver automatico quando a configuracao traz um valor que nao e modo', () => {
    // Arrange
    const d = dubles('prod', null);

    // Act
    const modo = construir(d).execute();

    // Assert
    expect(modo).toBe('automatico');
  });

  it('deve devolver automatico quando a configuracao e texto vazio', () => {
    // Arrange
    const d = dubles('', null);

    // Act
    const modo = construir(d).execute();

    // Assert
    expect(modo).toBe('automatico');
  });

  it('deve devolver automatico quando a marcacao e a configuracao sao nulas', () => {
    // Arrange
    const d = dubles(null, null);

    // Act
    const modo = construir(d).execute();

    // Assert
    expect(modo).toBe('automatico');
  });

  it('deve devolver automatico quando a marcacao e texto vazio e a configuracao e nula', () => {
    // Arrange
    const d = dubles(null, '');

    // Act
    const modo = construir(d).execute();

    // Assert
    expect(modo).toBe('automatico');
  });

  it('deve consultar as marcacoes uma unica vez e sem parametro quando resolve o modo', () => {
    // Arrange
    const d = dubles('automatico', null);

    // Act
    construir(d).execute();

    // Assert
    expect(d.config.pipelineModeLabel).toHaveBeenCalledExactlyOnceWith();
  });

  it('deve consultar a configuracao uma unica vez e sem parametro quando nao ha marcacao', () => {
    // Arrange
    const d = dubles('automatico', null);

    // Act
    construir(d).execute();

    // Assert
    expect(d.config.pipelineMode).toHaveBeenCalledExactlyOnceWith();
  });

  it('deve receber da configuracao o modo que ela declara quando resolve o modo', () => {
    // Arrange
    const d = dubles('manual', null);

    // Act
    construir(d).execute();

    // Assert
    expect(vi.mocked(d.config.pipelineMode)).toHaveReturnedWith('manual');
  });

  it('deve receber das marcacoes o texto que elas declaram quando resolve o modo', () => {
    // Arrange
    const d = dubles(null, 'urgente,manual');

    // Act
    construir(d).execute();

    // Assert
    expect(vi.mocked(d.config.pipelineModeLabel)).toHaveReturnedWith('urgente,manual');
  });
});
