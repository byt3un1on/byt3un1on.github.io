/** Questao aberta no repositorio do sitio (RF-16). */
export interface OpenIssue {
  readonly number: number;
  readonly title: string;
}

/**
 * Registra o desfecho da publicacao. Consultar antes de abrir e o que impede a
 * duplicata a cada aborto em sequencia.
 */
export interface IGithubIssueClient {
  findOpenIssueByTitle(title: string): Promise<OpenIssue | null>;
  openIssue(title: string, body: string): Promise<OpenIssue>;
  closeIssue(issueNumber: number): Promise<void>;
}
