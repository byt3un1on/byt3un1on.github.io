# Plano de implementação — Esteira de entrega contínua da vitrine

> Descreve **como**. Deriva da spec e da constituição; não introduz requisito novo.

## Ideia central

O GitHub Actions só encontra fluxo em `<repo>/.github/workflows/`, fora de `app/`. Isso não
é licença para pôr regra de negócio lá. O plano separa as duas coisas de forma dura:

- **O que decide vive em `app/`**, como caso de uso com teste espelhado: qual é a próxima
  versão, qual modo está em vigor, se o portão aprova, qual foi a causa da falha, e o que o
  resumo diz. É código TypeScript, tipado, mockado e coberto a 90%.
- **O YAML só encadeia e chama o contrato de operação.** Cada job é `checkout` + `make <alvo>`
  + resumo. Nenhum `if` de negócio, nenhuma conta de versão, nenhuma montagem de texto em
  `shell`. É essa disciplina que faz caber em ≤ 6 passos por job (RNF-02) e que mantém o
  Princípio 1 de pé.

O critério prático: se uma linha de YAML precisar de um teste para alguém confiar nela, ela
está no lugar errado.

## Decisões técnicas

| Decisão | Escolha | Alternativas descartadas | Por quê |
|---|---|---|---|
| Onde vive a decisão da esteira | Casos de uso em `app/core/application/pipeline/`, chamados por `make pipeline <subcomando>` | Lógica em `run:` de shell no YAML; ação composta em JavaScript dentro de `.github/actions/` | Shell no YAML não tem tipo, não tem teste e não tem cobertura — as três coisas que a constituição exige. Ação composta continuaria fora de `app/` e fora do contrato de operação |
| Entrypoint da esteira | `main_pipeline.ts` + `pipeline_cli_entry.ts` próprios, ao lado dos existentes | Acrescentar os subcomandos a `cli_entry.ts` | `cli_entry` já decide entre catálogo e reporte; somar cinco subcomandos o faria crescer além do limite de função pequena e misturaria dois assuntos (SRP) |
| Como o fluxo seguinte é disparado | Evento de revisão de Pull Request (`pull_request_review`, estado aprovado), sob credencial dedicada em segredo | `workflow_run` encadeado; `repository_dispatch` | O pedido encadeia por **aprovação**, e a aprovação é o evento de revisão. A credencial padrão da execução não dispara outro fluxo (RF-20) |
| Origem do dado de versão | Repositório de histórico local (`git`), após `checkout` com histórico completo | Cliente da API de releases do GitHub | O dado já está no clone; um cliente HTTP acrescentaria rede, cota e simulação para ler o que `git tag` responde de graça |
| Construção única | Job de construção publica o diretório servível como artefato; auditoria e comportamento o consomem | Cada job reconstruir o sítio | Esclarecimento 6. Evita três construções e três chamadas de catálogo à API do GitHub |
| Como auditoria e comportamento rodam sem reconstruir | Alvos novos `audit-only` e `bdd-only`; `audit` e `bdd` passam a delegar a eles, com **comportamento externo idêntico** | `SKIP_BUILD=1` nos alvos existentes; reconstruir mesmo assim | Alvo novo é o que o Princípio 1 manda fazer quando falta um. Delegar preserva `make audit` e `make bdd` exatamente como estão para quem os usa na máquina |
| Verificação de formatação | Alvo `fmt` roda e o job reprova se a árvore ficar suja, com os nomes dos arquivos no resumo | `prettier --check` direto no YAML; alvo `fmt-check` novo | Esclarecimento 5: sem alvo novo e sem empurrar formatação de volta. Chamar `prettier` no YAML violaria o Princípio 1 |
| Como o BDD enxerga os fluxos | `.github/` montado somente-leitura no serviço `dev` | Copiar os YAML para dentro de `app/`; testar por chamada à API do GitHub | Hoje o compose monta só `app/`. Cópia criaria duas verdades; API exigiria rede e credencial para afirmar sobre arquivo que está no disco |
| Formato do resumo | Markdown escrito no arquivo apontado por `GITHUB_STEP_SUMMARY`, um bloco por job | Comentário em Pull Request; anotação de log | O resumo da execução é onde quem acompanha já olha, e não polui a Pull Request a cada push |
| Modo da esteira | Variável de repositório lida do ambiente, com marcação na Pull Request de feature como exceção | Entrada de disparo manual; arquivo versionado | Esclarecimento 2 |
| Primeira versão | Constante de domínio `v1.0.0`, devolvida sem incremento quando não há marca anterior | Ler a versão de `app/package.json`; começar em `v0.1.0` | Esclarecimento 11. Ler o `package.json` criaria duas fontes para o mesmo número e faria a versão publicada depender de um arquivo que ninguém atualiza |

