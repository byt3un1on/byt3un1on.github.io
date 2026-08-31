# Plano de implementação — Vitrine de projetos da Byte Union

> Descreve **como**. Deriva da spec e da constituição; não introduz requisito novo.

## Leitura de base

O repositório está vazio de código: `README.md`, `.gitignore`, `.specify/` e `specs/`. Não há
`app/`, não há `as-is.md`, não há decisão de stack anterior a herdar. Todas as versões abaixo
foram verificadas no registro em 2026-08-30, não presumidas.

## Decisões técnicas

| Decisão | Escolha | Alternativas descartadas | Por quê |
|---|---|---|---|
| Forma do artefato publicado | `outputMode: "static"` do builder `application`, com `prerender.routesFile` | `ssr: true`; SPA sem prerender; `discoverRoutes` automático | O Princípio 7 proíbe runtime de servidor e exige que toda rota pública resolva por arquivo. `static` gera diretório servível por qualquer servidor de arquivos; `routesFile` cobre as rotas parametrizadas de projeto, que `discoverRoutes` não descobre sozinho |
| Momento de obtenção do catálogo | Passo de geração anterior ao build, executado no Node | Buscar durante o prerender; buscar no navegador do visitante | `RNF-08` exige **0** requisição à API do GitHub feita pelo navegador. Buscar durante o prerender entrelaça obtenção de dado com renderização e reexecuta a chamada por rota; um passo próprio é determinístico, testável e é onde `RF-14` (abortar a publicação) tem lugar natural |
| Como o sítio consome o catálogo | Arquivo `catalog.generated.json` gerado antes do build e lido por repositório dedicado | `HttpClient` em tempo de execução; embutir o JSON em componente | Mantém `RNF-08` em zero requisições e preserva a regra do `frontend-rules`: componente não faz rede. O repositório é a fronteira, e é mockável no teste |
| Detecção de repositório vazio (`RF-06`) | `GET /repos/{org}/{repo}/commits?per_page=1` e tratar **HTTP 409** como vazio | Usar `size == 0`; usar `language == null`; confiar na curadoria | Verificado na API: `documentation-site` (vazio) e `byt3un1on.github.io` (com commits) **ambos** retornam `size: 0`. `size` é KB arredondado e não serve. O 409 `Git Repository is empty` é o único sinal confiável |
| Framework de UI | Angular 22.1.4, standalone components, signals, `OnPush` | React; Vue; Astro; TypeScript puro | Decidido na constituição. O `angular-rules` do projeto já fixa as convenções |
| Linguagem | TypeScript 6.0.3 | TypeScript 7.0.2 (última) | `@angular/compiler-cli@22.1.4` declara `typescript: ">=6.0 <6.1"`. TS 7 quebra a instalação |
| Runtime de execução | Node 24 na imagem do serviço `dev` | Node 22 local (v22.12.0) | `@angular/cli@22.1.6` exige `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0`. O Node da máquina está **abaixo** do mínimo — mais uma razão para tudo passar pelo serviço `dev` |
| Runner de teste unitário | Builder `@angular/build:unit-test` com `runner: vitest` (Vitest 4.1.11) | Karma (depreciado); Jest via runner de terceiro; Vitest configurado à mão fora do Angular | O builder é oficial, tem `coverage`, `coverageThresholds` e `coverageExclude` nativos — é o que sustenta o portão de 90% sem script auxiliar. Está marcado `[EXPERIMENTAL]`; ver *Riscos* |
| Consulta em teste de componente | Angular Testing Library 19.4.2 sobre `TestBed` | `fixture.debugElement.query(By.css(...))` | `angular-rules` e `frontend-rules` mandam consultar por papel e nome acessível. Consulta por papel também é o que faz o teste falhar quando a acessibilidade regride |
| Teste BDD | Cucumber 13.2.1 dirigindo Playwright 1.62.1 contra o `dist/` servido estaticamente | Cypress; Playwright sem Cucumber | `frontend-rules` manda Cucumber com `# language: pt`. Servir o `dist/` estático faz o BDD provar, de graça, a exigência do Princípio 7 de que a saída é servível por servidor de arquivos |
| Medição de `RNF-01` a `RNF-03` | Lighthouse CI 0.15.1 com asserções por categoria | Medição manual; PageSpeed via API externa | Precisa rodar headless e falhar o portão. A API externa exigiria rede e um sítio já publicado |
| Medição de `RNF-02` e `RNF-09` | `@axe-core/playwright` 4.13.0, falhando em violação `critical` ou `serious` | Só o índice de acessibilidade do Lighthouse | O Lighthouse dá nota agregada; o Princípio 9 exige **0** violação crítica ou séria, que é asserção por regra, não por nota |
| Peso da entrega (`RNF-04`) | `budgets` do builder `application` | Medir por script após o build | O builder já falha o build ao estourar o orçamento. Não se escreve o que a ferramenta faz |
| Onde vive o reporte de `RF-16` | Comando próprio, acionado na fronteira da publicação, com o desfecho por argumento | Acionar dentro de `generate_catalog_command`; acionar por passo solto do fluxo de CI | Dentro do comando de catálogo, o reporte só veria falha de catálogo e encerraria a questão antes de a publicação concluir. Passo solto no fluxo de CI não é testável, e o Princípio 3 não abre exceção |
| Contêiner de IoC | DI do próprio Angular no sítio; contêiner mínimo próprio no gerador | Biblioteca de DI de terceiro (InversifyJS, tsyringe) | O sítio já tem DI; o gerador tem menos de dez dependências a ligar. Dependência nova para resolver isso não se paga |

