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

- [x] T053 [P] Teste unitário de `app/core/application/catalog/validate_curation_use_case.ts` em `app/tests/unit/core/application/catalog/validate_curation_use_case.test.ts`
- [x] T054 [P] Implementar `app/core/application/catalog/validate_curation_use_case.ts` — depende do teste anterior
- [x] T055 [P] Teste unitário de `app/core/application/catalog/assemble_catalog_use_case.ts` em `app/tests/unit/core/application/catalog/assemble_catalog_use_case.test.ts`
- [x] T056 [P] Implementar `app/core/application/catalog/assemble_catalog_use_case.ts` — depende do teste anterior
- [x] T057 [P] Teste unitário de `app/core/application/catalog/generate_catalog_use_case.ts` em `app/tests/unit/core/application/catalog/generate_catalog_use_case.test.ts`
- [x] T058 [P] Implementar `app/core/application/catalog/generate_catalog_use_case.ts` — depende do teste anterior
- [x] T059 [P] Teste unitário de `app/core/application/catalog/report_publication_status_use_case.ts` em `app/tests/unit/core/application/catalog/report_publication_status_use_case.test.ts`
- [x] T060 [P] Implementar `app/core/application/catalog/report_publication_status_use_case.ts` — depende do teste anterior
- [x] T061 [P] Teste unitário de `app/core/application/showcase/list_projects_use_case.ts` em `app/tests/unit/core/application/showcase/list_projects_use_case.test.ts`
- [x] T062 [P] Implementar `app/core/application/showcase/list_projects_use_case.ts` — depende do teste anterior
- [x] T063 [P] Teste unitário de `app/core/application/showcase/filter_projects_by_technology_use_case.ts` em `app/tests/unit/core/application/showcase/filter_projects_by_technology_use_case.test.ts`
- [x] T064 [P] Implementar `app/core/application/showcase/filter_projects_by_technology_use_case.ts` — depende do teste anterior
- [x] T065 [P] Teste unitário de `app/core/application/showcase/list_technologies_use_case.ts` em `app/tests/unit/core/application/showcase/list_technologies_use_case.test.ts`
- [x] T066 [P] Implementar `app/core/application/showcase/list_technologies_use_case.ts` — depende do teste anterior
- [x] T067 [P] Teste unitário de `app/core/application/showcase/find_project_by_slug_use_case.ts` em `app/tests/unit/core/application/showcase/find_project_by_slug_use_case.test.ts`
- [x] T068 [P] Implementar `app/core/application/showcase/find_project_by_slug_use_case.ts` — depende do teste anterior

## Fase 4 — Adapters de dado e gerador de catálogo

- [x] T069 [P] Teste unitário de `app/infra/tools/logger_tool.ts` em `app/tests/unit/infra/tools/logger_tool.test.ts`
- [x] T070 [P] Implementar `app/infra/tools/logger_tool.ts` — depende do teste anterior
- [x] T071 [P] Teste unitário de `app/infra/tools/config_tool.ts` em `app/tests/unit/infra/tools/config_tool.test.ts`
- [x] T072 [P] Implementar `app/infra/tools/config_tool.ts` — depende do teste anterior
- [x] T073 [P] Teste unitário de `app/adapters/clients/github_organization_client.ts` em `app/tests/unit/adapters/clients/github_organization_client.test.ts`
- [x] T074 [P] Implementar `app/adapters/clients/github_organization_client.ts` — depende do teste anterior
- [x] T075 [P] Teste unitário de `app/adapters/clients/github_issue_client.ts` em `app/tests/unit/adapters/clients/github_issue_client.test.ts`
- [x] T076 [P] Implementar `app/adapters/clients/github_issue_client.ts` — depende do teste anterior
- [x] T077 [P] Teste unitário de `app/adapters/repositories/curation_repository.ts` em `app/tests/unit/adapters/repositories/curation_repository.test.ts`
- [x] T078 [P] Implementar `app/adapters/repositories/curation_repository.ts` — depende do teste anterior
- [x] T079 [P] Teste unitário de `app/adapters/repositories/catalog_file_repository.ts` em `app/tests/unit/adapters/repositories/catalog_file_repository.test.ts`
- [x] T080 [P] Implementar `app/adapters/repositories/catalog_file_repository.ts` — depende do teste anterior
- [x] T081 [P] Teste unitário de `app/adapters/commands/generate_catalog_command.ts` em `app/tests/unit/adapters/commands/generate_catalog_command.test.ts`
- [x] T082 [P] Implementar `app/adapters/commands/generate_catalog_command.ts` — depende do teste anterior
- [x] T083 [P] Teste unitário de `app/adapters/commands/report_publication_command.ts` em `app/tests/unit/adapters/commands/report_publication_command.test.ts`
- [x] T084 [P] Implementar `app/adapters/commands/report_publication_command.ts` — depende do teste anterior
- [x] T085 [P] Teste unitário de `app/infra/cli/cli_entry.ts` em `app/tests/unit/infra/cli/cli_entry.test.ts`
- [x] T086 [P] Implementar `app/infra/cli/cli_entry.ts` — depende do teste anterior
- [x] T087 [P] Criar `app/infra/init/cli_ioc_init.ts` ligando interfaces a implementações do gerador e do reporte — isento de cobertura, sem condição a decidir
- [x] T088 [P] Criar `app/main_catalog.ts`: instancia o contêiner, pede o inicializador, executa — sem regra de negócio
- [x] T089 [P] Criar `app/main_report.ts`: sobe o reporte de estado da publicação com o desfecho recebido por argumento — sem regra de negócio

