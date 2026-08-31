# Tarefas — Vitrine de projetos da Byte Union

> Ordem de dependência, de dentro para fora. `[P]` marca tarefa paralelizável — não toca
> arquivo de nenhuma outra `[P]` da mesma fase. Toda implementação vem depois do teste que a
> prova. Interfaces vêm antes de tudo que as injeta, para que os mocks compilem.

## Fase 0 — Fundação e contrato de operação

- [ ] T001 [P] Criar `app/package.json` com as versões exatas do plano (Angular 22.1.4, TypeScript 6.0.3, Vitest 4.1.11), sem intervalo `^`
- [ ] T002 [P] Criar `app/tsconfig.json` em modo estrito, sem `any`, com os caminhos das camadas de `app/`
- [ ] T003 [P] Criar `app/angular.json`: `sourceRoot` na própria `app/`, `outputMode: static`, `prerender.routesFile`, `budgets` de 300 KB e builder `unit-test` com `runner: vitest`
- [ ] T004 [P] Criar `app/Dockerfile` com Node 24 e Chromium do Playwright, imagem única para executar e desenvolver
- [ ] T005 [P] Criar `app/docker-compose.yml` com os serviços `dev` (ocioso, código por volume) e `wiremock` em `wiremock/wiremock:3.13.2`
- [ ] T006 [P] Criar `app/Makefile` com os 14 alvos do contrato mais `catalog` e `audit`, e `validate` encadeando `fmt → lint → test → cover → it → bdd → audit`
- [ ] T007 [P] Criar `app/vitest.config.ts` com limiar de cobertura de 90% por arquivo e exclusão de `main.ts`, `main_catalog.ts`, `ioc_init.ts`, `cli_ioc_init.ts` e `web_init.ts`
- [ ] T008 [P] Criar os dotfiles `app/eslint.config.js`, `app/.prettierrc` e `app/.editorconfig`
- [ ] T009 [P] Criar `app/lighthouserc.json` com asserções de 90 nas quatro categorias e LCP ≤ 2,5 s e CLS ≤ 0,1 em perfil móvel
- [ ] T010 [P] Criar `app/index.html` com `lang="pt-BR"` e os metadados base
- [ ] T011 [P] Criar `app/styles.css` com os tokens de contraste 4,5:1 e 3:1 e a malha fluida de 320 px a 1920 px
- [ ] T012 [P] Criar `app/scripts/serve_dist.sh`, servidor de arquivos estático sobre `dist/` para BDD e auditoria
- [ ] T013 [P] Atualizar `.gitignore` para `app/node_modules/`, `app/dist/`, `app/data/catalog.generated.json` e `app/data/prerender-routes.txt`
- [ ] T014 [P] Criar `CLAUDE.md` na raiz a partir do template do fluxo

## Fase 1 — Domínio

- [ ] T015 [P] Teste unitário de `app/core/domain/entities/code_repository.ts` em `app/tests/unit/core/domain/entities/code_repository.test.ts`
- [ ] T016 [P] Implementar `app/core/domain/entities/code_repository.ts` — depende do teste anterior
- [ ] T017 [P] Teste unitário de `app/core/domain/entities/project.ts` em `app/tests/unit/core/domain/entities/project.test.ts`
- [ ] T018 [P] Implementar `app/core/domain/entities/project.ts` — depende do teste anterior
- [ ] T019 [P] Teste unitário de `app/core/domain/dtos/github_repository_dto.ts` em `app/tests/unit/core/domain/dtos/github_repository_dto.test.ts`
- [ ] T020 [P] Implementar `app/core/domain/dtos/github_repository_dto.ts` — depende do teste anterior
- [ ] T021 [P] Teste unitário de `app/core/domain/dtos/curation_dto.ts` em `app/tests/unit/core/domain/dtos/curation_dto.test.ts`
- [ ] T022 [P] Implementar `app/core/domain/dtos/curation_dto.ts` — depende do teste anterior
- [ ] T023 [P] Teste unitário de `app/core/domain/dtos/catalog_dto.ts` em `app/tests/unit/core/domain/dtos/catalog_dto.test.ts`
- [ ] T024 [P] Implementar `app/core/domain/dtos/catalog_dto.ts` — depende do teste anterior
- [ ] T025 [P] Teste unitário de `app/core/domain/errors/curation_validation_error.ts` em `app/tests/unit/core/domain/errors/curation_validation_error.test.ts`
- [ ] T026 [P] Implementar `app/core/domain/errors/curation_validation_error.ts` — depende do teste anterior
- [ ] T027 [P] Teste unitário de `app/core/domain/errors/catalog_source_error.ts` em `app/tests/unit/core/domain/errors/catalog_source_error.test.ts`
- [ ] T028 [P] Implementar `app/core/domain/errors/catalog_source_error.ts` — depende do teste anterior
- [ ] T029 [P] Teste unitário de `app/core/domain/constants/site_routes_constants.ts` em `app/tests/unit/core/domain/constants/site_routes_constants.test.ts`
- [ ] T030 [P] Implementar `app/core/domain/constants/site_routes_constants.ts` — depende do teste anterior
- [ ] T031 [P] Teste unitário de `app/core/domain/constants/organization_constants.ts` em `app/tests/unit/core/domain/constants/organization_constants.test.ts`
- [ ] T032 [P] Implementar `app/core/domain/constants/organization_constants.ts` — depende do teste anterior

