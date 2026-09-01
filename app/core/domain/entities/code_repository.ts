/** Um repositorio da organizacao, como a vitrine o conhece (RF-03). */
export interface CodeRepository {
  readonly name: string;
  readonly url: string;
  readonly description: string | null;
  readonly technology: string | null;
  readonly homepage: string | null;
  readonly lastActivityAt: Date;
  readonly isPrivate: boolean;
  readonly isArchived: boolean;
  readonly hasCommits: boolean;
}

export type CodeRepositoryProps = Omit<CodeRepository, 'lastActivityAt'> & {
  readonly lastActivityAt: Date | string;
};

function requireText(value: string, field: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(
      `${field} invalido: recebido ${JSON.stringify(value)}, esperado texto nao vazio`,
    );
  }
  return trimmed;
}

function requireDate(value: Date | string, field: string): Date {
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${field} invalido: recebido ${JSON.stringify(value)}, esperado data valida`);
  }
  return parsed;
}

/**
 * Constroi o repositorio validando a borda, de modo que nenhuma camada acima
 * precise reconferir nome, endereco ou data.
 *
 * @example createCodeRepository({ name: 'shortsmaker-api', url: '...', ... })
 */
export function createCodeRepository(props: CodeRepositoryProps): CodeRepository {
  return Object.freeze({
    ...props,
    name: requireText(props.name, 'name'),
    url: requireText(props.url, 'url'),
    lastActivityAt: requireDate(props.lastActivityAt, 'lastActivityAt'),
  });
}

/**
 * RF-06: privado, arquivado ou sem commit nao aparece na vitrine, ainda que a
 * curadoria o declare. E rede de seguranca sobre a curadoria, nao alternativa.
 */
export function isEligibleForShowcase(repository: CodeRepository): boolean {
  return !repository.isPrivate && !repository.isArchived && repository.hasCommits;
}
