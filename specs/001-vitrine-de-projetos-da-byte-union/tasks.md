# Tarefas — Vitrine de projetos da Byte Union

> Ordem de dependência, de dentro para fora. `[P]` marca tarefa paralelizável — não toca
> arquivo de nenhuma outra `[P]` da mesma fase. Toda implementação vem depois do teste que a
> prova. Interfaces vêm antes de tudo que as injeta, para que os mocks compilem.

## Fase 0 — Fundação e contrato de operação

- [x] T001 [P] Criar `app/package.json` com as versões exatas do plano (Angular 22.1.4, TypeScript 6.0.3, Vitest 4.1.11), sem intervalo `^`
- [x] T002 [P] Criar `app/tsconfig.json` em modo estrito, sem `any`, com os caminhos das camadas de `app/`
- [x] T003 [P] Criar `app/angular.json`: `sourceRoot` na própria `app/`, `prerender` com `routesFile` apontando `app/data/prerender-routes.txt`, `ssr: false`, `server` em `app/infra/init/web_server.ts`, **sem** `outputMode` — que descartaria o `routesFile` —, `baseHref` na raiz, `budgets` e builder `unit-test` com `runner: vitest`
- [x] T004 [P] Criar `app/Dockerfile` com Node 24 e Chromium do Playwright, imagem única para executar e desenvolver
- [x] T005 [P] Criar `app/docker-compose.yml` com os serviços `dev` (ocioso, código por volume) e `wiremock` em `wiremock/wiremock:3.13.2`, consumido por `make it` e por `make bdd`
- [x] T006 [P] Criar `app/Makefile` com os 14 alvos do contrato mais `catalog`, `audit` e `report`; `validate` encadeando `fmt → lint → test → cover → it → bdd → audit`; e `bdd` exigindo o `dist/` construído e o serviço `wiremock` de pé
- [x] T007 [P] Criar `app/vitest.config.ts` com limiar de cobertura de 90% por arquivo e a exclusão dos sete arquivos de fiação isentos pela emenda 1.0.2: `app/main.ts`, `app/main_catalog.ts`, `app/main_report.ts`, `app/infra/init/ioc_init.ts`, `app/infra/init/cli_ioc_init.ts`, `app/infra/init/web_init.ts` e `app/infra/init/web_server.ts`
- [x] T008 [P] Criar os dotfiles `app/eslint.config.js`, `app/.prettierrc` e `app/.editorconfig`
- [x] T009 [P] Criar `app/lighthouserc.json` com asserções de 90 nas quatro categorias, LCP ≤ 2,5 s, CLS ≤ 0,1 e `total-byte-weight` ≤ 300 KB, em perfil móvel
- [x] T010 [P] Criar `app/index.html` com `lang="pt-BR"` e os metadados base
- [x] T011 [P] Criar `app/styles.css` com os tokens de contraste 4,5:1 e 3:1 e a malha fluida de 320 px a 1920 px
- [x] T012 [P] Criar `app/scripts/serve_dist.sh`, servidor de arquivos estático sobre `app/dist/browser` — o diretório publicável — para BDD e auditoria
- [x] T013 [P] Criar `app/scripts/check_links.sh`, que falha em ligação interna absoluta no `app/dist/browser` e em rota pública a mais de 2 cliques da página inicial
- [x] T014 [P] Atualizar `.gitignore` para `app/node_modules/`, `app/dist/`, `app/coverage/`, `app/data/catalog.generated.json` e `app/data/prerender-routes.txt`
- [x] T015 [P] Criar `CLAUDE.md` na raiz a partir do template do fluxo

## Fase 1 — Domínio