## Fase 2 — Contratos

- [ ] T033 [P] Declarar a abstração `app/interfaces/adapters/clients/i_github_organization_client.ts`
- [ ] T034 [P] Declarar a abstração `app/interfaces/adapters/clients/i_github_issue_client.ts`
- [ ] T035 [P] Declarar a abstração `app/interfaces/adapters/repositories/i_curation_repository.ts`
- [ ] T036 [P] Declarar a abstração `app/interfaces/adapters/repositories/i_catalog_file_repository.ts`
- [ ] T037 [P] Declarar a abstração `app/interfaces/adapters/repositories/i_static_catalog_repository.ts`
- [ ] T038 [P] Declarar a abstração `app/interfaces/adapters/commands/i_generate_catalog_command.ts`
- [ ] T039 [P] Declarar a abstração `app/interfaces/core/application/catalog/i_validate_curation_use_case.ts`
- [ ] T040 [P] Declarar a abstração `app/interfaces/core/application/catalog/i_assemble_catalog_use_case.ts`
- [ ] T041 [P] Declarar a abstração `app/interfaces/core/application/catalog/i_generate_catalog_use_case.ts`
- [ ] T042 [P] Declarar a abstração `app/interfaces/core/application/catalog/i_report_publication_status_use_case.ts`
- [ ] T043 [P] Declarar a abstração `app/interfaces/core/application/showcase/i_list_projects_use_case.ts`
- [ ] T044 [P] Declarar a abstração `app/interfaces/core/application/showcase/i_filter_projects_by_technology_use_case.ts`
- [ ] T045 [P] Declarar a abstração `app/interfaces/core/application/showcase/i_list_technologies_use_case.ts`
- [ ] T046 [P] Declarar a abstração `app/interfaces/core/application/showcase/i_find_project_by_slug_use_case.ts`
- [ ] T047 [P] Declarar a abstração `app/interfaces/infra/tools/i_logger_tool.ts`
- [ ] T048 [P] Declarar a abstração `app/interfaces/infra/tools/i_config_tool.ts`
- [ ] T049 [P] Declarar a abstração `app/interfaces/infra/tools/i_seo_tool.ts`
- [ ] T050 [P] Declarar a abstração `app/interfaces/infra/cli/i_cli_entry.ts`

## Fase 3 — Aplicação