## Padrões de projeto aplicados

| Padrão | Onde | Problema que resolve | Custo aceito |
|---|---|---|---|
| Repository | `curation_repository`, `catalog_file_repository`, `static_catalog_repository` | O caso de uso não pode saber se a curadoria veio de arquivo, nem onde o catálogo é escrito | Três interfaces a manter |
| Gateway / Adapter | `github_organization_client` | Isola o formato da API do GitHub do domínio, e é o ponto onde o WireMock entra nos testes de integração | Um DTO de tradução a mais |
| Injeção de dependências | `ioc_init` (sítio), `cli_ioc_init` (gerador) | Toda dependência injetada precisa ser mockável para o teste unitário isolar a classe | Registro central a manter em dia |
| Value Object | `Project`, `CodeRepository` | O agrupamento de vários repositórios em um projeto (`RF-07`) é regra, e regra não mora em componente | Mapeamento explícito de DTO para entidade |

### Considerados e recusados

| Padrão | Por que foi recusado |
|---|---|
| Strategy no filtro por tecnologia | `RF-11` tem **um** critério. Estratégia intercambiável para uma estratégia só é indireção sem problema presente |
| Store global (NgRx, Signal Store) | O catálogo é imutável e conhecido em build. Estado de servidor não existe aqui — não há o que sincronizar, invalidar ou recarregar |
| Decorator de cache no cliente HTTP | O cliente é chamado uma vez por publicação, dentro de um processo que morre em seguida. Cache não tem o que amortizar |
| Factory para as entidades | Construção direta resolve. Fábrica entraria para escolher entre implementações que não existem |
| Builder para montar o catálogo | Não há construtor telescópico nem construção em etapas opcionais: a montagem é um pipeline de funções puras |
| Composite para projeto multi-repositório | A composição de `RF-07` tem **um** nível e não é recursiva. Composite exige que folha e composto compartilhem interface, o que aqui só acrescentaria cerimônia |

## Arquivos a criar ou alterar

Todos criados. Caminhos completos, respeitando as camadas de `app/`.

### `core/domain` — sem nenhum import de framework

| Camada | Arquivo | Ação | Teste espelhado | Requisitos |
|---|---|---|---|---|
| core/domain | `app/core/domain/entities/project.ts` | criar | `app/tests/unit/core/domain/entities/project.test.ts` | RF-03, RF-07 — união das tecnologias e atividade mais recente —, RF-09 |
| core/domain | `app/core/domain/entities/code_repository.ts` | criar | `app/tests/unit/core/domain/entities/code_repository.test.ts` | RF-03, RF-06 |
| core/domain | `app/core/domain/dtos/github_repository_dto.ts` | criar | `app/tests/unit/core/domain/dtos/github_repository_dto.test.ts` | RF-02 |
| core/domain | `app/core/domain/dtos/curation_dto.ts` | criar | `app/tests/unit/core/domain/dtos/curation_dto.test.ts` | RF-04, RF-05 |
| core/domain | `app/core/domain/dtos/catalog_dto.ts` | criar | `app/tests/unit/core/domain/dtos/catalog_dto.test.ts` | RF-02 |
| core/domain | `app/core/domain/errors/curation_validation_error.ts` | criar | `app/tests/unit/core/domain/errors/curation_validation_error.test.ts` | RF-05 |
| core/domain | `app/core/domain/errors/catalog_source_error.ts` | criar | `app/tests/unit/core/domain/errors/catalog_source_error.test.ts` | RF-14 |
| core/domain | `app/core/domain/constants/site_routes_constants.ts` | criar | `app/tests/unit/core/domain/constants/site_routes_constants.test.ts` | RF-08, RF-12, RF-15, RNF-10 — toda rota declarada relativa à raiz, sem esquema nem host |
| core/domain | `app/core/domain/constants/organization_constants.ts` | criar | `app/tests/unit/core/domain/constants/organization_constants.test.ts` | RF-10 |

### `core/application` — casos de uso