## Padrões de projeto aplicados

| Padrão | Onde | Problema que resolve | Custo aceito |
|---|---|---|---|
| Command | `app/adapters/commands/*_command.ts` | Cada subcomando da esteira é uma entrada de CLI com ciclo próprio de erro e código de saída; o padrão já é o vocabulário do repositório | Uma classe fina por subcomando |
| Strategy (implícito, por injeção) | `render_run_summary_use_case` recebe o classificador de falha | Permite renderizar resumo sem conhecer como a causa foi classificada | Uma interface a mais |

**Considerados e recusados:**

| Padrão | Por que não |
|---|---|
| Chain of Responsibility na classificação de falha | São quatro causas mutuamente exclusivas decididas por correspondência de texto. Uma cadeia de elos acrescentaria quatro classes para substituir uma função de 12 linhas — complexidade sem problema presente (Princípio 4) |
| State para o estágio da esteira | O estágio não é guardado em lugar nenhum: cada execução é disparada por um evento que já diz onde está. Não há máquina de estado a modelar |
| Builder para o texto do resumo | O resumo tem três campos e uma forma. Concatenação em função pequena resolve; um builder seria cerimônia |
| Factory para o cliente de versão | Há uma implementação só de leitura de histórico. Fábrica para escolher entre uma opção é indireção pura |

## Arquivos a criar ou alterar

### Domínio — `core/domain`

| Camada | Arquivo | Ação | Teste espelhado |
|---|---|---|---|
| core/domain | `app/core/domain/models/semantic_version_model.ts` | criar | `app/tests/unit/core/domain/models/semantic_version_model.test.ts` |
| core/domain | `app/core/domain/dtos/conventional_commit_dto.ts` | criar | `app/tests/unit/core/domain/dtos/conventional_commit_dto.test.ts` |
| core/domain | `app/core/domain/dtos/pipeline_job_result_dto.ts` | criar | `app/tests/unit/core/domain/dtos/pipeline_job_result_dto.test.ts` |
| core/domain | `app/core/domain/enums/pipeline_mode_enum.ts` | criar | `app/tests/unit/core/domain/enums/pipeline_mode_enum.test.ts` |
| core/domain | `app/core/domain/enums/version_bump_enum.ts` | criar | `app/tests/unit/core/domain/enums/version_bump_enum.test.ts` |
| core/domain | `app/core/domain/enums/pipeline_failure_cause_enum.ts` | criar | `app/tests/unit/core/domain/enums/pipeline_failure_cause_enum.test.ts` |
| core/domain | `app/core/domain/errors/pipeline_failure_error.ts` | criar | `app/tests/unit/core/domain/errors/pipeline_failure_error.test.ts` |

`semantic_version_model` interpreta `vX.Y.Z`, recusa entrada malformada nomeando o recebido e o
esperado, e devolve a versão elevada. `conventional_commit_dto` interpreta uma mensagem de
commit e responde tipo, escopo, incompatibilidade e assunto. Cada enumeração traz o tipo e o
seu verificador — é o verificador que carrega decisão e é ele que o teste exercita.

### Aplicação — `core/application/pipeline`

| Camada | Arquivo | Ação | Teste espelhado |
|---|---|---|---|
| core/application | `app/core/application/pipeline/classify_version_bump_use_case.ts` | criar | `app/tests/unit/core/application/pipeline/classify_version_bump_use_case.test.ts` |
| core/application | `app/core/application/pipeline/resolve_next_version_use_case.ts` | criar | `app/tests/unit/core/application/pipeline/resolve_next_version_use_case.test.ts` |
| core/application | `app/core/application/pipeline/resolve_pipeline_mode_use_case.ts` | criar | `app/tests/unit/core/application/pipeline/resolve_pipeline_mode_use_case.test.ts` |
| core/application | `app/core/application/pipeline/evaluate_quality_gate_use_case.ts` | criar | `app/tests/unit/core/application/pipeline/evaluate_quality_gate_use_case.test.ts` |
| core/application | `app/core/application/pipeline/classify_pipeline_failure_use_case.ts` | criar | `app/tests/unit/core/application/pipeline/classify_pipeline_failure_use_case.test.ts` |
| core/application | `app/core/application/pipeline/render_run_summary_use_case.ts` | criar | `app/tests/unit/core/application/pipeline/render_run_summary_use_case.test.ts` |