- [x] T016 [P] Teste unitário de `app/core/domain/entities/code_repository.ts` em `app/tests/unit/core/domain/entities/code_repository.test.ts`
- [x] T017 [P] Implementar `app/core/domain/entities/code_repository.ts` — depende do teste anterior
- [x] T018 [P] Teste unitário de `app/core/domain/entities/project.ts` em `app/tests/unit/core/domain/entities/project.test.ts`
- [x] T019 [P] Implementar `app/core/domain/entities/project.ts` — depende do teste anterior
- [x] T020 [P] Teste unitário de `app/core/domain/dtos/github_repository_dto.ts` em `app/tests/unit/core/domain/dtos/github_repository_dto.test.ts`
- [x] T021 [P] Implementar `app/core/domain/dtos/github_repository_dto.ts` — depende do teste anterior
- [x] T022 [P] Teste unitário de `app/core/domain/dtos/curation_dto.ts` em `app/tests/unit/core/domain/dtos/curation_dto.test.ts`
- [x] T023 [P] Implementar `app/core/domain/dtos/curation_dto.ts` — depende do teste anterior
- [x] T024 [P] Teste unitário de `app/core/domain/dtos/catalog_dto.ts` em `app/tests/unit/core/domain/dtos/catalog_dto.test.ts`
- [x] T025 [P] Implementar `app/core/domain/dtos/catalog_dto.ts` — depende do teste anterior
- [x] T026 [P] Teste unitário de `app/core/domain/errors/curation_validation_error.ts` em `app/tests/unit/core/domain/errors/curation_validation_error.test.ts`
- [x] T027 [P] Implementar `app/core/domain/errors/curation_validation_error.ts` — depende do teste anterior
- [x] T028 [P] Teste unitário de `app/core/domain/errors/catalog_source_error.ts` em `app/tests/unit/core/domain/errors/catalog_source_error.test.ts`
- [x] T029 [P] Implementar `app/core/domain/errors/catalog_source_error.ts` — depende do teste anterior
- [x] T030 [P] Teste unitário de `app/core/domain/constants/site_routes_constants.ts` em `app/tests/unit/core/domain/constants/site_routes_constants.test.ts`
- [x] T031 [P] Implementar `app/core/domain/constants/site_routes_constants.ts` — depende do teste anterior
- [x] T032 [P] Teste unitário de `app/core/domain/constants/organization_constants.ts` em `app/tests/unit/core/domain/constants/organization_constants.test.ts`
- [x] T033 [P] Implementar `app/core/domain/constants/organization_constants.ts` — depende do teste anterior

## Fase 2 — Contratos

- [x] T034 [P] Declarar a abstração `app/interfaces/adapters/clients/i_github_organization_client.ts`
- [x] T035 [P] Declarar a abstração `app/interfaces/adapters/clients/i_github_issue_client.ts`
- [x] T036 [P] Declarar a abstração `app/interfaces/adapters/repositories/i_curation_repository.ts`
- [x] T037 [P] Declarar a abstração `app/interfaces/adapters/repositories/i_catalog_file_repository.ts`
- [x] T038 [P] Declarar a abstração `app/interfaces/adapters/repositories/i_static_catalog_repository.ts`
- [x] T039 [P] Declarar a abstração `app/interfaces/adapters/commands/i_generate_catalog_command.ts`
- [x] T040 [P] Declarar a abstração `app/interfaces/adapters/commands/i_report_publication_command.ts`
- [x] T041 [P] Declarar a abstração `app/interfaces/core/application/catalog/i_validate_curation_use_case.ts`
- [x] T042 [P] Declarar a abstração `app/interfaces/core/application/catalog/i_assemble_catalog_use_case.ts`
- [x] T043 [P] Declarar a abstração `app/interfaces/core/application/catalog/i_generate_catalog_use_case.ts`
- [x] T044 [P] Declarar a abstração `app/interfaces/core/application/catalog/i_report_publication_status_use_case.ts`
- [x] T045 [P] Declarar a abstração `app/interfaces/core/application/showcase/i_list_projects_use_case.ts`
- [x] T046 [P] Declarar a abstração `app/interfaces/core/application/showcase/i_filter_projects_by_technology_use_case.ts`
- [x] T047 [P] Declarar a abstração `app/interfaces/core/application/showcase/i_list_technologies_use_case.ts`
- [x] T048 [P] Declarar a abstração `app/interfaces/core/application/showcase/i_find_project_by_slug_use_case.ts`
- [x] T049 [P] Declarar a abstração `app/interfaces/infra/tools/i_logger_tool.ts`
- [x] T050 [P] Declarar a abstração `app/interfaces/infra/tools/i_config_tool.ts`
- [x] T051 [P] Declarar a abstração `app/interfaces/infra/tools/i_seo_tool.ts`
- [x] T052 [P] Declarar a abstração `app/interfaces/infra/cli/i_cli_entry.ts`

## Fase 3 — Aplicação