- [ ] T051 [P] Teste unitário de `app/core/application/catalog/validate_curation_use_case.ts` em `app/tests/unit/core/application/catalog/validate_curation_use_case.test.ts`
- [ ] T052 [P] Implementar `app/core/application/catalog/validate_curation_use_case.ts` — depende do teste anterior
- [ ] T053 [P] Teste unitário de `app/core/application/catalog/assemble_catalog_use_case.ts` em `app/tests/unit/core/application/catalog/assemble_catalog_use_case.test.ts`
- [ ] T054 [P] Implementar `app/core/application/catalog/assemble_catalog_use_case.ts` — depende do teste anterior
- [ ] T055 [P] Teste unitário de `app/core/application/catalog/generate_catalog_use_case.ts` em `app/tests/unit/core/application/catalog/generate_catalog_use_case.test.ts`
- [ ] T056 [P] Implementar `app/core/application/catalog/generate_catalog_use_case.ts` — depende do teste anterior
- [ ] T057 [P] Teste unitário de `app/core/application/catalog/report_publication_status_use_case.ts` em `app/tests/unit/core/application/catalog/report_publication_status_use_case.test.ts`
- [ ] T058 [P] Implementar `app/core/application/catalog/report_publication_status_use_case.ts` — depende do teste anterior
- [ ] T059 [P] Teste unitário de `app/core/application/showcase/list_projects_use_case.ts` em `app/tests/unit/core/application/showcase/list_projects_use_case.test.ts`
- [ ] T060 [P] Implementar `app/core/application/showcase/list_projects_use_case.ts` — depende do teste anterior
- [ ] T061 [P] Teste unitário de `app/core/application/showcase/filter_projects_by_technology_use_case.ts` em `app/tests/unit/core/application/showcase/filter_projects_by_technology_use_case.test.ts`
- [ ] T062 [P] Implementar `app/core/application/showcase/filter_projects_by_technology_use_case.ts` — depende do teste anterior
- [ ] T063 [P] Teste unitário de `app/core/application/showcase/list_technologies_use_case.ts` em `app/tests/unit/core/application/showcase/list_technologies_use_case.test.ts`
- [ ] T064 [P] Implementar `app/core/application/showcase/list_technologies_use_case.ts` — depende do teste anterior
- [ ] T065 [P] Teste unitário de `app/core/application/showcase/find_project_by_slug_use_case.ts` em `app/tests/unit/core/application/showcase/find_project_by_slug_use_case.test.ts`
- [ ] T066 [P] Implementar `app/core/application/showcase/find_project_by_slug_use_case.ts` — depende do teste anterior

## Fase 4 — Adapters de dado e gerador de catálogo

- [ ] T067 [P] Teste unitário de `app/infra/tools/logger_tool.ts` em `app/tests/unit/infra/tools/logger_tool.test.ts`
- [ ] T068 [P] Implementar `app/infra/tools/logger_tool.ts` — depende do teste anterior
- [ ] T069 [P] Teste unitário de `app/infra/tools/config_tool.ts` em `app/tests/unit/infra/tools/config_tool.test.ts`
- [ ] T070 [P] Implementar `app/infra/tools/config_tool.ts` — depende do teste anterior
- [ ] T071 [P] Teste unitário de `app/adapters/clients/github_organization_client.ts` em `app/tests/unit/adapters/clients/github_organization_client.test.ts`
- [ ] T072 [P] Implementar `app/adapters/clients/github_organization_client.ts` — depende do teste anterior
- [ ] T073 [P] Teste unitário de `app/adapters/clients/github_issue_client.ts` em `app/tests/unit/adapters/clients/github_issue_client.test.ts`
- [ ] T074 [P] Implementar `app/adapters/clients/github_issue_client.ts` — depende do teste anterior
- [ ] T075 [P] Teste unitário de `app/adapters/repositories/curation_repository.ts` em `app/tests/unit/adapters/repositories/curation_repository.test.ts`
- [ ] T076 [P] Implementar `app/adapters/repositories/curation_repository.ts` — depende do teste anterior
- [ ] T077 [P] Teste unitário de `app/adapters/repositories/catalog_file_repository.ts` em `app/tests/unit/adapters/repositories/catalog_file_repository.test.ts`
- [ ] T078 [P] Implementar `app/adapters/repositories/catalog_file_repository.ts` — depende do teste anterior
- [ ] T079 [P] Teste unitário de `app/adapters/commands/generate_catalog_command.ts` em `app/tests/unit/adapters/commands/generate_catalog_command.test.ts`
- [ ] T080 [P] Implementar `app/adapters/commands/generate_catalog_command.ts` — depende do teste anterior
- [ ] T081 [P] Teste unitário de `app/infra/cli/cli_entry.ts` em `app/tests/unit/infra/cli/cli_entry.test.ts`
- [ ] T082 [P] Implementar `app/infra/cli/cli_entry.ts` — depende do teste anterior
- [ ] T083 [P] Criar `app/infra/init/cli_ioc_init.ts` ligando interfaces a implementações do gerador — fora da conta de cobertura
- [ ] T084 [P] Criar `app/main_catalog.ts`: instancia o contêiner, pede o inicializador, executa — sem regra de negócio

## Fase 5 — Apresentação

