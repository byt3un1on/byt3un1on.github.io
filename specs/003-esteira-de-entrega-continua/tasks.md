# Tarefas — Esteira de entrega contínua da vitrine

> Ordem de dependência. `[P]` marca tarefa paralelizável (não toca arquivo de outra `[P]`
> da mesma fase). Teste vem antes da implementação que ele prova.

**Por que a ordem é esta.** Os cenários desta feature afirmam sobre duas coisas de natureza
diferente, e por isso não cabem numa fase só:

- **forma da esteira** — nome de job, número de passos, dependência entre jobs, gatilho,
  artefato transportado. Lê-se a definição do fluxo; não se executa nada. Estes cenários podem
  existir antes de qualquer linha de produção, e é o que a **Fase 3** faz: eles reprovam até a
  **Fase 8** escrever os fluxos;
- **decisão da esteira** — qual versão, qual modo, se o portão aprova, qual a causa da falha,
  o que o resumo diz. Estes cenários chamam caso de uso, e um passo que importa módulo
  inexistente quebra a suíte inteira em vez de reprovar o cenário. Por isso vêm na **Fase 9**,
  depois do código que eles exercitam existir — mas antes de qualquer ajuste fino.

**Sobre `[P]` no par teste + implementação.** Pares de arquivos diferentes são paralelizáveis
entre si; **dentro** de um par, o teste é escrito antes da implementação, na mesma passagem de
quem o executar. Marcar o par inteiro como `[P]` significa "este arquivo não disputa escrita
com nenhum outro `[P]` desta fase", nunca "pode implementar sem o teste".

> **Correção de ordem, 2026-09-01, feita no início da implementação.** As Contratos da Fase 1
> importam tipos declarados na Fase 4 (`VersionBump`, `PipelineMode`, `PipelineFailureCause`,
> `SemanticVersionModel`), então a Fase 1 não compila antes da Fase 4. A numeração das fases
> fica como está — é a ela que a rastreabilidade se refere —, mas a **ordem de execução** é:
>
> **4 → 1 → 5 → 6 → 7 → 2 → 3 → 8 → 9 → 10**
>
> A dependência real é domínio → contratos → aplicação e adapters → infra; os cenários de forma
> (Fase 3) continuam antes dos fluxos que medem (Fase 8), e os de decisão (Fase 9) continuam
> depois dos casos de uso que exercitam.

---

## Fase 1 — Contratos

Nada nas fases seguintes compila sem estas abstrações. Todas são arquivos novos e disjuntos.

- [x] T001 [P] `app/interfaces/core/application/pipeline/i_classify_version_bump_use_case.ts`
- [x] T002 [P] `app/interfaces/core/application/pipeline/i_resolve_next_version_use_case.ts`
- [x] T003 [P] `app/interfaces/core/application/pipeline/i_resolve_pipeline_mode_use_case.ts`
- [x] T004 [P] `app/interfaces/core/application/pipeline/i_evaluate_quality_gate_use_case.ts`
- [x] T005 [P] `app/interfaces/core/application/pipeline/i_classify_pipeline_failure_use_case.ts`
- [x] T006 [P] `app/interfaces/core/application/pipeline/i_render_run_summary_use_case.ts`
- [x] T007 [P] `app/interfaces/adapters/repositories/i_git_history_repository.ts`
- [x] T008 [P] `app/interfaces/adapters/repositories/i_run_summary_repository.ts`
- [x] T009 [P] `app/interfaces/adapters/commands/i_resolve_version_command.ts`
- [x] T010 [P] `app/interfaces/adapters/commands/i_resolve_mode_command.ts`
- [x] T011 [P] `app/interfaces/adapters/commands/i_evaluate_gate_command.ts`
- [x] T012 [P] `app/interfaces/adapters/commands/i_write_summary_command.ts`
- [x] T013 [P] `app/interfaces/infra/cli/i_pipeline_cli_entry.ts`
- [x] T014 Em `app/interfaces/infra/tools/i_config_tool.ts`, declarar `pipelineMode()`, `pipelineModeLabel()` e `runSummaryPath()` — arquivo existente, não paralelizável

## Fase 2 — Suporte de medição da forma