- [ ] T053 [P] Teste unitário de `app/core/application/catalog/validate_curation_use_case.ts` em `app/tests/unit/core/application/catalog/validate_curation_use_case.test.ts`
- [ ] T054 [P] Implementar `app/core/application/catalog/validate_curation_use_case.ts` — depende do teste anterior
- [ ] T055 [P] Teste unitário de `app/core/application/catalog/assemble_catalog_use_case.ts` em `app/tests/unit/core/application/catalog/assemble_catalog_use_case.test.ts`
- [ ] T056 [P] Implementar `app/core/application/catalog/assemble_catalog_use_case.ts` — depende do teste anterior
- [ ] T057 [P] Teste unitário de `app/core/application/catalog/generate_catalog_use_case.ts` em `app/tests/unit/core/application/catalog/generate_catalog_use_case.test.ts`
- [ ] T058 [P] Implementar `app/core/application/catalog/generate_catalog_use_case.ts` — depende do teste anterior
- [ ] T059 [P] Teste unitário de `app/core/application/catalog/report_publication_status_use_case.ts` em `app/tests/unit/core/application/catalog/report_publication_status_use_case.test.ts`
- [ ] T060 [P] Implementar `app/core/application/catalog/report_publication_status_use_case.ts` — depende do teste anterior
- [ ] T061 [P] Teste unitário de `app/core/application/showcase/list_projects_use_case.ts` em `app/tests/unit/core/application/showcase/list_projects_use_case.test.ts`
- [ ] T062 [P] Implementar `app/core/application/showcase/list_projects_use_case.ts` — depende do teste anterior
- [ ] T063 [P] Teste unitário de `app/core/application/showcase/filter_projects_by_technology_use_case.ts` em `app/tests/unit/core/application/showcase/filter_projects_by_technology_use_case.test.ts`
- [ ] T064 [P] Implementar `app/core/application/showcase/filter_projects_by_technology_use_case.ts` — depende do teste anterior
- [ ] T065 [P] Teste unitário de `app/core/application/showcase/list_technologies_use_case.ts` em `app/tests/unit/core/application/showcase/list_technologies_use_case.test.ts`
- [ ] T066 [P] Implementar `app/core/application/showcase/list_technologies_use_case.ts` — depende do teste anterior
- [ ] T067 [P] Teste unitário de `app/core/application/showcase/find_project_by_slug_use_case.ts` em `app/tests/unit/core/application/showcase/find_project_by_slug_use_case.test.ts`
- [ ] T068 [P] Implementar `app/core/application/showcase/find_project_by_slug_use_case.ts` — depende do teste anterior

## Fase 4 — Adapters de dado e gerador de catálogo

- [ ] T069 [P] Teste unitário de `app/infra/tools/logger_tool.ts` em `app/tests/unit/infra/tools/logger_tool.test.ts`
- [ ] T070 [P] Implementar `app/infra/tools/logger_tool.ts` — depende do teste anterior
- [ ] T071 [P] Teste unitário de `app/infra/tools/config_tool.ts` em `app/tests/unit/infra/tools/config_tool.test.ts`
- [ ] T072 [P] Implementar `app/infra/tools/config_tool.ts` — depende do teste anterior
- [ ] T073 [P] Teste unitário de `app/adapters/clients/github_organization_client.ts` em `app/tests/unit/adapters/clients/github_organization_client.test.ts`
- [ ] T074 [P] Implementar `app/adapters/clients/github_organization_client.ts` — depende do teste anterior
- [ ] T075 [P] Teste unitário de `app/adapters/clients/github_issue_client.ts` em `app/tests/unit/adapters/clients/github_issue_client.test.ts`
- [ ] T076 [P] Implementar `app/adapters/clients/github_issue_client.ts` — depende do teste anterior
- [ ] T077 [P] Teste unitário de `app/adapters/repositories/curation_repository.ts` em `app/tests/unit/adapters/repositories/curation_repository.test.ts`
- [ ] T078 [P] Implementar `app/adapters/repositories/curation_repository.ts` — depende do teste anterior
- [ ] T079 [P] Teste unitário de `app/adapters/repositories/catalog_file_repository.ts` em `app/tests/unit/adapters/repositories/catalog_file_repository.test.ts`
- [ ] T080 [P] Implementar `app/adapters/repositories/catalog_file_repository.ts` — depende do teste anterior
- [ ] T081 [P] Teste unitário de `app/adapters/commands/generate_catalog_command.ts` em `app/tests/unit/adapters/commands/generate_catalog_command.test.ts`
- [ ] T082 [P] Implementar `app/adapters/commands/generate_catalog_command.ts` — depende do teste anterior
- [ ] T083 [P] Teste unitário de `app/adapters/commands/report_publication_command.ts` em `app/tests/unit/adapters/commands/report_publication_command.test.ts`
- [ ] T084 [P] Implementar `app/adapters/commands/report_publication_command.ts` — depende do teste anterior
- [ ] T085 [P] Teste unitário de `app/infra/cli/cli_entry.ts` em `app/tests/unit/infra/cli/cli_entry.test.ts`
- [ ] T086 [P] Implementar `app/infra/cli/cli_entry.ts` — depende do teste anterior
- [ ] T087 [P] Criar `app/infra/init/cli_ioc_init.ts` ligando interfaces a implementações do gerador e do reporte — isento de cobertura, sem condição a decidir
- [ ] T088 [P] Criar `app/main_catalog.ts`: instancia o contêiner, pede o inicializador, executa — sem regra de negócio
- [ ] T089 [P] Criar `app/main_report.ts`: sobe o reporte de estado da publicação com o desfecho recebido por argumento — sem regra de negócio

