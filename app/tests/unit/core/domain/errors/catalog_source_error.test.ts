import { describe, expect, it } from 'vitest';
import { CatalogSourceError } from '../../../../../core/domain/errors/catalog_source_error.ts';

describe('CatalogSourceError', () => {
  it('deve compor a mensagem com o motivo e o recurso quando construido', () => {
    // Arrange
    const reason = 'resposta sem o campo name';
    const resource = '/orgs/byt3un1on/repos';

    // Act
    const error = new CatalogSourceError(reason, resource);

    // Assert
    expect(error.message).toBe(
      'catalogo indisponivel: resposta sem o campo name; recurso: /orgs/byt3un1on/repos',
    );
  });

  it('deve expor o recurso pedido quando construido', () => {
    // Arrange
    const resource = '/repos/byt3un1on/shortsmaker-api/commits';

    // Act
    const error = new CatalogSourceError('tempo esgotado', resource);

    // Assert
    expect(error.resource).toBe(resource);
  });

  it('deve expor o nome proprio quando construido', () => {
    // Arrange
    const resource = '/orgs/byt3un1on/repos';

    // Act
    const error = new CatalogSourceError('rede indisponivel', resource);

    // Assert
    expect(error.name).toBe('CatalogSourceError');
  });

  it('deve continuar sendo um Error quando construido', () => {
    // Arrange
    const resource = '/orgs/byt3un1on/repos';

    // Act
    const error = new CatalogSourceError('rede indisponivel', resource);

    // Assert
    expect(error).toBeInstanceOf(Error);
  });
});