Sem isto nenhum cenário da Fase 3 existe. T015 é pré-requisito de T016: o motor não enxerga
`.github` enquanto o compose não o montar.

- [x] T015 Em `app/docker-compose.yml`, montar `../.github` em `/app/.github` somente leitura no serviço `dev`, com comentário registrando por que a esteira precisa ser legível de dentro do container
- [x] T016 Criar `app/tests/bdd/support/workflow_driver.ts`: lê e interpreta os fluxos de `.github/workflows` e o arquivo de proprietários, expondo jobs, nomes, passos, dependências, gatilhos e tempo máximo. Ausente o caminho montado, reprova nomeando o recebido e o esperado
- [x] T017 Criar `app/tests/bdd/steps/pipeline/definition_steps.ts` com os passos que afirmam sobre a forma, apoiados em T016

## Fase 3 — Cenários sobre a forma da esteira

Todos com a etiqueta `@esteira`, em `# language: pt`. **Reprovam até a Fase 8.** Os cenários de
um mesmo arquivo disputam escrita entre si e por isso não são `[P]`.

- [x] T018 Cenário *RF-01 — a execução se identifica pelo último commit* em `app/tests/bdd/features/validacao_da_feature.feature`
- [x] T019 Cenário *RF-02 — as sete verificações são sete jobs* em `app/tests/bdd/features/validacao_da_feature.feature`
- [x] T020 Cenário *RNF-05 — nada é esperado além do que a dependência real exige* em `app/tests/bdd/features/validacao_da_feature.feature`
- [x] T021 Cenário *RF-04 — validação aprovada abre a Pull Request com o título previsto* em `app/tests/bdd/features/validacao_da_feature.feature`
- [x] T022 Cenário *RF-04 — push seguinte não duplica a Pull Request* em `app/tests/bdd/features/validacao_da_feature.feature`
- [x] T023 [P] Cenário *RF-06 — aprovar a primeira PR promove a feature e abre a release* em `app/tests/bdd/features/promocao_entre_branches.feature`
- [x] T024 Cenário *RF-07 — aprovar a segunda PR leva develop à branch de release* em `app/tests/bdd/features/promocao_entre_branches.feature`
- [x] T025 Cenário *RF-08 — aprovar a terceira PR publica, integra, marca e libera* em `app/tests/bdd/features/promocao_entre_branches.feature`
- [x] T026 Cenário *RF-14 — publica o artefato que foi verificado* em `app/tests/bdd/features/promocao_entre_branches.feature`
- [x] T027 [P] Cenário *RF-19 — a aprovação exigida é de proprietário declarado* em `app/tests/bdd/features/modos_de_aprovacao.feature`
- [x] T028 [P] Cenário *RNF-01 — nome de job não é truncado* em `app/tests/bdd/features/legibilidade_da_esteira.feature`
- [x] T029 Cenário *RNF-02 — job pequeno, diagrama expressivo* em `app/tests/bdd/features/legibilidade_da_esteira.feature`
- [x] T030 Cenário *RNF-07 — nenhuma execução fica pendurada* em `app/tests/bdd/features/legibilidade_da_esteira.feature`
- [x] T031 Cenário *RF-18 — a publicação agendada também é legível* em `app/tests/bdd/features/legibilidade_da_esteira.feature`

## Fase 4 — Domínio