## Fase 5 — Apresentação

- [x] T090 [P] Teste unitário de `app/infra/tools/seo_tool.ts` em `app/tests/unit/infra/tools/seo_tool.test.ts`
- [x] T091 [P] Implementar `app/infra/tools/seo_tool.ts` — depende do teste anterior
- [x] T092 [P] Teste unitário de `app/adapters/repositories/static_catalog_repository.ts` em `app/tests/unit/adapters/repositories/static_catalog_repository.test.ts`
- [x] T093 [P] Implementar `app/adapters/repositories/static_catalog_repository.ts` — depende do teste anterior
- [x] T094 [P] Teste unitário de `app/infra/init/web_routes.ts` em `app/tests/unit/infra/init/web_routes.test.ts`
- [x] T095 [P] Implementar `app/infra/init/web_routes.ts` — depende do teste anterior
- [x] T096 [P] Teste unitário de `app/adapters/presenters/layout/site-header.component.ts` em `app/tests/unit/adapters/presenters/layout/site-header.component.test.ts`
- [x] T097 [P] Implementar `app/adapters/presenters/layout/site-header.component.ts` — depende do teste anterior
- [x] T098 [P] Teste unitário de `app/adapters/presenters/layout/site-footer.component.ts` em `app/tests/unit/adapters/presenters/layout/site-footer.component.test.ts`
- [x] T099 [P] Implementar `app/adapters/presenters/layout/site-footer.component.ts` — depende do teste anterior
- [x] T100 [P] Teste unitário de `app/adapters/presenters/layout/site-shell.component.ts` em `app/tests/unit/adapters/presenters/layout/site-shell.component.test.ts`
- [x] T101 [P] Implementar `app/adapters/presenters/layout/site-shell.component.ts` — depende do teste anterior
- [x] T102 [P] Teste unitário de `app/adapters/presenters/home/home-page.component.ts` em `app/tests/unit/adapters/presenters/home/home-page.component.test.ts`
- [x] T103 [P] Implementar `app/adapters/presenters/home/home-page.component.ts` — depende do teste anterior
- [x] T104 [P] Teste unitário de `app/adapters/presenters/catalog/project-card.component.ts` em `app/tests/unit/adapters/presenters/catalog/project-card.component.test.ts`
- [x] T105 [P] Implementar `app/adapters/presenters/catalog/project-card.component.ts` — depende do teste anterior
- [x] T106 [P] Teste unitário de `app/adapters/presenters/catalog/technology-filter.component.ts` em `app/tests/unit/adapters/presenters/catalog/technology-filter.component.test.ts`
- [x] T107 [P] Implementar `app/adapters/presenters/catalog/technology-filter.component.ts` — depende do teste anterior
- [x] T108 [P] Teste unitário de `app/adapters/presenters/catalog/catalog-page.component.ts` em `app/tests/unit/adapters/presenters/catalog/catalog-page.component.test.ts`
- [x] T109 [P] Implementar `app/adapters/presenters/catalog/catalog-page.component.ts` — depende do teste anterior
- [x] T110 [P] Teste unitário de `app/adapters/presenters/project/project-page.component.ts` em `app/tests/unit/adapters/presenters/project/project-page.component.test.ts`
- [x] T111 [P] Implementar `app/adapters/presenters/project/project-page.component.ts` — depende do teste anterior
- [x] T112 [P] Teste unitário de `app/adapters/presenters/error/not-found-page.component.ts` em `app/tests/unit/adapters/presenters/error/not-found-page.component.test.ts`
- [x] T113 [P] Implementar `app/adapters/presenters/error/not-found-page.component.ts` — depende do teste anterior
- [x] T114 [P] Criar `app/infra/init/ioc_init.ts` com os provedores Angular ligando cada interface à implementação — isento de cobertura, sem condição a decidir
- [x] T115 [P] Criar `app/infra/init/web_init.ts`, que compõe a configuração e entrega ao framework o roteamento já declarado em `app/infra/init/web_routes.ts` — isento de cobertura, sem regra própria
- [x] T116 [P] Criar `app/infra/init/web_server.ts`, entrypoint que o builder usa para renderizar em build — não responde requisição e não vai ao artefato publicado; isento de cobertura
- [x] T117 [P] Criar `app/main.ts`: sobe o Angular pelo inicializador montando `app/adapters/presenters/layout/site-shell.component.ts`, sem regra de negócio