- [ ] T085 [P] Teste unitário de `app/infra/tools/seo_tool.ts` em `app/tests/unit/infra/tools/seo_tool.test.ts`
- [ ] T086 [P] Implementar `app/infra/tools/seo_tool.ts` — depende do teste anterior
- [ ] T087 [P] Teste unitário de `app/adapters/repositories/static_catalog_repository.ts` em `app/tests/unit/adapters/repositories/static_catalog_repository.test.ts`
- [ ] T088 [P] Implementar `app/adapters/repositories/static_catalog_repository.ts` — depende do teste anterior
- [ ] T089 [P] Teste unitário de `app/infra/init/web_routes.ts` em `app/tests/unit/infra/init/web_routes.test.ts`
- [ ] T090 [P] Implementar `app/infra/init/web_routes.ts` — depende do teste anterior
- [ ] T091 [P] Teste unitário de `app/adapters/presenters/layout/site-header.component.ts` em `app/tests/unit/adapters/presenters/layout/site-header.component.test.ts`
- [ ] T092 [P] Implementar `app/adapters/presenters/layout/site-header.component.ts` — depende do teste anterior
- [ ] T093 [P] Teste unitário de `app/adapters/presenters/layout/site-footer.component.ts` em `app/tests/unit/adapters/presenters/layout/site-footer.component.test.ts`
- [ ] T094 [P] Implementar `app/adapters/presenters/layout/site-footer.component.ts` — depende do teste anterior
- [ ] T095 [P] Teste unitário de `app/adapters/presenters/home/home-page.component.ts` em `app/tests/unit/adapters/presenters/home/home-page.component.test.ts`
- [ ] T096 [P] Implementar `app/adapters/presenters/home/home-page.component.ts` — depende do teste anterior
- [ ] T097 [P] Teste unitário de `app/adapters/presenters/catalog/project-card.component.ts` em `app/tests/unit/adapters/presenters/catalog/project-card.component.test.ts`
- [ ] T098 [P] Implementar `app/adapters/presenters/catalog/project-card.component.ts` — depende do teste anterior
- [ ] T099 [P] Teste unitário de `app/adapters/presenters/catalog/technology-filter.component.ts` em `app/tests/unit/adapters/presenters/catalog/technology-filter.component.test.ts`
- [ ] T100 [P] Implementar `app/adapters/presenters/catalog/technology-filter.component.ts` — depende do teste anterior
- [ ] T101 [P] Teste unitário de `app/adapters/presenters/catalog/catalog-page.component.ts` em `app/tests/unit/adapters/presenters/catalog/catalog-page.component.test.ts`
- [ ] T102 [P] Implementar `app/adapters/presenters/catalog/catalog-page.component.ts` — depende do teste anterior
- [ ] T103 [P] Teste unitário de `app/adapters/presenters/project/project-page.component.ts` em `app/tests/unit/adapters/presenters/project/project-page.component.test.ts`
- [ ] T104 [P] Implementar `app/adapters/presenters/project/project-page.component.ts` — depende do teste anterior
- [ ] T105 [P] Teste unitário de `app/adapters/presenters/error/not-found-page.component.ts` em `app/tests/unit/adapters/presenters/error/not-found-page.component.test.ts`
- [ ] T106 [P] Implementar `app/adapters/presenters/error/not-found-page.component.ts` — depende do teste anterior
- [ ] T107 [P] Criar `app/infra/init/ioc_init.ts` com os provedores Angular ligando cada interface à implementação — fora da conta de cobertura
- [ ] T108 [P] Criar `app/infra/init/web_init.ts` com a configuração da aplicação e o registro das rotas — fora da conta de cobertura
- [ ] T109 [P] Criar `app/main.ts`: sobe o Angular pelo inicializador, sem regra de negócio

## Fase 6 — Curadoria e publicação

- [ ] T110 [P] Escrever `app/data/curation.json` com as entradas curadas, cada uma com resumo obrigatório, sem `shared-claude-plugin` e com os cinco `shortsmaker-*` num único projeto
- [ ] T111 [P] Criar `.github/workflows/publish.yml` com publicação agendada diária, `make catalog` antes do build e aborto preservando a versão anterior

## Fase 7 — Integração

- [ ] T112 [P] Criar os stubs do WireMock em `app/tests/it/stubs/` para a listagem da organização, o 409 de repositório vazio e a API de questões
- [ ] T113 [P] Teste de integração de `app/adapters/clients/github_organization_client.ts` em `app/tests/it/adapters/clients/github_organization_client_test_integration.ts`
- [ ] T114 [P] Teste de integração de `app/adapters/clients/github_issue_client.ts` em `app/tests/it/adapters/clients/github_issue_client_test_integration.ts`
- [ ] T115 [P] Teste de integração de `app/adapters/repositories/curation_repository.ts` em `app/tests/it/adapters/repositories/curation_repository_test_integration.ts`

