/**
 * A fonte do catalogo nao respondeu como o contrato exige (RF-14). Carrega o
 * recurso pedido para que o log estruturado diga onde a publicacao parou.
 *
 * @example
 * throw new CatalogSourceError('resposta sem o campo name', '/orgs/byt3un1on/repos');
 */
export class CatalogSourceError extends Error {
  public readonly resource: string;

  constructor(reason: string, resource: string) {
    super(`catalogo indisponivel: ${reason}; recurso: ${resource}`);
    this.name = 'CatalogSourceError';
    this.resource = resource;
  }
}