- [x] T032 [P] Teste de `app/tests/unit/core/domain/models/semantic_version_model.test.ts`
- [x] T033 [P] Implementar `app/core/domain/models/semantic_version_model.ts` — interpreta `vX.Y.Z`, eleva por incremento, recusa entrada malformada nomeando recebido e esperado
- [x] T034 [P] Teste de `app/tests/unit/core/domain/dtos/conventional_commit_dto.test.ts`
- [x] T035 [P] Implementar `app/core/domain/dtos/conventional_commit_dto.ts` — tipo, escopo, incompatibilidade e assunto a partir da mensagem
- [x] T036 [P] Teste de `app/tests/unit/core/domain/dtos/pipeline_job_result_dto.test.ts`
- [x] T037 [P] Implementar `app/core/domain/dtos/pipeline_job_result_dto.ts` — nome, situação e detalhe de um job
- [x] T038 [P] Teste de `app/tests/unit/core/domain/enums/pipeline_mode_enum.test.ts`
- [x] T039 [P] Implementar `app/core/domain/enums/pipeline_mode_enum.ts` — `automatico` e `manual`, com verificador
- [x] T040 [P] Teste de `app/tests/unit/core/domain/enums/version_bump_enum.test.ts`
- [x] T041 [P] Implementar `app/core/domain/enums/version_bump_enum.ts` — `major`, `minor`, `patch`, com verificador
- [x] T042 [P] Teste de `app/tests/unit/core/domain/enums/pipeline_failure_cause_enum.test.ts`
- [x] T043 [P] Implementar `app/core/domain/enums/pipeline_failure_cause_enum.ts` — `permissao`, `credencial`, `conflito`, `desconhecida`, com verificador
- [x] T044 [P] Teste de `app/tests/unit/core/domain/errors/pipeline_failure_error.test.ts`
- [x] T045 [P] Implementar `app/core/domain/errors/pipeline_failure_error.ts` — erro que carrega a causa nomeada e a mensagem original

## Fase 5 — Aplicação

- [x] T046 [P] Teste de `app/tests/unit/core/application/pipeline/classify_version_bump_use_case.test.ts`
- [x] T047 [P] Implementar `app/core/application/pipeline/classify_version_bump_use_case.ts` — mensagens de commit para incremento, com o maior incremento vencendo
- [x] T048 [P] Teste de `app/tests/unit/core/application/pipeline/resolve_next_version_use_case.test.ts`
- [x] T049 [P] Implementar `app/core/application/pipeline/resolve_next_version_use_case.ts` — última versão marcada mais incremento; **sem versão anterior, devolve `v1.0.0` sem aplicar incremento** (RF-10, esclarecimento 11)
- [x] T050 [P] Teste de `app/tests/unit/core/application/pipeline/resolve_pipeline_mode_use_case.test.ts`
- [x] T051 [P] Implementar `app/core/application/pipeline/resolve_pipeline_mode_use_case.ts` — variável do repositório, sobreposta pela marcação da Pull Request; ausentes as duas, `automatico`
- [x] T052 [P] Teste de `app/tests/unit/core/application/pipeline/evaluate_quality_gate_use_case.test.ts`
- [x] T053 [P] Implementar `app/core/application/pipeline/evaluate_quality_gate_use_case.ts` — resultados dos jobs para veredito, nomeando toda verificação reprovada
- [x] T054 [P] Teste de `app/tests/unit/core/application/pipeline/classify_pipeline_failure_use_case.test.ts`
- [x] T055 [P] Implementar `app/core/application/pipeline/classify_pipeline_failure_use_case.ts` — saída de erro para causa nomeada, com `desconhecida` como último recurso
- [x] T056 [P] Teste de `app/tests/unit/core/application/pipeline/render_run_summary_use_case.test.ts`
- [x] T057 [P] Implementar `app/core/application/pipeline/render_run_summary_use_case.ts` — bloco de resumo em Markdown, com a causa em no máximo três linhas

## Fase 6 — Adapters

- [x] T058 [P] Teste de `app/tests/unit/adapters/repositories/git_history_repository.test.ts`
- [x] T059 [P] Implementar `app/adapters/repositories/git_history_repository.ts` — última versão marcada e mensagens de commit desde ela; histórico raso reprova nomeando recebido e esperado
- [x] T060 [P] Teste de `app/tests/unit/adapters/repositories/run_summary_repository.test.ts`
- [x] T061 [P] Implementar `app/adapters/repositories/run_summary_repository.ts` — acrescenta bloco ao arquivo de resumo; ausente o caminho, registra e segue sem abortar a execução
- [x] T062 [P] Teste de `app/tests/unit/adapters/commands/resolve_version_command.test.ts`
- [x] T063 [P] Implementar `app/adapters/commands/resolve_version_command.ts`
- [x] T064 [P] Teste de `app/tests/unit/adapters/commands/resolve_mode_command.test.ts`
- [x] T065 [P] Implementar `app/adapters/commands/resolve_mode_command.ts`
- [x] T066 [P] Teste de `app/tests/unit/adapters/commands/evaluate_gate_command.test.ts`
- [x] T067 [P] Implementar `app/adapters/commands/evaluate_gate_command.ts`
- [x] T068 [P] Teste de `app/tests/unit/adapters/commands/write_summary_command.test.ts`
- [x] T069 [P] Implementar `app/adapters/commands/write_summary_command.ts`