| Camada | Arquivo | Ação | Teste espelhado | Requisitos |
|---|---|---|---|---|
| core/application | `app/core/application/catalog/validate_curation_use_case.ts` | criar | `app/tests/unit/core/application/catalog/validate_curation_use_case.test.ts` | RF-05 — três invalidezes: sem resumo, referência inexistente, repositório repetido |
| core/application | `app/core/application/catalog/assemble_catalog_use_case.ts` | criar | `app/tests/unit/core/application/catalog/assemble_catalog_use_case.test.ts` | RF-02, RF-04, RF-06, RF-07 |
| core/application | `app/core/application/catalog/generate_catalog_use_case.ts` | criar | `app/tests/unit/core/application/catalog/generate_catalog_use_case.test.ts` | RF-14 |
| core/application | `app/core/application/catalog/report_publication_status_use_case.ts` | criar | `app/tests/unit/core/application/catalog/report_publication_status_use_case.test.ts` | RF-16 |
| core/application | `app/core/application/showcase/list_projects_use_case.ts` | criar | `app/tests/unit/core/application/showcase/list_projects_use_case.test.ts` | RF-02, RF-04 |
| core/application | `app/core/application/showcase/filter_projects_by_technology_use_case.ts` | criar | `app/tests/unit/core/application/showcase/filter_projects_by_technology_use_case.test.ts` | RF-11, RF-13 |
| core/application | `app/core/application/showcase/list_technologies_use_case.ts` | criar | `app/tests/unit/core/application/showcase/list_technologies_use_case.test.ts` | RF-11 |
| core/application | `app/core/application/showcase/find_project_by_slug_use_case.ts` | criar | `app/tests/unit/core/application/showcase/find_project_by_slug_use_case.test.ts` | RF-08, RF-12 |

### `adapters` — mundo externo

| Camada | Arquivo | Ação | Teste espelhado | Requisitos |
|---|---|---|---|---|
| adapters/clients | `app/adapters/clients/github_organization_client.ts` | criar | `app/tests/unit/adapters/clients/github_organization_client.test.ts` | RF-02, RF-06 |
| adapters/repositories | `app/adapters/repositories/curation_repository.ts` | criar | `app/tests/unit/adapters/repositories/curation_repository.test.ts` | RF-04 |
| adapters/repositories | `app/adapters/repositories/catalog_file_repository.ts` | criar | `app/tests/unit/adapters/repositories/catalog_file_repository.test.ts` | RF-08, RF-12, RF-15 |
| adapters/repositories | `app/adapters/repositories/static_catalog_repository.ts` | criar | `app/tests/unit/adapters/repositories/static_catalog_repository.test.ts` | RF-02, RNF-08 |
| adapters/clients | `app/adapters/clients/github_issue_client.ts` | criar | `app/tests/unit/adapters/clients/github_issue_client.test.ts` | RF-16 |
| adapters/commands | `app/adapters/commands/generate_catalog_command.ts` | criar | `app/tests/unit/adapters/commands/generate_catalog_command.test.ts` | RF-05, RF-14 |
| adapters/commands | `app/adapters/commands/report_publication_command.ts` | criar | `app/tests/unit/adapters/commands/report_publication_command.test.ts` | RF-16 |

### `adapters/presenters` — componentes Angular (arquivo `kebab-case`, classe `PascalCase`)

| Camada | Arquivo | Ação | Teste espelhado | Requisitos |
|---|---|---|---|---|
| adapters/presenters | `app/adapters/presenters/layout/site-header.component.ts` | criar | `app/tests/unit/adapters/presenters/layout/site-header.component.test.ts` | RF-01, RNF-06 |
| adapters/presenters | `app/adapters/presenters/layout/site-footer.component.ts` | criar | `app/tests/unit/adapters/presenters/layout/site-footer.component.test.ts` | RF-10 |
| adapters/presenters | `app/adapters/presenters/home/home-page.component.ts` | criar | `app/tests/unit/adapters/presenters/home/home-page.component.test.ts` | RF-01 |
| adapters/presenters | `app/adapters/presenters/catalog/catalog-page.component.ts` | criar | `app/tests/unit/adapters/presenters/catalog/catalog-page.component.test.ts` | RF-02, RF-11, RF-13 — região viva anunciando a contagem |
| adapters/presenters | `app/adapters/presenters/catalog/project-card.component.ts` | criar | `app/tests/unit/adapters/presenters/catalog/project-card.component.test.ts` | RF-03, RF-04 |
| adapters/presenters | `app/adapters/presenters/catalog/technology-filter.component.ts` | criar | `app/tests/unit/adapters/presenters/catalog/technology-filter.component.test.ts` | RF-11, RF-13 |
| adapters/presenters | `app/adapters/presenters/project/project-page.component.ts` | criar | `app/tests/unit/adapters/presenters/project/project-page.component.test.ts` | RF-07, RF-08, RF-09 |
| adapters/presenters | `app/adapters/presenters/error/not-found-page.component.ts` | criar | `app/tests/unit/adapters/presenters/error/not-found-page.component.test.ts` | RF-12 |

### `infra`

| Camada | Arquivo | Ação | Teste espelhado | Requisitos |
|---|---|---|---|---|
| infra/tools | `app/infra/tools/logger_tool.ts` | criar | `app/tests/unit/infra/tools/logger_tool.test.ts` | RF-14 |
| infra/tools | `app/infra/tools/config_tool.ts` | criar | `app/tests/unit/infra/tools/config_tool.test.ts` | RF-02 |
| infra/tools | `app/infra/tools/seo_tool.ts` | criar | `app/tests/unit/infra/tools/seo_tool.test.ts` | RNF-06 |
| infra/init | `app/infra/init/web_routes.ts` | criar | `app/tests/unit/infra/init/web_routes.test.ts` | RF-08, RF-12, RF-15 |
| infra/init | `app/infra/init/web_init.ts` | criar | — *(isento: só compõe a configuração e entrega o roteamento declarado em `web_routes.ts`)* | — |
| infra/init | `app/infra/init/ioc_init.ts` | criar | — *(isento: só liga interface a implementação, sem decisão)* | — |
| infra/init | `app/infra/init/cli_ioc_init.ts` | criar | — *(isento: só liga interface a implementação, sem decisão)* | — |
| infra/cli | `app/infra/cli/cli_entry.ts` | criar | `app/tests/unit/infra/cli/cli_entry.test.ts` | RF-14 |