### Adapters

| Camada | Arquivo | Ação | Teste espelhado |
|---|---|---|---|
| adapters/repositories | `app/adapters/repositories/git_history_repository.ts` | criar | `app/tests/unit/adapters/repositories/git_history_repository.test.ts` |
| adapters/repositories | `app/adapters/repositories/run_summary_repository.ts` | criar | `app/tests/unit/adapters/repositories/run_summary_repository.test.ts` |
| adapters/commands | `app/adapters/commands/resolve_version_command.ts` | criar | `app/tests/unit/adapters/commands/resolve_version_command.test.ts` |
| adapters/commands | `app/adapters/commands/resolve_mode_command.ts` | criar | `app/tests/unit/adapters/commands/resolve_mode_command.test.ts` |
| adapters/commands | `app/adapters/commands/evaluate_gate_command.ts` | criar | `app/tests/unit/adapters/commands/evaluate_gate_command.test.ts` |
| adapters/commands | `app/adapters/commands/write_summary_command.ts` | criar | `app/tests/unit/adapters/commands/write_summary_command.test.ts` |

`git_history_repository` lê a última versão marcada e as mensagens de commit desde ela.
`run_summary_repository` acrescenta um bloco ao arquivo de resumo apontado pelo ambiente, e é
o único ponto que escreve em disco — os casos de uso devolvem texto, não gravam.

### Infra

| Camada | Arquivo | Ação | Teste espelhado |
|---|---|---|---|
| infra/cli | `app/infra/cli/pipeline_cli_entry.ts` | criar | `app/tests/unit/infra/cli/pipeline_cli_entry.test.ts` |
| infra/init | `app/infra/init/pipeline_ioc_init.ts` | criar | — (fiação, isenta pelo Princípio 3) |
| infra/tools | `app/infra/tools/config_tool.ts` | alterar | `app/tests/unit/infra/tools/config_tool.test.ts` (estender) |
| raiz de `app/` | `app/main_pipeline.ts` | criar | — (entrypoint, isento pelo Princípio 3) |
| raiz de `app/` | `app/angular.json` | alterar | — (configuração; acrescenta `main_pipeline.ts` e `infra/init/pipeline_ioc_init.ts` a `coverageExclude`, pela mesma natureza de fiação dos já isentos) |

`config_tool` ganha sete acessos — `pipelineMode()`, `pipelineModeLabel()`, `runSummaryPath()`,
`pipelineResults()`, `summaryJob()`, `summaryStatus()` e `summaryDetail()` —, cada um com
consumidor de produção declarado. São sete e não três porque **todo dado da esteira viaja por
ambiente**: argumento de `make` quebra em espaços, e `"Análise estática=success"` viraria dois
alvos. Nenhuma leitura nova de ambiente acontece fora deste arquivo. O caminho de `.github`
**não** entra aqui: quem o lê é o motor de BDD, que é teste, e um acesso de produção sem
consumidor seria YAGNI (Princípio 4).

### Interfaces

| Camada | Arquivo | Ação | Teste espelhado |
|---|---|---|---|
| interfaces | `app/interfaces/core/application/pipeline/i_classify_version_bump_use_case.ts` | criar | — |
| interfaces | `app/interfaces/core/application/pipeline/i_resolve_next_version_use_case.ts` | criar | — |
| interfaces | `app/interfaces/core/application/pipeline/i_resolve_pipeline_mode_use_case.ts` | criar | — |
| interfaces | `app/interfaces/core/application/pipeline/i_evaluate_quality_gate_use_case.ts` | criar | — |
| interfaces | `app/interfaces/core/application/pipeline/i_classify_pipeline_failure_use_case.ts` | criar | — |
| interfaces | `app/interfaces/core/application/pipeline/i_render_run_summary_use_case.ts` | criar | — |
| interfaces | `app/interfaces/adapters/repositories/i_git_history_repository.ts` | criar | — |
| interfaces | `app/interfaces/adapters/repositories/i_run_summary_repository.ts` | criar | — |
| interfaces | `app/interfaces/adapters/commands/i_resolve_version_command.ts` | criar | — |
| interfaces | `app/interfaces/adapters/commands/i_resolve_mode_command.ts` | criar | — |
| interfaces | `app/interfaces/adapters/commands/i_evaluate_gate_command.ts` | criar | — |
| interfaces | `app/interfaces/adapters/commands/i_write_summary_command.ts` | criar | — |
| interfaces | `app/interfaces/infra/cli/i_pipeline_cli_entry.ts` | criar | — |
| interfaces | `app/interfaces/infra/tools/i_config_tool.ts` | alterar | — |