## Fase 7 — Infra, fiação e contrato de operação

- [x] T070 Teste de `app/tests/unit/infra/cli/pipeline_cli_entry.test.ts`
- [x] T071 Implementar `app/infra/cli/pipeline_cli_entry.ts` — escolhe entre `version`, `mode`, `gate` e `summary`; subcomando desconhecido devolve código 2 nomeando o uso
- [x] T072 Estender `app/tests/unit/infra/tools/config_tool.test.ts` com os três acessos novos
- [x] T073 Alterar `app/infra/tools/config_tool.ts` com `pipelineMode()`, `pipelineModeLabel()` e `runSummaryPath()`
- [x] T074 Criar `app/infra/init/pipeline_ioc_init.ts` — fiação, isenta de cobertura pelo Princípio 3
- [x] T075 Criar `app/main_pipeline.ts` — entrypoint, isento de cobertura pelo Princípio 3
- [x] T076 Em `app/angular.json`, acrescentar `main_pipeline.ts` e `infra/init/pipeline_ioc_init.ts` a `coverageExclude`, pela mesma natureza dos já isentos — arquivo declarado no plano
- [x] T077 Em `app/Makefile`, criar `pipeline`, `audit-only` e `bdd-only`, e fazer `audit` e `bdd` delegarem a eles preservando comportamento externo

## Fase 8 — Os fluxos e os proprietários

É aqui que os cenários da Fase 3 passam a aprovar. Cada fluxo é arquivo próprio e disjunto.

- [x] T078 [P] Criar `.github/workflows/validar.yml` — gatilho em `feature/**`, execução identificada pelo último commit, jobs `Formatação`, `Análise estática`, `Testes unitários`, `Cobertura 90%`, `Integração`, `Construção`, `Auditoria`, `Comportamento`, `Portão`, `PR para develop`
- [x] T079 [P] Criar `.github/workflows/promover-develop.yml` — jobs `Modo`, `Merge develop`, `Versão`, `Branch release`, `PR para release`, `Resumo`
- [x] T080 [P] Criar `.github/workflows/promover-release.yml` — jobs `Modo`, `Merge release`, `PR para master`, `Resumo`
- [x] T081 [P] Criar `.github/workflows/publicar-master.yml` — jobs `Construção`, `Auditoria`, `Publicação`, `Merge master`, `Tag e release`, `Resumo`
- [x] T082 [P] Criar `.github/workflows/publicar-catalogo.yml` — jobs `Catálogo`, `Construção`, `Auditoria`, `Publicação`, `Registro`, preservando o agendamento e o registro de desfecho de hoje
- [x] T083 [P] Remover `.github/workflows/publish.yml`, substituído por T082
- [x] T084 [P] Criar `.github/CODEOWNERS` declarando os proprietários da organização

## Fase 9 — Cenários sobre a decisão da esteira

T085 é pré-requisito de todos os demais desta fase.