### `interfaces` — toda abstração injetada

| Arquivo | Espelha |
|---|---|
| `app/interfaces/adapters/clients/i_github_organization_client.ts` | `github_organization_client` |
| `app/interfaces/adapters/clients/i_github_issue_client.ts` | `github_issue_client` |
| `app/interfaces/adapters/repositories/i_curation_repository.ts` | `curation_repository` |
| `app/interfaces/adapters/repositories/i_catalog_file_repository.ts` | `catalog_file_repository` |
| `app/interfaces/adapters/repositories/i_static_catalog_repository.ts` | `static_catalog_repository` |
| `app/interfaces/adapters/commands/i_generate_catalog_command.ts` | `generate_catalog_command` |
| `app/interfaces/adapters/commands/i_report_publication_command.ts` | `report_publication_command` |
| `app/interfaces/core/application/catalog/i_validate_curation_use_case.ts` | `validate_curation_use_case` |
| `app/interfaces/core/application/catalog/i_assemble_catalog_use_case.ts` | `assemble_catalog_use_case` |
| `app/interfaces/core/application/catalog/i_generate_catalog_use_case.ts` | `generate_catalog_use_case` |
| `app/interfaces/core/application/catalog/i_report_publication_status_use_case.ts` | `report_publication_status_use_case` |
| `app/interfaces/core/application/showcase/i_list_projects_use_case.ts` | `list_projects_use_case` |
| `app/interfaces/core/application/showcase/i_filter_projects_by_technology_use_case.ts` | `filter_projects_by_technology_use_case` |
| `app/interfaces/core/application/showcase/i_list_technologies_use_case.ts` | `list_technologies_use_case` |
| `app/interfaces/core/application/showcase/i_find_project_by_slug_use_case.ts` | `find_project_by_slug_use_case` |
| `app/interfaces/infra/tools/i_logger_tool.ts` | `logger_tool` |
| `app/interfaces/infra/tools/i_config_tool.ts` | `config_tool` |
| `app/interfaces/infra/tools/i_seo_tool.ts` | `seo_tool` |
| `app/interfaces/infra/cli/i_cli_entry.ts` | `cli_entry` |

> Interface não tem teste espelhado: é declaração de contrato, sem comportamento a exercitar.
> O contrato é verificado pelo compilador em cada implementação e em cada mock.

### Entrypoints

| Arquivo | Papel | Cobertura |
|---|---|---|
| `app/main.ts` | Sobe o Angular: pede o inicializador a `web_init` e o executa | isento |
| `app/main_catalog.ts` | Sobe o gerador de catálogo: pede o inicializador a `cli_entry` e o executa | isento |
| `app/main_report.ts` | Sobe o reporte de estado da publicação, acionado na fronteira do fluxo, com o desfecho recebido por argumento | isento |

**Prova da isenção, exigida pela emenda 1.0.2.** Seis arquivos ficam fora da conta de cobertura —
os três acima mais `ioc_init.ts`, `cli_ioc_init.ts` e `web_init.ts` — e nenhum carrega decisão:

| Arquivo | O que faria dele um arquivo com regra | Onde essa regra mora, testada |
|---|---|---|
| `main.ts`, `main_catalog.ts`, `main_report.ts` | escolher o que executar, tratar erro, ler argumento com significado | `cli_entry.ts` interpreta o argumento e escolhe o comando; os comandos tratam o erro |
| `ioc_init.ts`, `cli_ioc_init.ts` | decidir qual implementação usar em qual condição | não há condição: cada interface tem uma implementação só, ligada uma vez |
| `web_init.ts` | declarar rotas, ordem ou guarda de navegação | `web_routes.ts` declara a tabela de rotas e **tem teste espelhado**; `web_init` só a entrega ao framework |

Qualquer um deles que venha a ganhar um `if` perde a isenção no mesmo commit: a regra sai para
uma camada testável antes, e só então o arquivo volta a ser fiação.

> **Desvio declarado.** A constituição fala em `main` no singular. Este projeto tem **três
> pontos de entrada** por ter tempos de execução distintos: a geração do catálogo e o reporte de
> estado, que rodam no Node em momentos diferentes do fluxo de publicação, e o sítio, que roda no
> navegador. Um arquivo não serve aos três. Todos obedecem à regra que importa: instanciam o
> contêiner, pedem o inicializador, executam, e não carregam nenhuma regra de negócio.

### Dados versionados — não são código