## Fase 6 — Curadoria e publicação

- [x] T118 [P] Escrever `app/data/curation.json` com as entradas curadas, cada uma com resumo obrigatório, sem `shared-claude-plugin` e com os cinco `shortsmaker-*` num único projeto
- [x] T119 [P] Criar `.github/workflows/publish.yml` com publicação agendada diária, `make catalog` antes do build, aborto preservando a versão anterior, e `make report` acionado ao fim em qualquer desfecho

## Fase 7 — Integração

- [x] T120 [P] Criar os stubs do WireMock em `app/tests/it/stubs/` para a listagem da organização, o 409 de repositório vazio e a API de questões
- [x] T121 [P] Teste de integração de `app/adapters/clients/github_organization_client.ts` em `app/tests/it/adapters/clients/github_organization_client_test_integration.ts`
- [x] T122 [P] Teste de integração de `app/adapters/clients/github_issue_client.ts` em `app/tests/it/adapters/clients/github_issue_client_test_integration.ts`
- [x] T123 [P] Teste de integração de `app/adapters/repositories/curation_repository.ts` em `app/tests/it/adapters/repositories/curation_repository_test_integration.ts`
- [x] T124 [P] Teste de integração de `app/adapters/repositories/catalog_file_repository.ts` em `app/tests/it/adapters/repositories/catalog_file_repository_test_integration.ts`
- [x] T125 [P] Teste de integração de `app/adapters/repositories/static_catalog_repository.ts` em `app/tests/it/adapters/repositories/static_catalog_repository_test_integration.ts`

## Fase 8 — BDD