- [x] T085 Criar `app/tests/bdd/steps/pipeline/decision_steps.ts` — passos que exercitam os casos de uso da esteira, sem rede e sem navegador
- [x] T086 Cenário *RF-03 — cobertura abaixo do mínimo reprova e diz quanto mediu* em `app/tests/bdd/features/validacao_da_feature.feature`
- [x] T087 Cenário *RF-16 — formatação pendente reprova e nomeia os arquivos* em `app/tests/bdd/features/validacao_da_feature.feature`
- [x] T088 Cenário *RF-05 e RF-13 — uma reprovação interrompe a cadeia inteira* em `app/tests/bdd/features/validacao_da_feature.feature`
- [x] T089 [P] Cenário *RF-10 — funcionalidade nova eleva a minor* em `app/tests/bdd/features/promocao_entre_branches.feature`
- [x] T090 Cenário *RF-10 — mudança incompatível eleva a major* em `app/tests/bdd/features/promocao_entre_branches.feature`
- [x] T091 Cenário *RF-10 — sem funcionalidade nem incompatibilidade, eleva a patch* em `app/tests/bdd/features/promocao_entre_branches.feature`
- [x] T092 Cenário *RF-15 e RF-20 — credencial ausente se declara como tal* em `app/tests/bdd/features/promocao_entre_branches.feature`
- [x] T093 Cenário *RF-17 — conflito de integração volta para a autora* em `app/tests/bdd/features/promocao_entre_branches.feature`
- [x] T102 Cenário *RF-10 — sem versão anterior, a esteira publica a primeira* em `app/tests/bdd/features/promocao_entre_branches.feature`
- [x] T094 [P] Cenário *RF-09 — no modo automático só a primeira PR espera por gente* em `app/tests/bdd/features/modos_de_aprovacao.feature`
- [x] T095 Cenário *RF-09 — a marcação na PR de feature força o modo manual* em `app/tests/bdd/features/modos_de_aprovacao.feature`
- [x] T096 Cenário *RF-09 — sem configuração nem marcação vale o modo automático* em `app/tests/bdd/features/modos_de_aprovacao.feature`
- [x] T097 [P] Cenário *RF-11 e RF-12 — o resumo responde sem abrir log* em `app/tests/bdd/features/legibilidade_da_esteira.feature`

## Fase 10 — Integração e fechamento

- [x] T098 [P] `app/tests/it/adapters/repositories/git_history_repository_test_integration.ts` — contra repositório git real, criado e descartado pelo teste
- [x] T099 [P] `app/tests/it/adapters/repositories/run_summary_repository_test_integration.ts` — escrita e acréscimo em diretório temporário
- [x] T100 [P] `app/tests/it/infra/cli/pipeline_cli_entry_test_integration.ts` — os quatro subcomandos ponta a ponta, com fiação real
- [x] T101 `make validate` verde

## Rastreabilidade

| Requisito | Tarefas |
|---|---|
| RF-01 | T016, T017, T018, T078 |
| RF-02 | T019, T077, T078 |
| RF-03 | T052, T053, T056, T057, T086 |
| RF-04 | T021, T022, T078 |
| RF-05 | T052, T053, T066, T067, T088 |
| RF-06 | T023, T048, T049, T079 |
| RF-07 | T024, T080 |
| RF-08 | T025, T081 |
| RF-09 | T050, T051, T064, T065, T094, T095, T096, T079, T080, T081 |
| RF-10 | T032–T035, T046–T049, T058, T059, T062, T063, T089, T090, T091, T102 |
| RF-11 | T028, T029, T097 |
| RF-12 | T056, T057, T060, T061, T068, T069, T097 |
| RF-13 | T052, T053, T088, T078 |
| RF-14 | T026, T078, T081 |
| RF-15 | T042–T045, T054, T055, T092 |
| RF-16 | T068, T069, T078, T087 |
| RF-17 | T054, T055, T093 |
| RF-18 | T031, T082, T083 |
| RF-19 | T027, T084 |
| RF-20 | T054, T055, T072, T073, T092 |
| RNF-01 | T028, T078–T082 |
| RNF-02 | T029, T078–T082 |
| RNF-03 | T101 |
| RNF-04 | T077, T101 |
| RNF-05 | T020, T077, T078 |
| RNF-06 | T081, T082 |
| RNF-07 | T030, T078–T082 |
| RNF-08 | T056, T057, T097 |

## Convergence

> Seção **append-only**, escrita por `/bu:converge`. Cada rodada acrescenta um bloco;
> nada é reescrito.

### Rodada 1 — 2026-09-01

**`make validate` — saída real:** `rc=0`. `Test Files 58 passed (58)` nos unitários ·
cobertura `All files | 100 stmts | 99.42 branch | 100 funcs | 100 lines`, acima do limiar de
90% por arquivo · `Test Files 8 passed (8)` na integração · `73 scenarios (73 passed)` e
`444 steps (444 passed)` no comportamento.