| Arquivo | Papel | Versionado |
|---|---|---|
| `app/data/curation.json` | A curadoria: quais projetos entram, ordem, destaque, resumo e composição (`RF-04`, `RF-05`, `RF-07`) | sim |
| `app/data/catalog.generated.json` | Catálogo montado por `make catalog`, consumido pelo build | não — ignorado |
| `app/data/prerender-routes.txt` | Lista de rotas a prerenderizar, uma por linha (`RF-08`, `RF-15`) | não — ignorado |

> `curation.json` fica fora das camadas de propósito: o Princípio 8 exige que a curadoria viva
> em **arquivo de dados separado do código**. Colocá-la em `core/domain` a tornaria código.

### Testes de integração e BDD

Não têm arquivo espelhado de produção — provam contratos, não unidades. Enumerados aqui para
que nenhum apareça só nas tarefas.

| Arquivo | Prova |
|---|---|
| `app/tests/it/stubs/` | Stubs do WireMock: listagem da organização, `409` de repositório vazio, API de questões |
| `app/tests/it/adapters/clients/github_organization_client_test_integration.ts` | `RF-02`, `RF-06` contra WireMock |
| `app/tests/it/adapters/clients/github_issue_client_test_integration.ts` | `RF-16` contra WireMock |
| `app/tests/it/adapters/repositories/curation_repository_test_integration.ts` | `RF-04`, `RF-05` contra arquivo real |
| `app/tests/it/adapters/repositories/catalog_file_repository_test_integration.ts` | `RF-08`, `RF-15` — catálogo e lista de rotas escritos em disco real |
| `app/tests/it/adapters/repositories/static_catalog_repository_test_integration.ts` | `RF-02`, `RNF-08` — leitura do catálogo gerado, sem rede |
| `app/tests/bdd/support/world.ts` | Cucumber sobre Playwright, apontado ao `dist/` servido estaticamente |
| `app/tests/bdd/features/apresentacao_da_oficina.feature` | `RF-01` |
| `app/tests/bdd/features/catalogo_de_projetos.feature` | `RF-02`, `RF-03`, `RF-04`, `RF-06`, `RF-07`, `RF-11`, `RF-13` |
| `app/tests/bdd/features/curadoria_do_catalogo.feature` | `RF-04`, `RF-05` |
| `app/tests/bdd/features/aprofundamento_em_um_projeto.feature` | `RF-08`, `RF-09`, `RF-15` |
| `app/tests/bdd/features/contato_com_a_organizacao.feature` | `RF-10` |
| `app/tests/bdd/features/frescura_e_integridade_do_catalogo.feature` | `RF-14`, `RF-16`, `RNF-08` |
| `app/tests/bdd/features/resiliencia_e_bordas.feature` | `RF-12` |
| `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature` | `RNF-01`, `RNF-02`, `RNF-03`, `RNF-05`, `RNF-07` |
| `app/tests/bdd/steps/catalog_steps.ts` | Passos do catálogo, da curadoria e do aprofundamento |
| `app/tests/bdd/steps/publication_steps.ts` | Passos de frescura, integridade e resiliência |
| `app/tests/bdd/steps/accessibility_steps.ts` | Passos de qualidade medida — **é aqui que a varredura `axe` vive** |

> **Não existe `app/tests/audit/`.** O Princípio 2 declara três diretórios de teste — `unit/`,
> `it/` e `bdd/` — e a auditoria não precisa de um quarto: os cenários de qualidade já estão
> escritos em Gherkin na spec, então o `axe` entra como passo de `accessibility_steps.ts` e o
> Lighthouse como asserção de `lighthouserc.json`, ambos disparados por `make audit`.

### Configuração e infraestrutura do projeto

| Arquivo | Papel |
|---|---|
| `app/package.json`, `app/angular.json`, `app/tsconfig.json` | Projeto Angular; `sourceRoot` na própria `app/`, para as camadas ficarem na raiz e não sob `src/`. `baseHref: "/"` fixa a raiz do sítio e sustenta `RNF-10` |
| `app/Makefile` | Contrato de operação |
| `app/Dockerfile` | Imagem única — Node 24, Chromium do Playwright, ferramentas de qualidade |
| `app/docker-compose.yml` | Serviços `dev` e `wiremock` |
| `app/vitest.config.ts` | `runnerConfig` do builder `unit-test`: limiar por arquivo e exclusões de cobertura |
| `app/lighthouserc.json` | Asserções de `RNF-01`, `RNF-03` e do peso transferido de `RNF-04`, pela auditoria `total-byte-weight`, que mede bytes na rede e não o pacote em disco |
| `app/eslint.config.js`, `app/.prettierrc`, `app/.editorconfig` | Dotfiles de qualidade |
| `app/index.html` | Casca do sítio, com `lang="pt-BR"` (`RNF-07`) |
| `app/styles.css` | Tokens de cor e tipografia (`RNF-09`) e a malha fluida que sustenta `RNF-05` de 320 px a 1920 px |
| `app/scripts/serve_dist.sh` | Sobe servidor de arquivos estático sobre `dist/` para BDD e auditoria |
| `app/scripts/check_links.sh` | Varre o `dist/` construído e falha se alguma ligação interna for absoluta (`RNF-10`) ou se alguma rota pública exigir mais de 2 cliques a partir da página inicial (`RNF-06`) |