### Testes de integração e de comportamento

| Camada | Arquivo | Ação | O que exercita |
|---|---|---|---|
| tests/it | `app/tests/it/adapters/repositories/git_history_repository_test_integration.ts` | criar | leitura de marca e de histórico contra repositório git real, criado e descartado pelo próprio teste |
| tests/it | `app/tests/it/adapters/repositories/run_summary_repository_test_integration.ts` | criar | escrita e acréscimo no arquivo de resumo, em diretório temporário |
| tests/it | `app/tests/it/infra/cli/pipeline_cli_entry_test_integration.ts` | criar | os quatro subcomandos ponta a ponta, com fiação real e sistema de arquivos temporário |
| tests/bdd | `app/tests/bdd/features/validacao_da_feature.feature` | criar | RF-01 a RF-05, RF-16, RNF-05 |
| tests/bdd | `app/tests/bdd/features/promocao_entre_branches.feature` | criar | RF-06 a RF-08, RF-10, RF-14, RF-15, RF-17 |
| tests/bdd | `app/tests/bdd/features/modos_de_aprovacao.feature` | criar | RF-09, RF-19 |
| tests/bdd | `app/tests/bdd/features/legibilidade_da_esteira.feature` | criar | RF-11, RF-12, RF-18, RNF-01, RNF-02, RNF-07 |
| tests/bdd | `app/tests/bdd/support/workflow_driver.ts` | criar | lê e interpreta as definições em `.github/workflows`, montadas somente-leitura |
| tests/bdd | `app/tests/bdd/support/pipeline_driver.ts` | criar | exercita os casos de uso da esteira — versão, modo, portão, causa e resumo — sem rede, sem navegador e sem processo |
| tests/bdd | `app/tests/bdd/steps/pipeline/definition_steps.ts` | criar | passos sobre a forma dos fluxos: jobs, nomes, passos, dependências, gatilhos |
| tests/bdd | `app/tests/bdd/steps/pipeline/decision_steps.ts` | criar | passos sobre a decisão: versão, modo, portão, causa, resumo — chamando os casos de uso |

Os cenários novos recebem a etiqueta `@esteira`. Nenhum deles sobe navegador: a esteira é
afirmação sobre definição e sobre decisão, não sobre página.

### Fora de `app/` — exceção declarada

O GitHub Actions resolve fluxo **apenas** em `<repositório>/.github/workflows`, e proprietários
de código **apenas** em `CODEOWNERS` na raiz, em `docs/` ou em `.github/`. Não há como cumprir
RF-01 a RF-08, RF-18 e RF-19 dentro de `app/`. Estes arquivos entram como **configuração do
repositório**, na mesma classe de `.gitignore` e `README.md` que o próprio projeto já mantém
fora de `app/` — e nenhum deles carrega decisão, por construção do plano.

| Arquivo | Ação | Requisito | Jobs |
|---|---|---|---|
| `.github/workflows/validar.yml` | criar | RF-01 a RF-05, RF-16, RNF-05 | `Formatação`, `Análise estática`, `Testes unitários`, `Cobertura 90%`, `Integração`, `Construção`, `Auditoria`, `Comportamento`, `Portão`, `PR para develop` |
| `.github/workflows/promover-develop.yml` | criar | RF-06, RF-09, RF-10, RF-17 | `Modo`, `Merge develop`, `Versão`, `Branch release`, `PR para release`, `Resumo` |
| `.github/workflows/promover-release.yml` | criar | RF-07, RF-09, RF-17 | `Modo`, `Merge release`, `PR para master`, `Resumo` |
| `.github/workflows/publicar-master.yml` | criar | RF-08, RF-14, RF-17 | `Construção`, `Auditoria`, `Publicação`, `Merge master`, `Tag e release`, `Resumo` |
| `.github/workflows/publicar-catalogo.yml` | criar | RF-18 | `Catálogo`, `Construção`, `Auditoria`, `Publicação`, `Registro` |
| `.github/workflows/publish.yml` | remover | RF-18 | substituído por `publicar-catalogo.yml`, com as mesmas responsabilidades em jobs separados |
| `.github/CODEOWNERS` | criar | RF-19 | — |