| Requisito | Estado | Evidência |
|---|---|---|
| RF-01 | realizado | `.github/workflows/validar.yml`: `on.push.branches: ['feature/**']` e `run-name: ${{ github.event.head_commit.message }}`. Cenário *RF-01* passa |
| RF-02 | realizado | `validar.yml`: jobs `Formatação`, `Análise estática`, `Testes unitários`, `Cobertura 90%`, `Integração`, `Auditoria`, `Comportamento`, cada um rodando exatamente um alvo. O cenário *RF-02* confere job a job, e o seguinte confere que nenhum alvo roda em dois jobs |
| RF-03 | realizado | `evaluate_quality_gate_use_case.ts` reprova; `render_run_summary_use_case.ts` leva a medida ao resumo; job `Cobertura 90%` captura a linha `All files` para `ESTEIRA_DETALHE`. Cenário *RF-03* passa |
| RF-04 | realizado | `validar.yml`, job `PR para develop`: `gh pr list` antes de decidir, `gh pr edit` quando existe, `gh pr create` quando não. Dois cenários de RF-04 passam |
| RF-05 | realizado | `evaluate_gate_command.ts` devolve código não-zero; job `Portão` propaga; `PR para develop` declara `needs: gate`. Cenário *RF-05 e RF-13* passa |
| RF-06 | realizado | `.github/workflows/promover-develop.yml`: jobs `Modo`, `Merge develop`, `Versão`, `Branch release`, `PR para release`. Cenário *RF-06* passa |
| RF-07 | realizado | `.github/workflows/promover-release.yml`: `Modo`, `Merge release`, `PR para master`. Cenário *RF-07* passa |
| RF-08 | realizado | `.github/workflows/publicar-master.yml`: `Construção`, `Auditoria`, `Publicação`, `Merge master`, `Tag e release`, com `Merge master` declarando `needs: [build, deploy]`. Cenário *RF-08* passa |
| RF-09 | realizado | `resolve_pipeline_mode_use_case.ts` (marcação vence configuração, padrão `automatico`); passo `Aprovar sozinha no modo automático` nos dois fluxos de promoção; `validar.yml` **não** contém `gh pr review`. Três cenários de RF-09 passam |
| RF-10 | realizado | `classify_version_bump_use_case.ts` + `resolve_next_version_use_case.ts` + `semantic_version_model.ts`; sem marca anterior devolve `v1.0.0` sem incremento. Quatro cenários de RF-10 passam, e a integração `pipeline_cli_entry_test_integration.ts` prova contra repositório git real |
| RF-11 | realizado | 28 jobs distribuídos em cinco fluxos; nenhuma etapa escondida como passo. Cenários *RNF-01*, *RNF-02* e *RF-11/RF-12* passam |
| RF-12 | realizado | `render_run_summary_use_case.ts` + `run_summary_repository.ts` + `write_summary_command.ts`; todo job termina com passo `Resumo` e `if: always()` |
| RF-13 | realizado | Cadeia por `needs` em `validar.yml`; portão devolve não-zero. Cenário *RF-05 e RF-13* passa |
| RF-14 | **realizado no código, pendente de configuração** | `publicar-master.yml`: job `Publicação` baixa o artefato de `Construção` e **não** roda `make build`. Cenário *RF-14* passa. **Mas** o GitHub Pages do repositório ainda está em `build_type: legacy`, servindo a branch `master`; sem a troca para publicação por ação, `actions/deploy-pages` falha em execução. É ato de configuração, apontado na entrega |
| RF-15 | realizado | `classify_pipeline_failure_use_case.ts` nomeia `permissao`, `credencial`, `conflito` ou `desconhecida`; `pipeline_failure_error.ts` a carrega. Cenário *RF-15 e RF-20* passa |
| RF-16 | realizado | `validar.yml`, job `Formatação`: roda `make fmt` e reprova se a árvore ficar suja, levando os arquivos para `ESTEIRA_DETALHE`; nenhum `git push` no fluxo. Cenário *RF-16* passa |
| RF-17 | realizado | Passos de merge capturam a saída em `DETALHE` e falham; a classificação nomeia `conflito`. Cenário *RF-17* passa |
| RF-18 | realizado | `.github/workflows/publicar-catalogo.yml` substitui `publish.yml`, preserva o agendamento diário e o registro de desfecho, e distribui em cinco jobs. Cenário *RF-18* passa |
| RF-19 | realizado | `.github/CODEOWNERS` declara `* @lsilvpin`. Cenário *RF-19* passa. Ligar `require_code_owner_reviews` segue sendo ato de configuração, declarado em *Fora de escopo* |
| RF-20 | **realizado no código, pendente de configuração** | Os fluxos de promoção usam `secrets.ESTEIRA_TOKEN` e falham nomeando a causa quando ele falta. **Mas** o segredo ainda não existe no repositório; sem ele a cadeia não encadeia. Ato do proprietário, declarado em *Fora de escopo* e apontado na entrega |
| RNF-01 | realizado | Medido nos 28 jobs: o maior nome tem 16 caracteres (`Análise estática`, `Testes unitários`). Cenário *RNF-01* passa |
| RNF-02 | realizado | Medido nos 28 jobs: o maior tem 6 passos. Cenário *RNF-02* passa |
| RNF-03 | realizado | `make cover`: `All files 100 stmts / 99.42 branch / 100 funcs / 100 lines`, com limiar de 90% por arquivo satisfeito (`rc=0`) |
| RNF-04 | realizado | `make audit-only` sobre o `dist/browser` construído: `rc=0`, limiares de `lighthouserc.json` mantidos |
| RNF-05 | realizado | `validar.yml`: `Formatação`, `Análise estática`, `Testes unitários`, `Cobertura 90%` e `Integração` sem `needs`; `Auditoria` com `needs: build`; `Comportamento` com `needs: audit`; `make build` roda em um job só. Cenário *RNF-05* passa |
| RNF-06 | realizado, **sem cenário próprio** | Verificado por inspeção: `grep -rilE 'esteira_token\|ghp_\|github_token\|secrets\.' dist/browser` não retorna arquivo algum. A especificação não previu cenário para este requisito — lacuna registrada, sem correção nesta rodada por não haver requisito pedindo-a |
| RNF-07 | realizado | Os 28 jobs declaram `timeout-minutes`, nenhum acima de 30. Cenário *RNF-07* passa |
| RNF-08 | realizado | `render_run_summary_use_case.ts` corta o detalhe em 3 linhas e acrescenta `… (detalhe truncado)`. Cenário *RF-11 e RF-12* mede o corpo do bloco |