### Arquivos fora de `app/` — exceção declarada

O portão desta etapa pede que nenhum caminho fique fora de `app/`. Três precisam ficar, por
imposição de plataforma, não por escolha de projeto:

| Arquivo | Por que não pode ficar em `app/` |
|---|---|
| `.github/workflows/publish.yml` | O GitHub Actions só lê fluxos em `.github/workflows/`. É o que executa a publicação agendada de `RNF-08` e o aborto de `RF-14` |
| `.gitignore` | Precisa alcançar `app/data/catalog.generated.json`, `app/data/prerender-routes.txt`, `app/node_modules/` e `app/dist/` |
| `CLAUDE.md` | Convenção de raiz do repositório |

## Contrato entre camadas

**Tempo de geração — `make catalog`, roda no Node.**

```
main_catalog.ts
  └─ cli_ioc_init  →  cli_entry  →  generate_catalog_command
                                      └─ generate_catalog_use_case
                                           ├─ curation_repository        (lê app/data/curation.json)
                                           ├─ validate_curation_use_case (RF-05)
                                           ├─ github_organization_client (RF-02, RF-06)
                                           ├─ assemble_catalog_use_case  (RF-04, RF-06, RF-07)
                                           └─ catalog_file_repository    (escreve catálogo e rotas)
```

**Fronteira da publicação — `make report`, roda no Node depois do fluxo inteiro.**

```
main_report.ts
  └─ cli_ioc_init  →  cli_entry  →  report_publication_command   (recebe o desfecho por argumento)
                                      └─ report_publication_status_use_case  (RF-16)
                                           └─ github_issue_client   (abre e encerra a questão)
```

**Tempo de visita — o navegador, sobre HTML já renderizado.**

```
main.ts
  └─ web_init  →  web_routes  →  *-page.component
                                   └─ use case de showcase
                                        └─ static_catalog_repository (lê o JSON gerado; nenhuma rede)
```

O que trafega entre as camadas são **DTOs na borda e entidades para dentro**:
`github_repository_dto` e `curation_dto` morrem em `assemble_catalog_use_case`, que devolve
entidades `Project` e `CodeRepository`. Nenhum componente vê DTO de API.

**Onde o erro é tratado.** Falha de rede e resposta inesperada da API viram
`CatalogSourceError` dentro do cliente; curadoria sem resumo vira `CurationValidationError`
dentro de `validate_curation_use_case`. Os dois sobem sem serem capturados até
`generate_catalog_command`, que registra o erro estruturado pelo `logger_tool` e devolve código
de saída diferente de zero — o que aborta a publicação e cumpre `RF-14`.

**O reporte de `RF-16` não pertence ao comando de catálogo.** A publicação aborta por mais de um
motivo — catálogo indisponível, curadoria inválida, build que falha, prerender que não cobre uma
rota — e um reporte disparado dentro de `make catalog` só enxergaria os dois primeiros. Pior:
encerraria a questão aberta ao fim do passo de catálogo, quando a publicação ainda não concluiu,
contradizendo o cenário *publicação bem-sucedida encerra a questão aberta*. Por isso o reporte é
comando próprio, `report_publication_command`, acionado **na fronteira do fluxo de publicação** e
sempre — tenha ele concluído ou falhado —, recebendo o desfecho por argumento. É o que torna
`RF-16` verdadeiro para qualquer motivo de aborto. **No sítio não há
tratamento de erro de obtenção**, porque no sítio não há obtenção: se o catálogo não existisse,
o build teria falhado antes.

## Dependências externas

Versões verificadas no registro em 2026-08-30.

| Dependência | Versão | Justificativa | Simulada nos testes por |
|---|---|---|---|
| `@angular/core`, `common`, `router`, `platform-browser` | 22.1.4 | Framework do sítio | — |
| `@angular/platform-server` | 22.1.4 | Exigida pelo prerender | — |
| `@angular/build`, `@angular/cli`, `@angular/ssr` | 22.1.6 | Build estático, prerender e builder de teste | — |
| `typescript` | 6.0.3 | Travada por `@angular/compiler-cli` em `>=6.0 <6.1` | — |
| `vitest` | 4.1.11 | Runner do builder `unit-test`; cobertura e limiares | — |
| `@testing-library/angular` | 19.4.2 | Consulta por papel e nome acessível | — |
| `@cucumber/cucumber` | 13.2.1 | Cenários `# language: pt` da spec | — |
| `@playwright/test` | 1.62.1 | Navegador do BDD e da auditoria de acessibilidade | — |
| `@axe-core/playwright` | 4.13.0 | `RNF-02` e `RNF-09` | — |
| `@lhci/cli` | 0.15.1 | `RNF-01` e `RNF-03` | — |
| `eslint` 10.9.1, `angular-eslint` 22.2.0, `typescript-eslint` 8.68.0 | — | `make lint` | — |
| `prettier` | 3.9.6 | `make fmt` | — |
| `http-server` | 14.1.1 | Serve `dist/` estático para BDD e auditoria | — |
| **API REST do GitHub** | v3 | Única fonte do catálogo (Princípio 8) e destino das questões de `RF-16` | `wiremock/wiremock:3.13.2` em `app/tests/it/` |
| `node` (imagem base) | 24 | `@angular/cli` exige `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0` | — |