## Fase 8 — BDD

- [ ] T116 [P] Criar `app/tests/bdd/support/world.ts` e a configuração do Cucumber com Playwright sobre o `dist/` servido estaticamente
- [ ] T117 [P] Cenário *RF-01 — proposta visível na chegada* em `app/tests/bdd/features/apresentacao_da_oficina.feature` (`# language: pt`)
- [ ] T118 [P] Cenário *RF-02 — catálogo tem origem no GitHub da organização* em `app/tests/bdd/features/catalogo_de_projetos.feature` (`# language: pt`)
- [ ] T119 Cenário *RF-03 — ficha mínima de cada projeto* em `app/tests/bdd/features/catalogo_de_projetos.feature` (`# language: pt`)
- [ ] T120 Cenário *RF-04 — repositório não declarado na curadoria não aparece* em `app/tests/bdd/features/catalogo_de_projetos.feature` (`# language: pt`)
- [ ] T121 Cenário *RF-06 — repositório privado não é exposto ainda que declarado* em `app/tests/bdd/features/catalogo_de_projetos.feature` (`# language: pt`)
- [ ] T122 Cenário *RF-06 — repositório sem commit não é exposto ainda que declarado* em `app/tests/bdd/features/catalogo_de_projetos.feature` (`# language: pt`)
- [ ] T123 Cenário *RF-07 — sistema de vários repositórios é um projeto só* em `app/tests/bdd/features/catalogo_de_projetos.feature` (`# language: pt`)
- [ ] T124 Cenário *RF-11 — restrição por tecnologia alcança projeto multi-tecnologia* em `app/tests/bdd/features/catalogo_de_projetos.feature` (`# language: pt`)
- [ ] T125 Cenário *RF-13 — restrição sem resultado se explica* em `app/tests/bdd/features/catalogo_de_projetos.feature` (`# language: pt`)
- [ ] T126 Cenário *RF-13 — a mudança de resultado é anunciada a quem usa leitor de tela* em `app/tests/bdd/features/catalogo_de_projetos.feature` (`# language: pt`)
- [ ] T127 [P] Cenário *RF-04 — ordem e destaque vêm da curadoria* em `app/tests/bdd/features/curadoria_do_catalogo.feature` (`# language: pt`)
- [ ] T128 Cenário *RF-04 — resumo editorial supre a descrição ausente* em `app/tests/bdd/features/curadoria_do_catalogo.feature` (`# language: pt`)
- [ ] T129 Cenário *RF-05 — entrada sem resumo impede a publicação* em `app/tests/bdd/features/curadoria_do_catalogo.feature` (`# language: pt`)
- [ ] T130 Cenário *RF-05 — referência a repositório inexistente impede a publicação* em `app/tests/bdd/features/curadoria_do_catalogo.feature` (`# language: pt`)
- [ ] T131 Cenário *RF-05 — repositório declarado em dois projetos impede a publicação* em `app/tests/bdd/features/curadoria_do_catalogo.feature` (`# language: pt`)
- [ ] T132 [P] Cenário *RF-08 — página própria por projeto* em `app/tests/bdd/features/aprofundamento_em_um_projeto.feature` (`# language: pt`)
- [ ] T133 Cenário *RF-09 — endereço publicado é distinto do repositório* em `app/tests/bdd/features/aprofundamento_em_um_projeto.feature` (`# language: pt`)
- [ ] T134 Cenário *RF-15 — endereço direto funciona sem navegação prévia* em `app/tests/bdd/features/aprofundamento_em_um_projeto.feature` (`# language: pt`)
- [ ] T135 [P] Cenário *RF-10 — autoria como organização e dois canais acionáveis* em `app/tests/bdd/features/contato_com_a_organizacao.feature` (`# language: pt`)
- [ ] T136 [P] Cenário *RF-14 — falha na obtenção não publica catálogo incompleto* em `app/tests/bdd/features/frescura_e_integridade_do_catalogo.feature` (`# language: pt`)
- [ ] T137 Cenário *RF-16 — publicação abortada abre questão no repositório* em `app/tests/bdd/features/frescura_e_integridade_do_catalogo.feature` (`# language: pt`)
- [ ] T138 Cenário *RF-16 — publicação bem-sucedida encerra a questão aberta* em `app/tests/bdd/features/frescura_e_integridade_do_catalogo.feature` (`# language: pt`)
- [ ] T139 Cenário *RNF-08 — o visitante não espera pela rede* em `app/tests/bdd/features/frescura_e_integridade_do_catalogo.feature` (`# language: pt`)
- [ ] T140 [P] Cenário *RF-12 — endereço inexistente tem página própria* em `app/tests/bdd/features/resiliencia_e_bordas.feature` (`# language: pt`)
- [ ] T141 [P] Cenário *RNF-01 e RNF-03 — limiares de qualidade em perfil móvel* em `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature` (`# language: pt`)
- [ ] T142 Cenário *RNF-02 — operação apenas por teclado* em `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature` (`# language: pt`)
- [ ] T143 Cenário *RNF-05 — alcance de dispositivos* em `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature` (`# language: pt`)
- [ ] T144 Cenário *RNF-07 — idioma único* em `app/tests/bdd/features/qualidade_medida_das_paginas_publicas.feature` (`# language: pt`)
- [ ] T145 [P] Implementar as definições de passo em `app/tests/bdd/steps/catalog_steps.ts`
- [ ] T146 [P] Implementar as definições de passo em `app/tests/bdd/steps/publication_steps.ts`
- [ ] T147 [P] Implementar as definições de passo em `app/tests/bdd/steps/accessibility_steps.ts`

