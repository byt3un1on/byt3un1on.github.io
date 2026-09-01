import type { IConfigTool } from '../../interfaces/infra/tools/i_config_tool.ts';

type Environment = Readonly<Record<string, string | undefined>>;

/**
 * Toda configuracao vem do ambiente, com padrao de producao. E este o ponto que
 * permite ao teste de integracao e ao motor de processo do BDD apontarem para o
 * WireMock e para diretorios isolados, sem tocar na producao.
 */
export class ConfigTool implements IConfigTool {
  constructor(private readonly env: Environment = process.env) {}

  public githubApiBaseUrl(): string {
    return this.read('GITHUB_API_BASE_URL', 'https://api.github.com');
  }

  public organizationLogin(): string {
    return this.read('GITHUB_ORG', 'byt3un1on');
  }

  public githubToken(): string | null {
    const token = this.env['GITHUB_TOKEN'];
    return token !== undefined && token.trim().length > 0 ? token : null;
  }

  public curationPath(): string {
    return this.read('CURATION_PATH', 'data/curation.json');
  }

  public catalogOutputPath(): string {
    return this.read('CATALOG_OUTPUT_PATH', 'data/catalog.generated.json');
  }

  public prerenderRoutesPath(): string {
    return this.read('PRERENDER_ROUTES_PATH', 'data/prerender-routes.txt');
  }

  public siteRepositoryFullName(): string {
    return this.read('SITE_REPOSITORY', 'byt3un1on/byt3un1on.github.io');
  }

  private read(key: string, fallback: string): string {
    const value = this.env[key];
    return value !== undefined && value.trim().length > 0 ? value : fallback;
  }
}
