import type { VersionBump } from '../enums/version_bump_enum.ts';

/** Versao semantica da esteira, no formato `vX.Y.Z` (RF-10). */
export interface SemanticVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

/**
 * Formato aceito: prefixo `v` opcional e tres inteiros nao negativos sem zero a
 * esquerda. Nada de sufixo de pre-lancamento ou metadado: a esteira publica
 * apenas versoes finais, e aceitar `-rc1` aqui abriria etiqueta que ninguem
 * sabe ordenar depois.
 */
const SEMANTIC_VERSION_PATTERN = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function createSemanticVersion(major: number, minor: number, patch: number): SemanticVersion {
  return Object.freeze({ major, minor, patch });
}

/**
 * Versao atribuida a primeira publicacao, quando o repositorio ainda nao tem
 * etiqueta alguma (RF-10, esclarecimento 11): a esteira estreia em 1.0.0, e nao
 * em 0.1.0, porque a vitrine ja nasce publicada.
 */
export const FIRST_SEMANTIC_VERSION: SemanticVersion = createSemanticVersion(1, 0, 0);

/**
 * Interpreta a etiqueta lida do repositorio, com ou sem o `v` inicial. Falha na
 * borda para que nenhum passo adiante precise reconferir o formato.
 *
 * @example parseSemanticVersion('v1.2.3') // { major: 1, minor: 2, patch: 3 }
 */
export function parseSemanticVersion(value: string): SemanticVersion {
  const match = SEMANTIC_VERSION_PATTERN.exec(value);
  if (match === null) {
    throw new Error(
      `versao invalida: recebido ${JSON.stringify(value)}, esperado vX.Y.Z com inteiros nao negativos`,
    );
  }
  return createSemanticVersion(Number(match[1]), Number(match[2]), Number(match[3]));
}

/**
 * Escreve a versao no formato da etiqueta git, sempre com o `v`.
 *
 * @example formatSemanticVersion({ major: 1, minor: 2, patch: 3 }) // 'v1.2.3'
 */
export function formatSemanticVersion(version: SemanticVersion): string {
  return `v${version.major}.${version.minor}.${version.patch}`;
}

/**
 * Eleva a versao pelo incremento derivado dos commits convencionais, devolvendo
 * objeto novo — a versao anterior segue valendo para o registro da publicacao.
 *
 * @example bumpSemanticVersion({ major: 1, minor: 2, patch: 3 }, 'minor') // 1.3.0
 */
export function bumpSemanticVersion(version: SemanticVersion, bump: VersionBump): SemanticVersion {
  if (bump === 'major') {
    return createSemanticVersion(version.major + 1, 0, 0);
  }
  if (bump === 'minor') {
    return createSemanticVersion(version.major, version.minor + 1, 0);
  }
  return createSemanticVersion(version.major, version.minor, version.patch + 1);
}