## Fase 5 — Apresentação

- [ ] T090 [P] Teste unitário de `app/infra/tools/seo_tool.ts` em `app/tests/unit/infra/tools/seo_tool.test.ts`
- [ ] T091 [P] Implementar `app/infra/tools/seo_tool.ts` — depende do teste anterior
- [ ] T092 [P] Teste unitário de `app/adapters/repositories/static_catalog_repository.ts` em `app/tests/unit/adapters/repositories/static_catalog_repository.test.ts`
- [ ] T093 [P] Implementar `app/adapters/repositories/static_catalog_repository.ts` — depende do teste anterior
- [ ] T094 [P] Teste unitário de `app/infra/init/web_routes.ts` em `app/tests/unit/infra/init/web_routes.test.ts`
- [ ] T095 [P] Implementar `app/infra/init/web_routes.ts` — depende do teste anterior
- [ ] T096 [P] Teste unitário de `app/adapters/presenters/layout/site-header.component.ts` em `app/tests/unit/adapters/presenters/layout/site-header.component.test.ts`
- [ ] T097 [P] Implementar `app/adapters/presenters/layout/site-header.component.ts` — depende do teste anterior
- [ ] T098 [P] Teste unitário de `app/adapters/presenters/layout/site-footer.component.ts` em `app/tests/unit/adapters/presenters/layout/site-footer.component.test.ts`
- [ ] T099 [P] Implementar `app/adapters/presenters/layout/site-footer.component.ts` — depende do teste anterior
- [ ] T100 [P] Teste unitário de `app/adapters/presenters/layout/site-shell.component.ts` em `app/tests/unit/adapters/presenters/layout/site-shell.component.test.ts`
- [ ] T101 [P] Implementar `app/adapters/presenters/layout/site-shell.component.ts` — depende do teste anterior
- [ ] T102 [P] Teste unitário de `app/adapters/presenters/home/home-page.component.ts` em `app/tests/unit/adapters/presenters/home/home-page.component.test.ts`
- [ ] T103 [P] Implementar `app/adapters/presenters/home/home-page.component.ts` — depende do teste anterior
- [ ] T104 [P] Teste unitário de `app/adapters/presenters/catalog/project-card.component.ts` em `app/tests/unit/adapters/presenters/catalog/project-card.component.test.ts`
- [ ] T105 [P] Implementar `app/adapters/presenters/catalog/project-card.component.ts` — depende do teste anterior
- [ ] T106 [P] Teste unitário de `app/adapters/presenters/catalog/technology-filter.component.ts` em `app/tests/unit/adapters/presenters/catalog/technology-filter.component.test.ts`
- [ ] T107 [P] Implementar `app/adapters/presenters/catalog/technology-filter.component.ts` — depende do teste anterior
- [ ] T108 [P] Teste unitário de `app/adapters/presenters/catalog/catalog-page.component.ts` em `app/tests/unit/adapters/presenters/catalog/catalog-page.component.test.ts`
- [ ] T109 [P] Implementar `app/adapters/presenters/catalog/catalog-page.component.ts` — depende do teste anterior
- [ ] T110 [P] Teste unitário de `app/adapters/presenters/project/project-page.component.ts` em `app/tests/unit/adapters/presenters/project/project-page.component.test.ts`
- [ ] T111 [P] Implementar `app/adapters/presenters/project/project-page.component.ts` — depende do teste anterior
- [ ] T112 [P] Teste unitário de `app/adapters/presenters/error/not-found-page.component.ts` em `app/tests/unit/adapters/presenters/error/not-found-page.component.test.ts`
- [ ] T113 [P] Implementar `app/adapters/presenters/error/not-found-page.component.ts` — depende do teste anterior
- [ ] T114 [P] Criar `app/infra/init/ioc_init.ts` com os provedores Angular ligando cada interface à implementação — isento de cobertura, sem condição a decidir
- [ ] T115 [P] Criar `app/infra/init/web_init.ts`, que compõe a configuração e entrega ao framework o roteamento já declarado em `app/infra/init/web_routes.ts` — isento de cobertura, sem regra própria
- [ ] T116 [P] Criar `app/infra/init/web_server.ts`, entrypoint que o builder usa para renderizar em build — não responde requisição e não vai ao artefato publicado; isento de cobertura
- [ ] T117 [P] Criar `app/main.ts`: sobe o Angular pelo inicializador montando `app/adapters/presenters/layout/site-shell.component.ts`, sem regra de negócio

