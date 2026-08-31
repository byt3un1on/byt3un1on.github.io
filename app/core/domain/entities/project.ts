import type { CodeRepository } from './code_repository';

/**
 * Um item do catalogo. Pode reunir varios repositorios (RF-07), e nesse caso as
 * tecnologias e a atividade sao derivadas do conjunto, nunca escolhidas a dedo.
 */
export interface Project {
  readonly slug: string;
  readonly name: string;
  readonly summary: string;
  readonly highlighted: boolean;
  readonly repositories: readonly CodeRepository[];
}

function requireText(value: string, field: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(
      `${field} invalido: recebido ${JSON.stringify(value)}, esperado texto nao vazio`,
    );
  }
  return trimmed;
}

/**
 * @example createProject({ slug: 'shortsmaker', name: 'Shortsmaker', ... })
 */
export function createProject(props: Project): Project {
  if (props.repositories.length === 0) {
    throw new Error(
      `repositories invalido: recebido lista vazia, esperado ao menos um repositorio em "${props.slug}"`,
    );
  }
  return Object.freeze({
    ...props,
    slug: requireText(props.slug, 'slug'),
    name: requireText(props.name, 'name'),
    summary: requireText(props.summary, 'summary'),
    repositories: Object.freeze([...props.repositories]),
  });
}

/** RF-07: uniao das tecnologias dos repositorios, sem repeticao e em ordem estavel. */
export function projectTechnologies(project: Project): readonly string[] {
  const found = project.repositories
    .map((repository) => repository.technology)
    .filter((technology): technology is string => technology !== null);
  return Object.freeze([...new Set(found)].sort((a, b) => a.localeCompare(b)));
}

/** RF-07: a atividade do projeto e a do repositorio mexido por ultimo. */
export function projectLastActivityAt(project: Project): Date {
  const instants = project.repositories.map((repository) => repository.lastActivityAt.getTime());
  return new Date(Math.max(...instants));
}

/** RF-09: o endereco publicado, quando algum repositorio do projeto tiver um. */
export function projectHomepage(project: Project): string | null {
  const found = project.repositories.find((repository) => repository.homepage !== null);
  return found?.homepage ?? null;
}
