import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { StaticCatalogRepository } from '../../../../adapters/repositories/static_catalog_repository.ts';

/**
 * Prova o contrato entre as duas metades do sistema: o que `make catalog`
 * grava, o sitio consegue ler. E o unico teste que exercita o artefato real.
 */
describe('StaticCatalogRepository contra o catalogo realmente gerado', () => {
  it('deve ler sem erro o artefato que make catalog gravou', async () => {
    // Arrange
    const conteudo = JSON.parse(await readFile('data/catalog.generated.json', 'utf8')) as unknown;

    // Act
    const catalogo = new StaticCatalogRepository(conteudo).load();

    // Assert
    expect(catalogo.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('deve entregar todo projeto com os campos que a vitrine exibe', async () => {
    // Arrange
    const conteudo = JSON.parse(await readFile('data/catalog.generated.json', 'utf8')) as unknown;

    // Act
    const catalogo = new StaticCatalogRepository(conteudo).load();

    // Assert
    const incompletos = catalogo.projects.filter(
      (p) => p.slug === '' || p.name === '' || p.summary === '' || p.repositories.length === 0,
    );
    expect(incompletos).toEqual([]);
  });

  it('deve entregar rota valida para cada projeto quando o catalogo tem itens', async () => {
    // Arrange
    const conteudo = JSON.parse(await readFile('data/catalog.generated.json', 'utf8')) as unknown;

    // Act
    const catalogo = new StaticCatalogRepository(conteudo).load();

    // Assert
    const slugsInvalidos = catalogo.projects.filter((p) => !/^[a-z0-9-]+$/.test(p.slug));
    expect(slugsInvalidos).toEqual([]);
  });
});
