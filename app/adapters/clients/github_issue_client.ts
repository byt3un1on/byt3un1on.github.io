import { CatalogSourceError } from '../../core/domain/errors/catalog_source_error.ts';
import type {
  IGithubIssueClient,
  OpenIssue,
} from '../../interfaces/adapters/clients/i_github_issue_client.ts';
import type { IConfigTool } from '../../interfaces/infra/tools/i_config_tool.ts';

/** Registra o desfecho da publicacao no repositorio do sitio (RF-16). */
export class GithubIssueClient implements IGithubIssueClient {
  constructor(private readonly config: IConfigTool) {}

  public async findOpenIssueByTitle(title: string): Promise<OpenIssue | null> {
    const path = `${this.base()}/issues?state=open&per_page=100`;
    const payload = await this.send(path, 'GET');
    if (!Array.isArray(payload)) {
      throw new CatalogSourceError(`esperado array, recebido ${typeof payload}`, path);
    }
    const found = (payload as readonly unknown[]).find((item) => this.titleOf(item) === title);
    return found === undefined ? null : { number: this.numberOf(found), title };
  }

  public async openIssue(title: string, body: string): Promise<OpenIssue> {
    const path = `${this.base()}/issues`;
    const payload = await this.send(path, 'POST', { title, body });
    return { number: this.numberOf(payload), title };
  }

  public async closeIssue(issueNumber: number): Promise<void> {
    await this.send(`${this.base()}/issues/${issueNumber}`, 'PATCH', { state: 'closed' });
  }

  private base(): string {
    return `/repos/${this.config.siteRepositoryFullName()}`;
  }

  private titleOf(item: unknown): string | null {
    const record = item as Record<string, unknown>;
    return typeof record['title'] === 'string' ? record['title'] : null;
  }

  private numberOf(item: unknown): number {
    const record = item as Record<string, unknown>;
    if (typeof record?.['number'] !== 'number') {
      throw new CatalogSourceError('questao sem numero na resposta', this.base());
    }
    return record['number'];
  }

  private async send(path: string, method: string, body?: unknown): Promise<unknown> {
    const token = this.config.githubToken();
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
    if (token !== null) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    const init: RequestInit = { method, headers };
    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }
    const response = await fetch(`${this.config.githubApiBaseUrl()}${path}`, init);
    if (!response.ok) {
      throw new CatalogSourceError(`resposta ${response.status}`, path);
    }
    return response.json();
  }
}