## Fase 6 — Curadoria e publicação

- [ ] T118 [P] Escrever `app/data/curation.json` com as entradas curadas, cada uma com resumo obrigatório, sem `shared-claude-plugin` e com os cinco `shortsmaker-*` num único projeto
- [ ] T119 [P] Criar `.github/workflows/publish.yml` com publicação agendada diária, `make catalog` antes do build, aborto preservando a versão anterior, e `make report` acionado ao fim em qualquer desfecho

## Fase 7 — Integração

- [ ] T120 [P] Criar os stubs do WireMock em `app/tests/it/stubs/` para a listagem da organização, o 409 de repositório vazio e a API de questões
- [ ] T121 [P] Teste de integração de `app/adapters/clients/github_organization_client.ts` em `app/tests/it/adapters/clients/github_organization_client_test_integration.ts`
- [ ] T122 [P] Teste de integração de `app/adapters/clients/github_issue_client.ts` em `app/tests/it/adapters/clients/github_issue_client_test_integration.ts`
- [ ] T123 [P] Teste de integração de `app/adapters/repositories/curation_repository.ts` em `app/tests/it/adapters/repositories/curation_repository_test_integration.ts`
- [ ] T124 [P] Teste de integração de `app/adapters/repositories/catalog_file_repository.ts` em `app/tests/it/adapters/repositories/catalog_file_repository_test_integration.ts`
- [ ] T125 [P] Teste de integração de `app/adapters/repositories/static_catalog_repository.ts` em `app/tests/it/adapters/repositories/static_catalog_repository_test_integration.ts`

## Fase 8 — BDD