## Impacto no contrato de operação

**Três alvos novos no `Makefile`**, porque a feature tem obrigações que os catorze alvos
existentes não cobrem:

| Alvo | O que faz | Requisito |
|---|---|---|
| `make catalog` | Executa o gerador; escreve `catalog.generated.json` e `prerender-routes.txt`; **sai com código diferente de zero** se a curadoria for inválida ou o catálogo não puder ser obtido | RF-05, RF-14 |
| `make audit` | Sobe `dist/` em servidor estático, roda Lighthouse CI e a varredura `axe` em cada rota pública, executa `check_links.sh`, e falha abaixo dos limiares | RNF-01, RNF-02, RNF-03, RNF-06, RNF-09, RNF-10 |
| `make report` | Registra o desfecho da publicação: abre a questão em caso de aborto, encerra a existente em caso de sucesso. Acionado sempre ao fim do fluxo, qualquer que tenha sido o desfecho | RF-16 |

> `RNF-05` não é alvo próprio: o cenário BDD *alcance de dispositivos* já o verifica, abrindo
> cada rota pública em viewport de 320 px e afirmando ausência de rolagem horizontal. Medir a
> mesma coisa duas vezes seria cerimônia.

**Alvos existentes que mudam de conteúdo:**

- `make build` passa a depender de `make catalog` — sem catálogo não há o que prerenderizar.
- `make validate` passa a encadear `fmt → lint → test → cover → it → bdd → audit`.
- `make bdd` sobe o `dist/` estático e roda Cucumber sobre ele, em vez de apontar para o
  servidor de desenvolvimento.

**Serviços do compose:** `dev` (imagem única, ociosa, com o código montado por volume) e
`wiremock` (`wiremock/wiremock:3.13.2`, alvo dos testes de integração do cliente do GitHub).

**Variável de ambiente nova:** `GITHUB_TOKEN`, credencial de build fornecida pelo ambiente de
integração e consumida por `make catalog` para ler a organização e escrever a questão de
`RF-16`. Nunca entra no artefato publicado. A emenda **1.0.1** ao Princípio 7 autoriza
expressamente esse uso. Fora do CI, ausente a variável, o gerador cai em acesso anônimo — o que
basta para desenvolvimento local, mas não escreve questão.

## Riscos

| Risco | Probabilidade | Mitigação |
|---|---|---|
| O builder `unit-test` está marcado `[EXPERIMENTAL]` e pode mudar de contrato entre versões menores | média | Versões fixadas exatas, sem `^`. A configuração real do Vitest vive em `app/vitest.config.ts` e é passada por `runnerConfig`, então uma eventual troca do builder não leva junto a configuração de teste |
| Limite da API do GitHub estourado durante a publicação | baixa | Com a credencial de build autorizada pela emenda 1.0.1, o limite passa de 60 para 5000 requisições por hora, contra uma publicação que faz cerca de dez chamadas. Se ainda assim estourar, `RF-14` aborta, `RF-16` abre a questão e a versão anterior permanece no ar |
| Convite do Discord expira e `RF-10` passa a apontar para lugar nenhum | média | Usar convite sem prazo de validade, e cobrir a existência das duas ligações no cenário BDD de `RF-10`. A validade do convite em si não é verificável por teste |
| Questão de `RF-16` acumula duplicatas a cada publicação abortada em sequência | média | `report_publication_status_use_case` consulta as questões em aberto antes de abrir outra, e o cenário BDD afirma que nenhuma duplicata é criada enquanto a anterior seguir aberta |
| `make report` deixa de ser chamado quando o fluxo de publicação é interrompido pela plataforma, e a questão não abre | baixa | O passo que aciona `make report` roda em condição de execução sempre, independente do desfecho dos anteriores. Interrupção do próprio executor está fora do alcance de qualquer desenho |
| Nota 90 de SEO e Boas Práticas no Lighthouse em perfil móvel é exigente para páginas com muitas ligações externas | média | `seo_tool` garante título e descrição por rota desde o início; ligações externas com `rel` apropriado. A auditoria roda em `make validate`, então a regressão aparece no ato, não na publicação |
| A curadoria envelhece: repositório novo aparece na organização e ninguém acrescenta a entrada | alta | Consequência aceita da inclusão explícita que você escolheu. `make catalog` registra em log estruturado os repositórios públicos com commits **ausentes** da curadoria, para que a omissão seja visível sem quebrar a publicação |
| `dist/` prerenderizado não cobre uma rota nova e ela cai em 404 | baixa | `prerender-routes.txt` é gerado pelo mesmo passo que monta o catálogo, das mesmas entidades. Cenário BDD de `RF-15` abre a página de projeto por endereço direto |
| Node local (v22.12.0) está abaixo do mínimo do Angular CLI | certa | Nada roda fora do serviço `dev`. É exatamente o que o Princípio 1 já exige |