**Cenários de aceite:** os 27 cenários da especificação viraram 27 cenários em
`app/tests/bdd/features/`, todos com a etiqueta `@esteira`, e todos passam dentro dos 73 da
suíte completa.

**Excesso de escopo — o que foi entregue além do plano, e por quê**

| Item | Justificativa |
|---|---|
| `runnerStatusToJobStatus` em `pipeline_job_result_dto.ts` | RF-05 e RF-12 exigem ler a situação que o executor produz (`success`, `cancelled`, `skipped`), e traduzi-la em dois comandos separados duplicaria a regra |
| `app/tests/bdd/support/pipeline_driver.ts` | Suporte de teste. O plano previa só o motor de definição; os cenários de decisão precisavam de um motor próprio, registrado no plano nesta rodada |
| Quatro acessos a mais em `config_tool` | Todo dado da esteira viaja por ambiente porque `make` quebra argumento em espaços. Registrado no plano |
| `.prettierignore` passa a ignorar `.github/` | Consequência direta da montagem somente leitura: o formatador tentaria escrever onde não pode. Configuração de repositório não é código de aplicação |
| `main_pipeline.ts` no `include` do `tsconfig.json` | Sem isso o `eslint` reprova o arquivo por estar fora do serviço de projeto |

**Nada do que a seção *Fora de escopo* proíbe foi feito.** Os alvos `audit` e `bdd` foram
reescritos para delegar a `audit-only` e `bdd-only`, mas o comportamento externo é idêntico —
provado por `make validate`, que os executa na cadeia e passa.

**Veredito: convergido.**

Tarefas acrescentadas: nenhuma.

**Duas condições de operação, fora do que esta feature produz, sem as quais a esteira não roda:**
criar o segredo `ESTEIRA_TOKEN` no repositório (RF-20) e trocar o GitHub Pages para publicação
por ação (RF-14). Ambas são atos do proprietário, e são apontadas na entrega.
