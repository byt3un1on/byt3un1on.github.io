import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test';

/**
 * Motor de navegador: Playwright sobre o `dist/browser` servido por um servidor
 * de arquivos puro. Servir assim prova, de graca, a exigencia do Principio 7 de
 * que a saida e publicavel sem runtime algum.
 */
export class BrowserDriver {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private currentPage: Page | null = null;
  private readonly baseUrl = process.env['SITE_BASE_URL'] ?? 'http://127.0.0.1:8080';
  private readonly apiCalls: string[] = [];
  private readonly foreignRequests: string[] = [];
  private readonly failedResponses: string[] = [];

  public async start(): Promise<void> {
    // Mesmo motivo do Lighthouse: o container do agente roda como root.
    this.browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    // Contexto explicito, e nao `browser.newPage()`: o @axe-core/playwright
    // recusa pagina de contexto implicito com "Please use browser.newContext()".
    this.context = await this.browser.newContext();
    this.currentPage = await this.context.newPage();
    this.watch(this.currentPage);
  }

  public async stop(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();
    this.browser = null;
    this.context = null;
    this.currentPage = null;
  }

  /**
   * RNF-08: a preferencia por movimento reduzido e fixada no contexto, e o
   * Playwright nao a troca em contexto ja aberto. Por isso o cenario pede um
   * contexto novo, em vez de um ajuste na pagina.
   */
  public async useReducedMotion(): Promise<void> {
    if (this.browser === null) {
      throw new Error('motor de navegador nao iniciado: cenario sem a etiqueta @navegador?');
    }
    await this.context?.close();
    this.context = await this.browser.newContext({ reducedMotion: 'reduce' });
    this.currentPage = await this.context.newPage();
    this.watch(this.currentPage);
  }

  /** Um mesmo texto de passo serve aos dois motores — por exemplo, "X nao
   *  aparece em lugar nenhum do sitio", que RF-06 verifica no catalogo gerado e
   *  RF-04 verifica na pagina. O passo pergunta qual motor esta ativo. */
  public get active(): boolean {
    return this.currentPage !== null;
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

  /**
   * RNF-06: toda requisicao cujo host difere do host do sitio. E mais amplo que
   * `requestsToGithubApi`, que so olha a API do GitHub: fonte, folha de estilo e
   * icone vindos de CDN cairiam aqui, e e isso que o requisito proibe.
   */
  public requestsToOtherHosts(): readonly string[] {
    return [...this.foreignRequests];
  }

  /** RNF-06: recurso que a pagina pediu e nao recebeu. Sem isto, "nenhuma
   *  requisicao externa" passaria tambem quando nada tivesse sido servido. */
  public responsesThatFailed(): readonly string[] {
    return [...this.failedResponses];
  }

  private watch(page: Page): void {
    const ownHost = new URL(this.baseUrl).host;
    page.on('request', (request) => {
      const url = request.url();
      // RNF-08 da 001: o visitante nao pode falar com a API do GitHub. Registrar
      // aqui e o que permite ao cenario afirmar isso em vez de supor.
      if (url.includes('api.github.com')) {
        this.apiCalls.push(url);
      }
      // `data:` e `blob:` nao tem host e nao saem da maquina — nao sao externos.
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return;
      }
      if (new URL(url).host !== ownHost) {
        this.foreignRequests.push(url);
      }
    });
    page.on('response', (response) => {
      if (response.status() >= 400) {
        this.failedResponses.push(`${response.status()} ${response.url()}`);
      }
    });
  }
}