## Conformidade com a constituição

| Princípio | Como este plano o respeita |
|---|---|
| 1 — Contrato de operação | Nenhuma ferramenta é chamada direto: `ng`, `vitest`, `cucumber`, `lhci`, `eslint` e `prettier` só aparecem dentro de alvos do `Makefile`, executados por `docker compose exec dev`. Os dois alvos novos (`catalog`, `audit`) **estendem** o contrato e estão declarados acima; nenhum contorna. A emenda 1.0.1 acrescentou `audit` à cadeia do `make validate`, encerrando a contradição com o Princípio 9 |
| 2 — Arquitetura limpa | `core/` não importa Angular, Node, `fs` nem HTTP — só entidades e interfaces. `adapters/` e `infra/` conhecem `core`; nunca o inverso. Componente não injeta `HttpClient` e não guarda regra: chama caso de uso. Desvio único e declarado: dois entrypoints, por haver dois tempos de execução |
| 3 — Testes provam a entrega | Todo arquivo de produção tem teste espelhado em `app/tests/unit/<mesmo caminho>`, exceto os seis arquivos de fiação isentos pela emenda 1.0.2, cuja isenção está provada item a item na tabela acima — a regra que cada um poderia carregar mora em arquivo testado. Os arquivos de integração e BDD estão enumerados em seção própria, e nenhum diretório de teste fora de `unit/`, `it/` e `bdd/` é criado. Limiar de 90% por arquivo via `coverageThresholds` com `perFile`. Mocks pela interface, com `vi.spyOn` sobre a referência tipada — sem nome de método em string. Integração em `app/tests/it/` contra WireMock, sem mock interno. BDD em `app/tests/bdd/` a partir dos sete blocos Gherkin da spec, sem reescrita |
| 4 — Simplicidade defensável | Quatro padrões aplicados, todos por problema presente; seis considerados e recusados, com o motivo registrado. Nenhuma biblioteca de estado, de DI ou de cache foi adicionada — as três seriam antecipação |
| 5 — Autoria | Nenhum artefato deste plano credita ferramenta de IA. `.github/workflows/publish.yml` publica com o autor configurado no repositório |
| 6 — Idioma | Spec, plano, tarefas e mensagens de commit em português do Brasil; cenários em `# language: pt`; identificadores de código em inglês; conteúdo do sítio em pt-BR por `RNF-07` |
| 7 — Publicação estática | `outputMode: "static"` e `prerender.routesFile` — o build produz diretório servível por qualquer servidor de arquivos, e `make bdd` prova isso servindo `dist/` com servidor de arquivos puro. Nenhum SSR, nenhuma função de servidor, nenhuma reescrita de rota. `RF-12` vira `404.html` estático. A emenda 1.0.1 autorizou expressamente a credencial de build que não entra no artefato, e o `GITHUB_TOKEN` de `make catalog` é exatamente esse caso: ele constrói a página e não chega ao visitante |
| 8 — O catálogo deriva do GitHub | Todo dado exibido nasce em `github_organization_client`; nenhum componente carrega texto de projeto. A curadoria vive em `app/data/curation.json`, versionada e fora do código, e cada entrada referencia o repositório que descreve. `assemble_catalog_use_case` exclui privado, arquivado e vazio ainda que a curadoria os declare |
| 9 — Acessibilidade e performance medidas | `make audit` roda headless e entra em `make validate`. Lighthouse ≥ 90 nas quatro categorias em perfil móvel; `axe` falhando em violação crítica ou séria; `budgets` do builder cobrindo `RNF-04`; `RNF-05` verificado por viewport de 320 px no BDD; `RF-13` anuncia a contagem por região viva, o que é o que faz a restrição de `RF-11` existir para quem usa leitor de tela. `check_links.sh` fecha `RNF-06` e `RNF-10` sobre o `dist/` construído, e `total-byte-weight` mede `RNF-04` em bytes de rede, que é a unidade que o requisito pede |

### Emendas à constituição — aplicadas

As duas tensões registradas na primeira versão deste plano foram decididas pelo usuário em
2026-08-30 e a constituição subiu para **1.0.1**, emenda de redação que não remove nem inverte
princípio:

1. **Princípio 7** passou a distinguir credencial *no artefato publicado* — proibida, e é o que
   o princípio sempre quis impedir — de credencial *de build que nunca entra no artefato*, agora
   permitida, com o ônus da prova sobre quem a introduz.
2. **Princípio 1** ganhou `audit` na cadeia do `make validate`, e o Princípio 9 passou a nomear
   o alvo. A contradição entre os dois deixou de existir.

Uma terceira emenda foi decidida em 2026-08-31, elevando a constituição a **1.0.2**:

3. **Princípio 3** passou a definir a isenção de cobertura pela **natureza do arquivo** — o que
   apenas constrói e liga serviços reais — em vez da lista de dois nomes, que deixava
   `main_catalog`, `main_report` e `cli_ioc_init` isentos só por analogia e `web_init` sem
   isenção nenhuma. A isenção agora exige prova, apresentada acima.
