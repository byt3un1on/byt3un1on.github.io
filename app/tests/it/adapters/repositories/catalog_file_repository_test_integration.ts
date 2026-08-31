import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CatalogFileRepository } from '../../../../adapters/repositories/catalog_file_repository.ts';
import { parseCatalogDto, type CatalogDto } from '../../../../core/domain/dtos/catalog_dto.ts';
import { ConfigTool } from '../../../../infra/tools/config_tool.ts';

let diretorio = '';

const CATALOGO: CatalogDto = {
  generatedAt: '2026-08-31T09:00:00.000Z',
  projects: [
    {
      slug: 'shortsmaker',
      name: 'Shortsmaker',
      summary: 'Pipeline de videos curtos.',
      highlighted: true,
      technologies: ['Python', 'TypeScript'],
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

function repository(): CatalogFileRepository {
  return new CatalogFileRepository(
    new ConfigTool({
      CATALOG_OUTPUT_PATH: join(diretorio, 'gerado', 'catalog.generated.json'),
      PRERENDER_ROUTES_PATH: join(diretorio, 'gerado', 'prerender-routes.txt'),
    }),
  );
}

describe('CatalogFileRepository contra o sistema de arquivos real', () => {
  beforeEach(async () => {
    diretorio = await mkdtemp(join(tmpdir(), 'catalogo-'));
  });

  afterEach(async () => {
    await rm(diretorio, { recursive: true, force: true });
  });

  it('deve criar o diretorio de saida quando ele ainda nao existe', async () => {
    // Arrange
    const destino = join(diretorio, 'gerado', 'catalog.generated.json');

    // Act
    await repository().writeCatalog(CATALOGO);

    // Assert
    await expect(readFile(destino, 'utf8')).resolves.toContain('shortsmaker');
  });

  it('deve gravar um catalogo que o proprio sitio consegue reler', async () => {
    // Arrange
    const destino = join(diretorio, 'gerado', 'catalog.generated.json');
    await repository().writeCatalog(CATALOGO);

    // Act
    const relido = parseCatalogDto(JSON.parse(await readFile(destino, 'utf8')));

    // Assert
    expect(relido).toEqual(CATALOGO);
  });

  it('deve gravar a lista de rotas uma por linha quando solicitada', async () => {
    // Arrange
    const destino = join(diretorio, 'gerado', 'prerender-routes.txt');

    // Act
    await repository().writePrerenderRoutes(['/', '/projetos', '/projetos/shortsmaker']);

    // Assert
    await expect(readFile(destino, 'utf8')).resolves.toBe('/\n/projetos\n/projetos/shortsmaker\n');
  });

  it('deve sobrescrever o catalogo anterior quando gravado duas vezes', async () => {
    // Arrange
    const destino = join(diretorio, 'gerado', 'catalog.generated.json');
    await repository().writeCatalog(CATALOGO);

    // Act
    await repository().writeCatalog({ generatedAt: '2026-09-01T00:00:00.000Z', projects: [] });

    // Assert
    await expect(readFile(destino, 'utf8')).resolves.not.toContain('shortsmaker');
  });
});
