/**
 * Configuracao do gerador e do reporte. E por aqui que os testes de integracao
 * e o motor de processo do BDD apontam para o WireMock e para diretorios
 * isolados, em vez de falarem com a API real ou escreverem sobre a producao.
 */
export interface IConfigTool {
  /** Base da API do GitHub. Nos testes, o endereco do WireMock. */
  githubApiBaseUrl(): string;
  /** Login da organizacao cujo catalogo sera montado. */
  organizationLogin(): string;
  /** Credencial de build, quando o ambiente a fornece. Nunca entra no artefato. */
  githubToken(): string | null;
  /** Caminho da curadoria versionada a ler. */
  curationPath(): string;
  /** Caminho do catalogo a escrever. */
  catalogOutputPath(): string;
  /** Caminho da lista de rotas a prerenderizar. */
  prerenderRoutesPath(): string;
  /** Repositorio onde a questao de RF-16 e aberta, no formato dono/nome. */
  siteRepositoryFullName(): string;
  /** Modo padrao da esteira, vindo da configuracao do repositorio (RF-09). */
  pipelineMode(): string | null;
  /** Marcacao aplicada a Pull Request de feature, que sobrepoe o padrao (RF-09). */
  pipelineModeLabel(): string | null;
  /** Arquivo onde o resumo e acrescentado. Ausente, o resumo sai por stdout (RF-12). */
  runSummaryPath(): string | null;
  /** Resultados dos jobs, em JSON, para o portao decidir (RF-05). */
  pipelineResults(): string | null;
  /** Nome do job cujo bloco de resumo sera escrito (RF-12). */
  summaryJob(): string | null;
  /** Situacao desse job, no vocabulario do executor (RF-12). */
  summaryStatus(): string | null;
  /** Detalhe ou motivo desse job; vazio quando nao ha o que dizer (RF-12). */
  summaryDetail(): string | null;
}