- [x] T126 [P] Criar `app/tests/bdd/support/browser_driver.ts`: Playwright sobre o `dist/` servido estaticamente
- [x] T127 [P] Criar `app/tests/bdd/support/process_driver.ts`: executa os alvos de publicação em diretório de trabalho isolado, contra WireMock, expondo código de saída, arquivos gerados e chamadas capturadas
- [x] T128 [P] Criar `app/tests/bdd/support/world.ts`: escolhe o motor pela etiqueta do cenário e o inicializa preguiçosamente, sem subir navegador para cenário de processo
- [x] T129 [P] Criar a fixture `app/tests/bdd/fixtures/curation/valida.json` — curadoria íntegra, com resumo em toda entrada
- [x] T130 [P] Criar a fixture `app/tests/bdd/fixtures/curation/sem_resumo.json` — entrada sem resumo escrito
- [x] T131 [P] Criar a fixture `app/tests/bdd/fixtures/curation/referencia_inexistente.json` — entrada apontando repositório que não existe na organização
- [x] T132 [P] Criar a fixture `app/tests/bdd/fixtures/curation/repositorio_repetido.json` — mesmo repositório declarado em dois projetos
- [x] T133 [P] Criar a fixture `app/tests/bdd/fixtures/curation/declara_inelegiveis.json` — curadoria que declara repositório privado e repositório sem commit
- [x] T134 [P] Criar a fixture `app/tests/bdd/fixtures/stubs/organizacao_completa.json` — listagem da organização por inteiro, com privado e vazio incluídos
- [x] T135 [P] Criar a fixture `app/tests/bdd/fixtures/stubs/organizacao_indisponivel.json` — listagem que falha no meio da obtenção
- [x] T136 [P] Criar a fixture `app/tests/bdd/fixtures/stubs/questoes_sem_aberta.json` — API de questões sem nenhuma aberta
- [x] T137 [P] Criar a fixture `app/tests/bdd/fixtures/stubs/questoes_com_aberta.json` — API de questões com uma já aberta
- [x] T138 [P] Cenário *RF-01 — proposta visível na chegada* em `app/tests/bdd/features/apresentacao_da_oficina.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T139 [P] Cenário *RF-02 — catálogo tem origem no GitHub da organização* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T140 Cenário *RF-03 — ficha mínima de cada projeto* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T141 Cenário *RF-04 — repositório não declarado na curadoria não aparece* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T142 Cenário *RF-06 — repositório privado não é exposto ainda que declarado* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@processo` (`# language: pt`)
- [x] T143 Cenário *RF-06 — repositório sem commit não é exposto ainda que declarado* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@processo` (`# language: pt`)
- [x] T144 Cenário *RF-07 — sistema de vários repositórios é um projeto só* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T145 Cenário *RF-11 — restrição por tecnologia alcança projeto multi-tecnologia* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T146 Cenário *RF-13 — restrição sem resultado se explica* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T147 Cenário *RF-13 — a mudança de resultado é anunciada a quem usa leitor de tela* em `app/tests/bdd/features/catalogo_de_projetos.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T148 [P] Cenário *RF-04 — ordem e destaque vêm da curadoria* em `app/tests/bdd/features/curadoria_do_catalogo.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T149 Cenário *RF-04 — resumo editorial supre a descrição ausente* em `app/tests/bdd/features/curadoria_do_catalogo.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T150 Cenário *RF-05 — entrada sem resumo impede a publicação* em `app/tests/bdd/features/curadoria_do_catalogo.feature`, etiquetado `@processo` (`# language: pt`)
- [x] T151 Cenário *RF-05 — referência a repositório inexistente impede a publicação* em `app/tests/bdd/features/curadoria_do_catalogo.feature`, etiquetado `@processo` (`# language: pt`)
- [x] T152 Cenário *RF-05 — repositório declarado em dois projetos impede a publicação* em `app/tests/bdd/features/curadoria_do_catalogo.feature`, etiquetado `@processo` (`# language: pt`)
- [x] T153 [P] Cenário *RF-08 — página própria por projeto* em `app/tests/bdd/features/aprofundamento_em_um_projeto.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T154 Cenário *RF-09 — endereço publicado é distinto do repositório* em `app/tests/bdd/features/aprofundamento_em_um_projeto.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T155 Cenário *RF-15 — endereço direto funciona sem navegação prévia* em `app/tests/bdd/features/aprofundamento_em_um_projeto.feature`, etiquetado `@navegador` (`# language: pt`)
- [ ] T156 [P] Cenário *RF-10 — autoria como organização e dois canais acionáveis* em `app/tests/bdd/features/contato_com_a_organizacao.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T157 [P] Cenário *RF-14 — falha na obtenção não publica catálogo incompleto* em `app/tests/bdd/features/frescura_e_integridade_do_catalogo.feature`, etiquetado `@processo` (`# language: pt`)
- [x] T158 Cenário *RF-16 — publicação abortada abre questão no repositório* em `app/tests/bdd/features/frescura_e_integridade_do_catalogo.feature`, etiquetado `@processo` (`# language: pt`)
- [x] T159 Cenário *RF-16 — publicação bem-sucedida encerra a questão aberta* em `app/tests/bdd/features/frescura_e_integridade_do_catalogo.feature`, etiquetado `@processo` (`# language: pt`)
- [x] T160 Cenário *RNF-08 — o visitante não espera pela rede* em `app/tests/bdd/features/frescura_e_integridade_do_catalogo.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T161 [P] Cenário *RF-12 — endereço inexistente tem página própria* em `app/tests/bdd/features/resiliencia_e_bordas.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T162 [P] Cenário *RNF-01 e RNF-03 — limiares de qualidade em perfil móvel* em `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature`, etiquetado `@processo` (`# language: pt`)
- [x] T163 Cenário *RNF-02 — operação apenas por teclado* em `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T164 Cenário *RNF-05 — alcance de dispositivos* em `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T165 Cenário *RNF-07 — idioma único* em `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature`, etiquetado `@navegador` (`# language: pt`)
- [x] T166 [P] Implementar os passos de navegador em `app/tests/bdd/steps/browser/catalog_steps.ts` — catálogo, curadoria vista pelo visitante e aprofundamento
- [x] T167 [P] Implementar os passos de navegador em `app/tests/bdd/steps/browser/site_steps.ts` — apresentação, contato e endereço inexistente
- [x] T168 [P] Implementar os passos de navegador em `app/tests/bdd/steps/browser/quality_steps.ts` — teclado, viewport, idioma, ausência de requisição à API e a varredura `axe` que reprova violação crítica ou séria
- [x] T169 [P] Implementar os passos de processo em `app/tests/bdd/steps/process/publication_steps.ts` — curadoria inválida, inelegibilidade, aborto e questão
- [x] T170 [P] Implementar os passos de processo em `app/tests/bdd/steps/process/audit_steps.ts` — execução do Lighthouse e leitura dos limiares

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


