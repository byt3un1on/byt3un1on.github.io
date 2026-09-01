import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CurationRepository } from '../../../../adapters/repositories/curation_repository.ts';
import { CurationValidationError } from '../../../../core/domain/errors/curation_validation_error.ts';
import { ConfigTool } from '../../../../infra/tools/config_tool.ts';

let diretorio = '';

function repository(arquivo: string): CurationRepository {
  return new CurationRepository(new ConfigTool({ CURATION_PATH: join(diretorio, arquivo) }));
}

async function gravar(arquivo: string, conteudo: string): Promise<void> {
  await writeFile(join(diretorio, arquivo), conteudo, 'utf8');
}

describe('CurationRepository contra o sistema de arquivos real', () => {
  beforeEach(async () => {
    diretorio = await mkdtemp(join(tmpdir(), 'curadoria-'));
  });

  afterEach(async () => {
    await rm(diretorio, { recursive: true, force: true });
  });

  it('deve ler a curadoria do disco quando o arquivo e valido', async () => {
    // Arrange
    await gravar(
      'valida.json',
      JSON.stringify({
        projects: [
          {
            slug: 'shortsmaker',
            name: 'Shortsmaker',
            summary: 'Pipeline de videos curtos.',
            highlighted: true,
            repositories: ['shortsmaker-api'],
          },
        ],
      }),
    );

    // Act
    const curadoria = await repository('valida.json').read();

    // Assert
    expect(curadoria.projects[0]).toMatchObject({ slug: 'shortsmaker', highlighted: true });
  });

  it('deve recusar quando o arquivo do disco nao e JSON valido', async () => {
    // Arrange
    await gravar('quebrada.json', '{ isto nao fecha');

    // Act
    const act = async (): Promise<unknown> => repository('quebrada.json').read();

    // Assert
    await expect(act).rejects.toThrow(CurationValidationError);
  });

  it('deve recusar quando a estrutura do arquivo esta errada', async () => {
    // Arrange
    await gravar('estrutura.json', JSON.stringify({ projects: { shortsmaker: {} } }));

    // Act
    const act = async (): Promise<unknown> => repository('estrutura.json').read();

    // Assert
    await expect(act).rejects.toThrow('campo "projects" esperado lista, recebido object');
  });

  it('deve propagar a falha quando o arquivo nao existe no disco', async () => {
    // Arrange
    const inexistente = 'nao-existe.json';

    // Act
    const act = async (): Promise<unknown> => repository(inexistente).read();

    // Assert
    await expect(act).rejects.toThrow(/ENOENT/);
  });
});
