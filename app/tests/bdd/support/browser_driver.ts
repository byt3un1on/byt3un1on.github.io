import { chromium, type Browser, type Page } from '@playwright/test';

/**
 * Motor de navegador: Playwright sobre o `dist/browser` servido por um servidor
 * de arquivos puro. Servir assim prova, de graca, a exigencia do Principio 7 de
 * que a saida e publicavel sem runtime algum.
 */
export class BrowserDriver {
  private browser: Browser | null = null;
  private currentPage: Page | null = null;
  private readonly baseUrl = process.env['SITE_BASE_URL'] ?? 'http://127.0.0.1:8080';
  private readonly apiCalls: string[] = [];

  public async start(): Promise<void> {
    // Mesmo motivo do Lighthouse: o container do agente roda como root.
    this.browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    this.currentPage = await this.browser.newPage();
    // RNF-08: o visitante nao pode falar com a API do GitHub. Registrar aqui e
    // o que permite ao cenario afirmar isso em vez de supor.
    this.currentPage.on('request', (request) => {
      if (request.url().includes('api.github.com')) {
        this.apiCalls.push(request.url());
      }
    });
  }

  public async stop(): Promise<void> {
    await this.browser?.close();
    this.browser = null;
    this.currentPage = null;
  }

  public get page(): Page {
    if (this.currentPage === null) {
      throw new Error('motor de navegador nao iniciado: cenario sem a etiqueta @navegador?');
    }
    return this.currentPage;
  }

  public async visit(path: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`, { waitUntil: 'load' });
  }

  public requestsToGithubApi(): readonly string[] {
    return [...this.apiCalls];
  }
}
