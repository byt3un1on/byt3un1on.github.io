import { CatalogSourceError } from '../errors/catalog_source_error';

/** Recorte do repositorio como a API do GitHub o entrega (RF-02). */
export interface GithubRepositoryDto {
  readonly name: string;
  readonly description: string | null;
  readonly htmlUrl: string;
  readonly homepage: string | null;
  readonly language: string | null;
  readonly isPrivate: boolean;
  readonly isArchived: boolean;
  readonly pushedAt: string;
}

function asRecord(value: unknown, resource: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new CatalogSourceError(
      `esperado objeto, recebido ${Array.isArray(value) ? 'array' : typeof value}`,
      resource,
    );
  }
  return value as Record<string, unknown>;
}

function readString(source: Record<string, unknown>, field: string, resource: string): string {
  const raw = source[field];
  if (typeof raw !== 'string') {
    throw new CatalogSourceError(
      `campo "${field}" esperado string, recebido ${typeof raw}`,
      resource,
    );
  }
  return raw;
}

function readNullableString(
  source: Record<string, unknown>,
  field: string,
  resource: string,
): string | null {
  const raw = source[field];
  if (raw === null || raw === undefined) {
    return null;
  }
  if (typeof raw !== 'string') {
    throw new CatalogSourceError(
      `campo "${field}" esperado string ou nulo, recebido ${typeof raw}`,
      resource,
    );
  }
  return raw;
}

function readBoolean(source: Record<string, unknown>, field: string, resource: string): boolean {
  const raw = source[field];
  if (typeof raw !== 'boolean') {
    throw new CatalogSourceError(
      `campo "${field}" esperado booleano, recebido ${typeof raw}`,
      resource,
    );
  }
  return raw;
}

/**
 * Traduz a resposta crua da API para o recorte que o dominio conhece, falhando
 * na borda em vez de deixar dado malformado atravessar as camadas.
 *
 * @example parseGithubRepositoryDto(json, '/orgs/byt3un1on/repos')
 */
export function parseGithubRepositoryDto(value: unknown, resource: string): GithubRepositoryDto {
  const source = asRecord(value, resource);
  return {
    name: readString(source, 'name', resource),
    description: readNullableString(source, 'description', resource),
    htmlUrl: readString(source, 'html_url', resource),
    homepage: readNullableString(source, 'homepage', resource),
    language: readNullableString(source, 'language', resource),
    isPrivate: readBoolean(source, 'private', resource),
    isArchived: readBoolean(source, 'archived', resource),
    pushedAt: readString(source, 'pushed_at', resource),
  };
}