Todo nome de job acima tem no máximo 20 caracteres (RNF-01) e nenhum job passa de 6 passos
(RNF-02) — é o que os cenários de `legibilidade_da_esteira.feature` medem.

## Contrato entre camadas

```
.github/workflows/*.yml
        │  chama apenas alvos do Makefile; não decide nada
        ▼
   make pipeline <subcomando>          make fmt | lint | test | cover | it
        │                              make build | audit-only | bdd-only
        ▼
   main_pipeline.ts  ──►  pipeline_ioc_init  ──►  PipelineCliEntry
                                                       │
                        ┌──────────────────────────────┤
                        ▼                              ▼
              adapters/commands/*            (decide qual comando)
                        │
                        ▼
        core/application/pipeline/*_use_case      ◄── recebe abstrações
                        │                              nunca implementações
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
 git_history_       run_summary_    core/domain
 repository         repository      (models, dtos, enums, errors)
```

- **Sentido da dependência**: `core` não importa `adapters` nem `infra`. Os casos de uso
  recebem `IGitHistoryRepository` e `IRunSummaryRepository` por construtor e devolvem texto ou
  valor de domínio — nunca escrevem em disco nem chamam processo.
- **O que trafega**: `SemanticVersionModel`, `ConventionalCommitDto`, `PipelineJobResultDto`,
  `PipelineMode`, `VersionBump`, `PipelineFailureCause`. Nenhum tipo do GitHub cruza a
  fronteira: o que vem do ambiente é convertido no adapter.
- **Onde o erro é tratado**: o caso de uso lança `PipelineFailureError` com a causa nomeada; o
  comando o captura, grava o bloco de resumo com a causa e devolve código de saída não-zero.
  O YAML não interpreta erro — só propaga o código.
- **Códigos de saída**: `0` sucesso; `1` portão reprovado ou falha classificada; `2` uso
  inválido do subcomando. Igual ao que `cli_entry` já pratica.

## Dependências externas

| Dependência | Versão | Justificativa | Simulada nos testes por |
|---|---|---|---|
| `actions/checkout` | v5 | obter o código e, na esteira de versão, o histórico completo | não se aplica — o BDD afirma sobre a declaração, não executa a ação |
| `actions/upload-artifact` / `actions/download-artifact` | v4 | levar o diretório servível construído até auditoria, comportamento e publicação (RF-14, RNF-05) | idem |
| `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages` | v5 / v4 / v4 | publicar por ação, decisão do esclarecimento 7 | idem |
| `yaml` (interpretador) | ^2 | o motor de BDD precisa ler as definições de fluxo para medir nomes, passos e dependências | não se aplica — é a própria ferramenta de leitura do teste |
| `git` (executável) | já presente na imagem | `git_history_repository` lê marca e histórico | repositório git temporário criado pelo teste de integração |
| `gh` (executável) | disponível no executor do GitHub | abrir, atualizar e aprovar Pull Request, criar marca e release | não se aplica — vive no YAML, sem decisão |

Nenhuma dependência nova entra em tempo de execução do sítio: `yaml` é dependência de
desenvolvimento, e o artefato publicado não a contém (RNF-06).

## Impacto no contrato de operação

**Alvos novos no `Makefile`:**

| Alvo | O que faz |
|---|---|
| `make pipeline <subcomando>` | executa `main_pipeline.ts` dentro do serviço `dev`; subcomandos `version`, `mode`, `gate`, `summary`. Silencioso, para a saída poder ser capturada ou redirecionada ao resumo. Os dados chegam por variável de ambiente, nunca por argumento |
| `make audit-only` | roda a auditoria **sem** reconstruir, sobre o diretório servível já presente |
| `make bdd-only` | roda os cenários **sem** reconstruir nem reauditar |

**Alvos alterados sem mudança de comportamento externo:**

- `audit: build` passa a delegar sua receita a `audit-only`;
- `bdd: build audit` passa a delegar sua receita a `bdd-only`, preservando a dependência de
  auditoria que existe por causa dos cenários que afirmam sobre o relatório.

`make validate` continua encadeando os mesmos sete alvos, na mesma ordem, com o mesmo efeito.

