/** Cabecalho de commit convencional, como a esteira o le para o RF-10. */
export interface ConventionalCommitDto {
  readonly type: string;
  readonly scope: string | null;
  readonly isBreaking: boolean;
  readonly subject: string;
}

const HEADER_PATTERN = /^([A-Za-z]+)(?:\(([^()]+)\))?(!)?:(.*)$/;
const BREAKING_FOOTER_PATTERN = /^BREAKING[ -]CHANGE:/;

function hasBreakingFooter(bodyLines: readonly string[]): boolean {
  return bodyLines.some((line: string): boolean => BREAKING_FOOTER_PATTERN.test(line));
}

/**
 * Interpreta a mensagem de commit para a esteira derivar o incremento
 * semantico (RF-10). Somente a primeira linha define tipo, escopo e assunto; o
 * restante e corpo, e so interessa pelo aviso de mudanca incompativel.
 *
 * Devolve `null` em vez de lancar quando a mensagem foge do padrao: e decisao
 * de projeto que commit fora do padrao nao impeca a esteira, apenas nao
 * contribua com incremento algum.
 *
 * @example parseConventionalCommit('feat(esteira)!: publica a versao')
 */
export function parseConventionalCommit(message: string): ConventionalCommitDto | null {
  const lines: string[] = message.split('\n');
  const header: RegExpExecArray | null = HEADER_PATTERN.exec(lines[0].trim());
  if (header === null) {
    return null;
  }
  const subject: string = header[4].trim();
  if (subject.length === 0) {
    return null;
  }
  return Object.freeze({
    type: header[1].toLowerCase(),
    scope: header[2] ?? null,
    isBreaking: header[3] === '!' || hasBreakingFooter(lines.slice(1)),
    subject,
  });
}
