import { describe, expect, it, vi } from 'vitest';
import { readFile } from 'node:fs/promises';
import { CurationRepository } from '../../../../adapters/repositories/curation_repository.ts';
import { CurationValidationError } from '../../../../core/domain/errors/curation_validation_error.ts';
import type { IConfigTool } from '../../../../interfaces/infra/tools/i_config_tool.ts';

vi.mock('node:fs/promises', () => ({ readFile: vi.fn() }));

function config(path = 'data/curation.json'): IConfigTool {
  return {
    githubApiBaseUrl: vi.fn(),
    organizationLogin: vi.fn(),
    githubToken: vi.fn(),
    curationPath: vi.fn().mockReturnValue(path),
    catalogOutputPath: vi.fn(),
    prerenderRoutesPath: vi.fn(),
    siteRepositoryFullName: vi.fn(),
  };
}

const VALIDA = JSON.stringify({
  projects: [
    {
      slug: 'shortsmaker',
      name: 'Shortsmaker',
      summary: 'Pipeline de videos curtos.',
      highlighted: false,
      repositories: ['shortsmaker-api'],
    },
  ],
});

describe('CurationRepository', () => {
  it('deve devolver a curadoria quando o arquivo e valido', async () => {
    // Arrange
    vi.mocked(readFile).mockResolvedValue(VALIDA);

    // Act
    const curadoria = await new CurationRepository(config()).read();

    // Assert
    expect(curadoria.projects.map((p) => p.slug)).toEqual(['shortsmaker']);
  });

  it('deve ler o caminho que a configuracao indica quando executa', async () => {
    // Arrange
    vi.mocked(readFile).mockResolvedValue(VALIDA);
    const caminho = 'tests/bdd/fixtures/curation/valida.json';

    // Act
    await new CurationRepository(config(caminho)).read();

    // Assert
    expect(readFile).toHaveBeenCalledWith(caminho, 'utf8');
  });

  it('deve recusar quando o arquivo nao e JSON valido', async () => {
    // Arrange
    vi.mocked(readFile).mockResolvedValue('{ nao e json');

    // Act
    const act = async (): Promise<unknown> => new CurationRepository(config()).read();

    // Assert
    await expect(act).rejects.toThrow(CurationValidationError);
  });

  it('deve nomear o arquivo defeituoso quando o JSON e invalido', async () => {
    // Arrange
    vi.mocked(readFile).mockResolvedValue('{ nao e json');

    // Act
    const act = async (): Promise<unknown> => new CurationRepository(config()).read();

    // Assert
    await expect(act).rejects.toThrow('arquivo data/curation.json nao e JSON valido');
  });

  it('deve deixar o erro de forma subir quando a curadoria tem estrutura errada', async () => {
    // Arrange
    vi.mocked(readFile).mockResolvedValue(JSON.stringify({ projects: 'nenhum' }));

    // Act
    const act = async (): Promise<unknown> => new CurationRepository(config()).read();

    // Assert
    await expect(act).rejects.toThrow('campo "projects" esperado lista, recebido string');
  });

  it('deve propagar a falha quando o arquivo nao existe', async () => {
    // Arrange
    vi.mocked(readFile).mockRejectedValue(new Error('ENOENT: no such file'));

    // Act
    const act = async (): Promise<unknown> => new CurationRepository(config()).read();

    // Assert
    await expect(act).rejects.toThrow('ENOENT: no such file');
  });
});
