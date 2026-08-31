import { CurationValidationError } from '../errors/curation_validation_error';

/**
 * Uma entrada de curadoria (RF-04). A ordem no arquivo e a ordem na vitrine —
 * nao ha campo de ordenacao, porque a posicao ja diz tudo.
 */
export interface CurationProjectDto {
  readonly slug: string;
  readonly name: string;
  readonly summary: string;
  readonly highlighted: boolean;
  readonly repositories: readonly string[];
}

export interface CurationDto {
  readonly projects: readonly CurationProjectDto[];
}

function fail(reason: string, entries: readonly string[] = []): never {
  throw new CurationValidationError(reason, entries);
}

function readString(source: Record<string, unknown>, field: string, slug: string): string {
  const raw = source[field];
  if (typeof raw !== 'string') {
    fail(`campo "${field}" esperado string, recebido ${typeof raw}`, [slug]);
  }
  return raw;
}

function readRepositories(source: Record<string, unknown>, slug: string): readonly string[] {
  const raw = source['repositories'];
  if (!Array.isArray(raw) || raw.length === 0) {
    fail('campo "repositories" esperado lista nao vazia', [slug]);
  }
  if (!raw.every((item): item is string => typeof item === 'string')) {
    fail('campo "repositories" esperado lista de textos', [slug]);
  }
  return Object.freeze([...raw]);
}

function parseProject(value: unknown, index: number): CurationProjectDto {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    fail(`entrada na posicao ${index} esperada objeto`);
  }
  const source = value as Record<string, unknown>;
  const slug = typeof source['slug'] === 'string' ? source['slug'] : `posicao ${index}`;
  const highlighted = source['highlighted'];
  if (typeof highlighted !== 'boolean') {
    fail(`campo "highlighted" esperado booleano, recebido ${typeof highlighted}`, [slug]);
  }
  return {
    slug: readString(source, 'slug', slug),
    name: readString(source, 'name', slug),
    summary: readString(source, 'summary', slug),
    highlighted,
    repositories: readRepositories(source, slug),
  };
}

/**
 * Le a curadoria versionada, falhando na borda quando a forma esta errada.
 * Regra semantica — resumo vazio, referencia inexistente, repositorio repetido —
 * nao mora aqui: e do caso de uso que valida a curadoria contra a organizacao.
 *
 * @example parseCurationDto(JSON.parse(conteudo))
 */
export function parseCurationDto(value: unknown): CurationDto {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    fail(`raiz esperada objeto, recebido ${Array.isArray(value) ? 'array' : typeof value}`);
  }
  const projects = (value as Record<string, unknown>)['projects'];
  if (!Array.isArray(projects)) {
    fail(`campo "projects" esperado lista, recebido ${typeof projects}`);
  }
  return { projects: Object.freeze(projects.map(parseProject)) };
}