**Compose:** o serviço `dev` passa a montar `../.github` em `/app/.github`, **somente leitura**,
para que os cenários de legibilidade leiam as definições de fluxo. Montagem de leitura não dá
ao container poder de alterar a esteira.

**Variáveis de ambiente novas**, todas lidas exclusivamente por `config_tool`:

| Variável | Origem | Para quê |
|---|---|---|
| `ESTEIRA_MODO` | variável do repositório | modo padrão da esteira; ausente, vale `automatico` (RF-09) |
| `ESTEIRA_MODO_ROTULO` | marcação da Pull Request de feature | força o modo manual naquela cadeia (RF-09) |
| `ESTEIRA_TOKEN` | segredo do repositório | credencial dedicada da esteira (RF-20) |
| `ESTEIRA_RESULTADOS` | job `Portão`, em JSON | resultados dos jobs que o portão avalia (RF-05) |
| `ESTEIRA_JOB`, `ESTEIRA_STATUS`, `ESTEIRA_DETALHE` | cada job, no passo de resumo | o bloco que o resumo recebe (RF-12) |
| `ESTEIRA_RESUMO` | opcional | arquivo onde o resumo é acrescentado; ausente, o resumo sai por stdout e o YAML o redireciona |

`ESTEIRA_TOKEN` é credencial de **build**, no sentido do Princípio 7: existe no executor,
nunca entra no diretório servível e não é lida por nenhum código de apresentação.

## Rastreabilidade — requisito para arquivo

| Requisito | Onde é cumprido |
|---|---|
| RF-01 | `.github/workflows/validar.yml` (gatilho e nome dinâmico da execução) |
| RF-02 | `validar.yml` (sete jobs de verificação) + `Makefile` (`audit-only`, `bdd-only`) |
| RF-03 | `evaluate_quality_gate_use_case` + `render_run_summary_use_case` + job `Cobertura 90%` |
| RF-04 | `validar.yml`, job `PR para develop` |
| RF-05 | `evaluate_quality_gate_use_case` + job `Portão` |
| RF-06 | `.github/workflows/promover-develop.yml` + `resolve_next_version_use_case` |
| RF-07 | `.github/workflows/promover-release.yml` |
| RF-08 | `.github/workflows/publicar-master.yml` |
| RF-09 | `resolve_pipeline_mode_use_case` + `config_tool` + job `Modo` dos três fluxos de promoção |
| RF-10 | `classify_version_bump_use_case` + `resolve_next_version_use_case` (inclusive o caso sem versão anterior, que devolve `v1.0.0` sem incremento) + `semantic_version_model` + `conventional_commit_dto` + `git_history_repository` |
| RF-11 | os cinco fluxos; medido por `legibilidade_da_esteira.feature` |
| RF-12 | `render_run_summary_use_case` + `run_summary_repository` + `write_summary_command` |
| RF-13 | `evaluate_quality_gate_use_case` + dependência entre jobs em cada fluxo |
| RF-14 | `validar.yml` (artefato) + `publicar-master.yml` (consumo do artefato) |
| RF-15 | `classify_pipeline_failure_use_case` + `pipeline_failure_error` + `pipeline_failure_cause_enum` |
| RF-16 | `validar.yml`, job `Formatação` + `write_summary_command` |
| RF-17 | `classify_pipeline_failure_use_case` (causa `conflito`) + jobs de merge |
| RF-18 | `.github/workflows/publicar-catalogo.yml` (substitui `publish.yml`) |
| RF-19 | `.github/CODEOWNERS` |
| RF-20 | `config_tool` + `classify_pipeline_failure_use_case` (causa `credencial`) + segredo nos fluxos |
| RNF-01 | nomes de job dos cinco fluxos; medido por `legibilidade_da_esteira.feature` |
| RNF-02 | forma dos jobs; medido por `legibilidade_da_esteira.feature` |
| RNF-03 | `make cover` no job `Cobertura 90%`, limiar já vigente em `angular.json` |
| RNF-04 | `make audit-only` no job `Auditoria`, limiar já vigente em `lighthouserc.json` |
| RNF-05 | grafo de dependências de `validar.yml`; medido por `validacao_da_feature.feature` |
| RNF-06 | artefato publicado contém apenas o diretório servível; medido no job `Publicação` |
| RNF-07 | tempo máximo declarado em todo job dos cinco fluxos |
| RNF-08 | `render_run_summary_use_case` (limite de três linhas na causa) |