## Fase 9 — Auditoria e fechamento

- [ ] T148 [P] Criar `app/tests/audit/axe_audit.ts` varrendo cada rota pública e falhando em violação crítica ou séria
- [ ] T149 [P] Ligar o alvo `audit` em `app/Makefile` ao Lighthouse CI de `app/lighthouserc.json` e ao `app/tests/audit/axe_audit.ts`, ambos headless sobre o `dist/` servido por `app/scripts/serve_dist.sh`
- [ ] T150 `make validate` verde de ponta a ponta pelo alvo `validate` de `app/Makefile`: `fmt → lint → test → cover → it → bdd → audit`, com cobertura ≥ 90% por arquivo

## Rastreabilidade

| Requisito | Tarefas |
|---|---|
| RF-01 | T091, T092, T095, T096, T117 |
| RF-02 | T019, T020, T023, T024, T033, T037, T043, T048, T053, T054, T059, T060, T069, T070, T071, T072, T087, T088, T101, T102, T112, T113, T118 |
| RF-03 | T015, T016, T017, T018, T097, T098, T119 |
| RF-04 | T021, T022, T035, T040, T053, T054, T059, T060, T075, T076, T097, T098, T110, T115, T120, T127, T128 |
| RF-05 | T021, T022, T025, T026, T039, T051, T052, T079, T080, T110, T115, T129, T130, T131 |
| RF-06 | T015, T016, T033, T053, T054, T071, T072, T112, T113, T121, T122 |
| RF-07 | T017, T018, T040, T053, T054, T103, T104, T110, T123 |
| RF-08 | T029, T030, T036, T046, T065, T066, T077, T078, T089, T090, T103, T104, T132 |
| RF-09 | T017, T018, T103, T104, T133 |
| RF-10 | T031, T032, T093, T094, T135 |
| RF-11 | T044, T045, T061, T062, T063, T064, T099, T100, T101, T102, T124 |
| RF-12 | T029, T030, T065, T066, T077, T078, T089, T090, T105, T106, T140 |
| RF-13 | T061, T062, T099, T100, T101, T102, T125, T126 |
| RF-14 | T027, T028, T038, T041, T047, T050, T055, T056, T067, T068, T079, T080, T081, T082, T084, T111, T136 |
| RF-15 | T003, T029, T030, T036, T077, T078, T089, T090, T108, T134 |
| RF-16 | T034, T042, T057, T058, T073, T074, T079, T080, T111, T112, T114, T137, T138 |
| RNF-01 | T009, T141, T149 |
| RNF-02 | T142, T148, T149 |
| RNF-03 | T009, T141, T149 |
| RNF-04 | T003 |
| RNF-05 | T011, T143 |
| RNF-06 | T049, T085, T086, T091, T092 |
| RNF-07 | T010, T144 |
| RNF-08 | T012, T037, T087, T088, T111, T116, T139 |
| RNF-09 | T011, T148, T149 |
| RNF-10 | T031, T032 |

## Convergence

> Seção **append-only**, escrita por `/bu:converge`. Cada rodada acrescenta um bloco;
> nada é reescrito.
