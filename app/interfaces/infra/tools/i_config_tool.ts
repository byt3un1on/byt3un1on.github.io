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
}