## Riscos

| Risco | Probabilidade | Mitigação |
|---|---|---|
| A credencial dedicada não existe quando a esteira roda pela primeira vez | alta | RF-20 já exige falha explícita nomeando a causa. A criação do segredo é ato do proprietário, declarada em *Fora de escopo* na spec, e será apontada na entrega |
| Mudar o GitHub Pages para publicação por ação derruba o sítio se algo falhar no meio | média | A troca é feita **depois** de o fluxo de publicação estar verde em execução de teste; a publicação anterior continua no ar até a nova concluir |
| Aprovação automática exige que a identidade da esteira seja diferente da que abriu a Pull Request | alta | É exatamente o que a credencial dedicada resolve (esclarecimento 4). O fluxo falha declarando a causa se as identidades coincidirem |
| Proteção de `master` com revisão obrigatória pode barrar o merge feito pela esteira | média | A esteira integra por Pull Request aprovada, que é o caminho que a proteção espera; nenhum passo empurra direto para `master` |
| O artefato transportado entre jobs perde permissões ou caminhos | baixa | O job `Comportamento` serve o diretório baixado e exercita o sítio — se o transporte quebrar o artefato, o cenário reprova antes da publicação |
| Testes de comportamento passam a depender de `.github` montado, e quebram fora do compose | média | O motor de leitura reprova com mensagem nomeando o caminho ausente e o esperado, em vez de falhar por arquivo não encontrado |
| `git log` sem histórico completo devolve versão errada | média | O `checkout` dos fluxos de versão declara profundidade completa; `git_history_repository` recusa histórico raso nomeando o recebido e o esperado |

## Conformidade com a constituição

| Princípio | Como este plano o respeita |
|---|---|
| **1 — Contrato de operação** | Nenhum fluxo invoca ferramenta de linguagem: todo job chama um alvo do `Makefile`, e o que faltava vira alvo novo (`pipeline`, `audit-only`, `bdd-only`) em vez de contorno. Os alvos existentes preservam comportamento. Tudo roda no serviço `dev` |
| **2 — Arquitetura limpa** | Toda decisão vive em `core/application/pipeline` e `core/domain`, que não importam `adapters` nem `infra`. Processo e disco ficam em `adapters/repositories`; leitura de ambiente, em `infra/tools`. Cada abstração espelha a hierarquia em `interfaces/`. Os YAML ficam fora por exigência do GitHub, e por isso mesmo não recebem decisão alguma |
| **3 — Testes provam a entrega** | Cada arquivo de produção tem teste espelhado no caminho espelhado; só `main_pipeline.ts` e `pipeline_ioc_init.ts` são isentos, por apenas construírem e ligarem serviços reais. Testes atômicos, nome no padrão *deve … quando …*, corpo em Arrange/Act/Assert, dependências injetadas mockadas com referência ao tipo — nunca por texto. Integração contra git e disco reais em diretório temporário; comportamento a partir dos critérios de aceite da spec |
| **4 — Simplicidade defensável** | Dois padrões aplicados, quatro considerados e recusados com motivo. Um cliente HTTP foi descartado porque `git` já responde. Nenhuma abstração criada por antecipação |
| **5 — Autoria** | Nenhum artefato produzido pela esteira — mensagem de commit de merge, corpo de Pull Request, texto de release, resumo de execução — credita ferramenta de IA. Os textos são gerados por casos de uso cujo conteúdo é fixado em teste |
| **6 — Idioma** | Spec, plano, tarefas, cenários e nomes de job em português do Brasil; identificadores de código em inglês, como o repositório já pratica |
| **7 — Publicação estática** | O que a esteira publica é o diretório servível construído por `make build` — sem runtime de servidor, sem rota que dependa de reescrita. `ESTEIRA_TOKEN` é credencial de build: vive no executor, não entra no artefato, e o job `Publicação` envia apenas o diretório servível |
| **8 — O catálogo deriva do GitHub** | A esteira não toca em curadoria nem em conteúdo de projeto. `publicar-catalogo.yml` preserva a montagem do catálogo pela API e o registro de desfecho que hoje existem |
| **9 — Acessibilidade e performance são medidas** | O job `Auditoria` roda antes de qualquer publicação, nos dois fluxos que publicam, com os limiares já vigentes. Reprovação bloqueia a cadeia (RF-13) |