## Convergência — tarefas acrescentadas na rodada 1

- [ ] T173 Substituir o canal `pending` do Discord por `ready` com convite sem prazo de validade em `app/core/domain/constants/organization_constants.ts` — **depende de o grupo existir** (RF-10)
- [ ] T174 Trocar em `specs/001-vitrine-de-projetos-da-byte-union/spec.md` o exemplo do cenário *RF-04 — resumo editorial supre a descrição ausente*, hoje `templates-library`, por um repositório efetivamente curado, e regerar `app/tests/bdd/features/curadoria_do_catalogo.feature` (RF-04)
- [ ] T175 Resolver a contradição entre `RF-11` e `RF-13` — o filtro só oferece tecnologias existentes no catálogo, então o estado vazio de `app/adapters/presenters/catalog/catalog-page.component.ts` é inalcançável pelo visitante (RF-11, RF-13)
- [ ] T176 Acrescentar à spec um cenário que invoque a varredura automática de acessibilidade, e a `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature`, para o passo já implementado em `app/tests/bdd/steps/browser/quality_steps.ts` deixar de ser código morto (RNF-02, RNF-09)

## Convergence

> Seção **append-only**, escrita por `/bu:converge`. Cada rodada acrescenta um bloco;
> nada é reescrito.

### Rodada 1 — 2026-08-31

