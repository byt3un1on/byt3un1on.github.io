import { CatalogSourceError } from '../errors/catalog_source_error.ts';

/** Repositorio como o catalogo gerado o registra. */
export interface CatalogRepositoryDto {
  readonly name: string;
  readonly url: string;
  readonly description: string | null;
  readonly technology: string | null;
  readonly homepage: string | null;
  readonly lastActivityAt: string;
}

/** Projeto como o catalogo gerado o registra, ja com o derivado do RF-07. */
export interface CatalogProjectDto {
  readonly slug: string;
  readonly name: string;
  readonly summary: string;
  readonly highlighted: boolean;
  readonly technologies: readonly string[];
  readonly lastActivityAt: string;
  readonly homepage: string | null;
  readonly repositories: readonly CatalogRepositoryDto[];
}

export interface CatalogDto {
  readonly generatedAt: string;
  readonly projects: readonly CatalogProjectDto[];
}

const RESOURCE = 'data/catalog.generated.json';

function asRecord(value: unknown, what: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new CatalogSourceError(
      `${what} esperado objeto, recebido ${Array.isArray(value) ? 'array' : typeof value}`,
      RESOURCE,
    );
  }
  return value as Record<string, unknown>;
}

function asString(source: Record<string, unknown>, field: string, what: string): string {
  const raw = source[field];
  if (typeof raw !== 'string') {
    throw new CatalogSourceError(
      `${what}: "${field}" esperado string, recebido ${typeof raw}`,
      RESOURCE,
    );
  }
  return raw;
}

function asNullableString(source: Record<string, unknown>, field: string): string | null {
  const raw = source[field];
  return typeof raw === 'string' ? raw : null;
}

function asStringList(
  source: Record<string, unknown>,
  field: string,
  what: string,
): readonly string[] {
  const raw = source[field];
  if (!Array.isArray(raw) || !raw.every((item): item is string => typeof item === 'string')) {
    throw new CatalogSourceError(`${what}: "${field}" esperado lista de textos`, RESOURCE);
  }
  return Object.freeze([...raw]);
}

function parseRepository(value: unknown): CatalogRepositoryDto {
  const source = asRecord(value, 'repositorio');
  return {
    name: asString(source, 'name', 'repositorio'),
    url: asString(source, 'url', 'repositorio'),
    description: asNullableString(source, 'description'),
    technology: asNullableString(source, 'technology'),
    homepage: asNullableString(source, 'homepage'),
    lastActivityAt: asString(source, 'lastActivityAt', 'repositorio'),
  };
}

function parseProject(value: unknown): CatalogProjectDto {
  const source = asRecord(value, 'projeto');
  const repositories = source['repositories'];
  if (!Array.isArray(repositories) || repositories.length === 0) {
    throw new CatalogSourceError('projeto: "repositories" esperado lista nao vazia', RESOURCE);
  }
  return {
    slug: asString(source, 'slug', 'projeto'),
    name: asString(source, 'name', 'projeto'),
    summary: asString(source, 'summary', 'projeto'),
    highlighted: source['highlighted'] === true,
    technologies: asStringList(source, 'technologies', 'projeto'),
    lastActivityAt: asString(source, 'lastActivityAt', 'projeto'),
    homepage: asNullableString(source, 'homepage'),
    repositories: Object.freeze(repositories.map(parseRepository)),
  };
}

/**
 * Le o catalogo gerado por `make catalog`. Falha aqui significa artefato de
 * build corrompido, e nao erro de visitante: o sitio nunca busca catalogo.
 *
 * @example parseCatalogDto(JSON.parse(conteudo))
 */
export function parseCatalogDto(value: unknown): CatalogDto {
  const source = asRecord(value, 'catalogo');
  const projects = source['projects'];
  if (!Array.isArray(projects)) {
    throw new CatalogSourceError(
      `catalogo: "projects" esperado lista, recebido ${typeof projects}`,
      RESOURCE,
    );
  }
  return {
    generatedAt: asString(source, 'generatedAt', 'catalogo'),
    projects: Object.freeze(projects.map(parseProject)),
  };
}