- [ ] T126 [P] Criar `app/tests/bdd/support/browser_driver.ts`: Playwright sobre o `dist/` servido estaticamente
- [ ] T127 [P] Criar `app/tests/bdd/support/process_driver.ts`: executa os alvos de publicação em diretório de trabalho isolado, contra WireMock, expondo código de saída, arquivos gerados e chamadas capturadas
- [ ] T128 [P] Criar `app/tests/bdd/support/world.ts`: escolhe o motor pela etiqueta do cenário e o inicializa preguiçosamente, sem subir navegador para cenário de processo
- [ ] T129 [P] Criar a fixture `app/tests/bdd/fixtures/curation/valida.json` — curadoria íntegra, com resumo em toda entrada
- [ ] T130 [P] Criar a fixture `app/tests/bdd/fixtures/curation/sem_resumo.json` — entrada sem resumo escrito
- [ ] T131 [P] Criar a fixture `app/tests/bdd/fixtures/curation/referencia_inexistente.json` — entrada apontando repositório que não existe na organização
- [ ] T132 [P] Criar a fixture `app/tests/bdd/fixtures/curation/repositorio_repetido.json` — mesmo repositório declarado em dois projetos
- [ ] T133 [P] Criar a fixture `app/tests/bdd/fixtures/curation/declara_inelegiveis.json` — curadoria que declara repositório privado e repositório sem commit
- [ ] T134 [P] Criar a fixture `app/tests/bdd/fixtures/stubs/organizacao_completa.json` — listagem da organização por inteiro, com privado e vazio incluídos
- [ ] T135 [P] Criar a fixture `app/tests/bdd/fixtures/stubs/organizacao_indisponivel.json` — listagem que falha no meio da obtenção
- [ ] T136 [P] Criar a fixture `app/tests/bdd/fixtures/stubs/questoes_sem_aberta.json` — API de questões sem nenhuma aberta
- [ ] T137 [P] Criar a fixture `app/tests/bdd/fixtures/stubs/questoes_com_aberta.json` — API de questões com uma já aberta
- [ ] T138 [P] Cenário *RF-01 — proposta visível na chegada* em `app/tests/bdd/features/apresentacao_da_oficina.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T139 [P] Cenário *RF-02 — catálogo tem origem no GitHub da organização* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T140 Cenário *RF-03 — ficha mínima de cada projeto* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T141 Cenário *RF-04 — repositório não declarado na curadoria não aparece* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T142 Cenário *RF-06 — repositório privado não é exposto ainda que declarado* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@processo` (`# language: pt`)
- [ ] T143 Cenário *RF-06 — repositório sem commit não é exposto ainda que declarado* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@processo` (`# language: pt`)
- [ ] T144 Cenário *RF-07 — sistema de vários repositórios é um projeto só* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T145 Cenário *RF-11 — restrição por tecnologia alcança projeto multi-tecnologia* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T146 Cenário *RF-13 — restrição sem resultado se explica* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T147 Cenário *RF-13 — a mudança de resultado é anunciada a quem usa leitor de tela* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T148 [P] Cenário *RF-04 — ordem e destaque vêm da curadoria* em `app/tests/bdd/features/curadoria_do_catalogo.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T149 Cenário *RF-04 — resumo editorial supre a descrição ausente* em `app/tests/bdd/features/curadoria_do_catalogo.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T150 Cenário *RF-05 — entrada sem resumo impede a publicação* em `app/tests/bdd/features/curadoria_do_catalogo.feature`, etiquetado `@processo` (`# language: pt`)
- [ ] T151 Cenário *RF-05 — referência a repositório inexistente impede a publicação* em `app/tests/bdd/features/curadoria_do_catalogo.feature`, etiquetado `@processo` (`# language: pt`)
- [ ] T152 Cenário *RF-05 — repositório declarado em dois projetos impede a publicação* em `app/tests/bdd/features/curadoria_do_catalogo.feature`, etiquetado `@processo` (`# language: pt`)
- [ ] T153 [P] Cenário *RF-08 — página própria por projeto* em `app/tests/bdd/features/aprofundamento_em_um_projeto.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T154 Cenário *RF-09 — endereço publicado é distinto do repositório* em `app/tests/bdd/features/aprofundamento_em_um_projeto.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T155 Cenário *RF-15 — endereço direto funciona sem navegação prévia* em `app/tests/bdd/features/aprofundamento_em_um_projeto.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T156 [P] Cenário *RF-10 — autoria como organização e dois canais acionáveis* em `app/tests/bdd/features/contato_com_a_organizacao.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T157 [P] Cenário *RF-14 — falha na obtenção não publica catálogo incompleto* em `app/tests/bdd/features/frescura_e_integridade_do_catalogo.feature`, etiquetado `@processo` (`# language: pt`)
- [ ] T158 Cenário *RF-16 — publicação abortada abre questão no repositório* em `app/tests/bdd/features/frescura_e_integridade_do_catalogo.feature`, etiquetado `@processo` (`# language: pt`)
- [ ] T159 Cenário *RF-16 — publicação bem-sucedida encerra a questão aberta* em `app/tests/bdd/features/frescura_e_integridade_do_catalogo.feature`, etiquetado `@processo` (`# language: pt`)
- [ ] T160 Cenário *RNF-08 — o visitante não espera pela rede* em `app/tests/bdd/features/frescura_e_integridade_do_catalogo.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T161 [P] Cenário *RF-12 — endereço inexistente tem página própria* em `app/tests/bdd/features/resiliencia_e_bordas.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T162 [P] Cenário *RNF-01 e RNF-03 — limiares de qualidade em perfil móvel* em `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature`, etiquetado `@processo` (`# language: pt`)
- [ ] T163 Cenário *RNF-02 — operação apenas por teclado* em `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T164 Cenário *RNF-05 — alcance de dispositivos* em `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T165 Cenário *RNF-07 — idioma único* em `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T166 [P] Implementar os passos de navegador em `app/tests/bdd/steps/browser/catalog_steps.ts` — catálogo, curadoria vista pelo visitante e aprofundamento
- [ ] T167 [P] Implementar os passos de navegador em `app/tests/bdd/steps/browser/site_steps.ts` — apresentação, contato e endereço inexistente
- [ ] T168 [P] Implementar os passos de navegador em `app/tests/bdd/steps/browser/quality_steps.ts` — teclado, viewport, idioma, ausência de requisição à API e a varredura `axe` que reprova violação crítica ou séria
- [ ] T169 [P] Implementar os passos de processo em `app/tests/bdd/steps/process/publication_steps.ts` — curadoria inválida, inelegibilidade, aborto e questão
- [ ] T170 [P] Implementar os passos de processo em `app/tests/bdd/steps/process/audit_steps.ts` — execução do Lighthouse e leitura dos limiares

## Fase 9 — Auditoria e fechamento

- [ ] T171 [P] Ligar o alvo `audit` de `app/Makefile` ao Lighthouse de `app/lighthouserc.json`, à varredura `axe` de `app/tests/bdd/steps/browser/quality_steps.ts` e ao `app/scripts/check_links.sh`, todos headless sobre o `dist/` servido por `app/scripts/serve_dist.sh`
- [ ] T172 `make validate` verde de ponta a ponta pelo alvo `validate` de `app/Makefile`: `fmt → lint → test → cover → it → bdd → audit`, com cobertura ≥ 90% por arquivo

## Rastreabilidade

| Requisito | Tarefas |
|---|---|
| RF-01 | T096, T097, T100, T101, T102, T103, T138, T167 |
| RF-02 | T020, T021, T024, T025, T034, T038, T045, T050, T055, T056, T061, T062, T071, T072, T073, T074, T092, T093, T108, T109, T120, T121, T125, T139, T166 |
| RF-03 | T016, T017, T018, T019, T104, T105, T140, T166 |
| RF-04 | T022, T023, T036, T042, T055, T056, T061, T062, T077, T078, T104, T105, T118, T123, T141, T148, T149, T166 |
| RF-05 | T022, T023, T026, T027, T041, T053, T054, T081, T082, T118, T123, T130, T131, T132, T134, T150, T151, T152, T169 |
| RF-06 | T016, T017, T034, T055, T056, T073, T074, T120, T121, T133, T134, T142, T143, T169 |
| RF-07 | T018, T019, T042, T055, T056, T110, T111, T118, T144, T166 |
| RF-08 | T003, T030, T031, T037, T048, T067, T068, T079, T080, T094, T095, T110, T111, T116, T124, T153, T166 |
| RF-09 | T018, T019, T110, T111, T154, T166 |
| RF-10 | T032, T033, T098, T099, T100, T101, T156, T167 |
| RF-11 | T046, T047, T063, T064, T065, T066, T106, T107, T108, T109, T145, T166 |
| RF-12 | T030, T031, T067, T068, T079, T080, T094, T095, T112, T113, T161, T167 |
| RF-13 | T063, T064, T106, T107, T108, T109, T146, T147, T166 |
| RF-14 | T028, T029, T039, T043, T049, T052, T057, T058, T069, T070, T081, T082, T085, T086, T088, T119, T127, T129, T135, T157, T169 |
| RF-15 | T003, T030, T031, T037, T079, T080, T094, T095, T116, T124, T155, T166 |
| RF-16 | T006, T035, T040, T044, T059, T060, T075, T076, T083, T084, T089, T119, T120, T122, T127, T129, T134, T136, T137, T158, T159, T169 |
| RNF-01 | T009, T162, T170, T171 |
| RNF-02 | T163, T168, T171 |
| RNF-03 | T009, T162, T170, T171 |
| RNF-04 | T003, T009, T170, T171 |
| RNF-05 | T011, T164, T168 |
| RNF-06 | T013, T051, T090, T091, T096, T097, T171 |
| RNF-07 | T010, T165, T168 |
| RNF-08 | T012, T038, T092, T093, T119, T125, T126, T160, T168 |
| RNF-09 | T011, T168, T171 |
| RNF-10 | T003, T013, T030, T031, T171 |

## Convergence

> Seção **append-only**, escrita por `/bu:converge`. Cada rodada acrescenta um bloco;
> nada é reescrito.