| Requisito | Estado | Evidência |
|---|---|---|
| RF-01 | realizado | `app/adapters/presenters/home/home-page.component.ts:17`; cenário passa |
| RF-02 | realizado | `app/adapters/clients/github_organization_client.ts:23`; cenário passa |
| RF-03 | realizado | `app/adapters/presenters/catalog/project-card.component.ts:26`; cenário passa |
| RF-04 | **parcial** | Inclusão explícita em `app/core/application/catalog/assemble_catalog_use_case.ts:26`, com cenário passando. O cenário *resumo editorial* falha: cita `templates-library`, que ficou fora da curadoria |
| RF-05 | realizado | `app/core/application/catalog/validate_curation_use_case.ts:11`; os três cenários passam |
| RF-06 | realizado | `app/core/domain/entities/code_repository.ts:55`; dois cenários passam |
| RF-07 | realizado | `app/core/domain/entities/project.ts:44`; cenário passa com os cinco repositórios reais |
| RF-08 | realizado | `app/infra/init/web_routes.ts:15`; 6 rotas prerenderizadas |
| RF-09 | realizado | `app/adapters/presenters/project/project-page.component.ts:24`; cenário passa |
| RF-10 | **parcial** | Autoria como organização e canal do GitHub em `app/adapters/presenters/layout/site-footer.component.ts:4`. Discord modelado como `pending`; cenário falha por exigir dois canais acionáveis |
| RF-11 | realizado | `app/core/application/showcase/filter_projects_by_technology_use_case.ts:18`; cenário passa |
| RF-12 | realizado | `app/adapters/presenters/error/not-found-page.component.ts:13`; cenário passa; `dist/browser/404/index.html` gerado |
| RF-13 | **parcial** | Anúncio por região viva em `app/adapters/presenters/catalog/catalog-page.component.ts:26`, com cenário passando. O cenário do estado vazio falha: a interface não o alcança |
| RF-14 | realizado | `app/adapters/commands/generate_catalog_command.ts:22`; cenário passa; comprovado em execução real com 403 da API |
| RF-15 | realizado | `app/angular.json:22` com `routesFile`; cenário de acesso direto passa |
| RF-16 | realizado | `app/core/application/catalog/report_publication_status_use_case.ts:23`; dois cenários passam |
| RNF-01 | realizado | `app/lighthouserc.json:25`; `make audit` verde sobre 5 URLs |
| RNF-02 | **parcial** | Metade do teclado provada por cenário. A metade da **verificação automática** não roda: o passo do `axe` existe em `app/tests/bdd/steps/browser/quality_steps.ts:150` mas **nenhum cenário o invoca** |
| RNF-03 | realizado | `app/lighthouserc.json:46`; asserções de LCP e CLS passam |
| RNF-04 | realizado | `app/lighthouserc.json:58`; medido 66,28 kB contra teto de 300 kB |
| RNF-05 | realizado | `app/styles.css:85`; cenário a 320 px passa sem rolagem horizontal |
| RNF-06 | realizado | `app/infra/tools/seo_tool.ts:13` e `app/scripts/check_links.sh`; 2 cliques verificados |
| RNF-07 | realizado | `app/index.html:2`; cenário passa nas rotas fixas |
| RNF-08 | realizado | `app/adapters/repositories/static_catalog_repository.ts:6`; cenário mede **0** requisições à API |
| RNF-09 | **parcial** | Contrastes medidos e documentados em `app/styles.css:6` (17,96:1, 6,64:1, 5,99:1). Nenhuma verificação automática no pipeline — mesma causa de `RNF-02` |
| RNF-10 | realizado | `app/scripts/check_links.sh:3`; `make audit` reporta ok |

**`make validate` — saída real:**

```
fmt    ok
lint   ok
test   38 arquivos, 279 testes, 0 falhas
cover  All files 100 | 99.13 | 100 | 100
it     5 arquivos, 22 testes, 0 falhas
bdd    28 scenarios (25 passed, 3 failed) · 184 steps (175 passed, 6 skipped, 3 failed)
       make[1]: *** [Makefile:62: bdd] Erro 1
audit  nao executado — a cadeia parou no bdd
make: *** [Makefile:88: validate] Erro 2
```

**Excesso de escopo encontrado e corrigido nesta rodada:** `app/.lighthouseci/` (13 arquivos) e
`app/.claude/.bu-state.json` estavam versionados — saída de ferramenta e estado local do agente,
que nenhum requisito pediu. Removidos do índice; o `.gitignore` passou a usar padrão `**/` para
valer em qualquer nível, e não só na raiz.

**Fora de escopo:** nada do que a spec proíbe foi entregue. Sem runtime de servidor, sem
formulário que envie dados, sem perfil pessoal, sem rastreamento do visitante, sem repositório
privado ou arquivado exposto.

**Veredito: não convergido.**

Três desencontros entre spec e realidade, nenhum deles defeito de implementação, e um deles
descoberto só aqui: a varredura automática de acessibilidade está implementada mas nenhum
cenário a invoca, então `RNF-02` e `RNF-09` não são de fato verificados.

Tarefas acrescentadas: T173, T174, T175, T176.
