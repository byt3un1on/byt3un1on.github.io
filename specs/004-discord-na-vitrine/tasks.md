# Tarefas — O Discord na vitrine

> Ordem por camada, de dentro para fora. Para cada arquivo de produção, a tarefa do teste vem
> imediatamente antes. `[P]` só onde a tarefa não toca arquivo de nenhuma outra `[P]` da fase.

## Fase 1 — Domínio: o que é um canal e o que é um convite

- [x] T001 [P] Teste de `app/tests/unit/core/domain/models/community_channel_model.test.ts`: tipo do canal aceita `texto`, `voz` e `forum`; canal declara se aceita escrita; categoria declara se é pública ou fechada
- [x] T002 [P] Implementar `app/core/domain/models/community_channel_model.ts` com `CommunityChannelKind`, `CommunityChannel` e `CommunityCategory`
- [x] T003 [P] Teste de `app/tests/unit/core/domain/errors/community_invite_error.test.ts`: a mensagem carrega o valor recebido e o formato esperado
- [x] T004 [P] Implementar `app/core/domain/errors/community_invite_error.ts`
- [x] T005 Teste de `app/tests/unit/core/domain/constants/community_space_constants.test.ts`: existem as três categorias; `OFICINA` é a única fechada; todo canal tem propósito não vazio de no máximo duas linhas (RNF-06); os canais somente-leitura estão marcados como tais; o convite é o endereço permanente e aparece uma única vez
- [x] T006 Implementar `app/core/domain/constants/community_space_constants.ts` — a descrição do servidor canal a canal (RF-04, RF-12, RF-13), a frase sobre a área fechada (RF-14), o que pertence ao GitHub (RF-06) e o convite (RF-02)

## Fase 2 — Domínio: endereços e canais de contato

- [x] T007 Atualizar `app/tests/unit/core/domain/constants/site_routes_constants.test.ts`: `/comunidade` existe e entra em `staticRoutes()`
- [x] T008 Acrescentar `community: '/comunidade'` a `app/core/domain/constants/site_routes_constants.ts` (RF-03, RF-11)
- [x] T009 Atualizar `app/tests/unit/core/domain/constants/organization_constants.test.ts`: nenhum canal pendente resta; o Discord está pronto com o convite; o canal interno da comunidade aponta para a rota, e não para endereço externo
- [x] T010 Alterar `app/core/domain/constants/organization_constants.ts`: `target: 'interno' | 'externo'` em `ReadyContactChannel`, Discord de `pending` para `ready`, entrada da página da comunidade (RF-01, RF-09)

## Fase 3 — Aplicação: as duas regras

- [x] T011 [P] Teste de `app/tests/unit/core/application/community/validate_community_invite_use_case.test.ts`: aceita convite `https://discord.gg/<código>`; recusa ausente, vazio, só espaços, outro domínio e caminho sem código, nomeando o recebido
- [x] T012 [P] Implementar `app/core/application/community/validate_community_invite_use_case.ts` e sua interface em `app/interfaces/core/application/community/i_validate_community_invite_use_case.ts` (RF-02, RF-10)
- [x] T013 [P] Teste de `app/tests/unit/core/application/community/describe_community_space_use_case.test.ts`: devolve as categorias públicas com seus canais; devolve a categoria fechada só pelo nome, sem canal algum; a ordem é a declarada
- [x] T014 [P] Implementar `app/core/application/community/describe_community_space_use_case.ts` e sua interface em `app/interfaces/core/application/community/i_describe_community_space_use_case.ts` (RF-07, RF-14)

## Fase 4 — Portão de publicação

- [x] T015 Atualizar `app/tests/unit/adapters/commands/generate_catalog_command.test.ts`: convite inválido aborta com código 1 antes de gerar catálogo; convite válido não altera o caminho feliz
- [x] T016 Alterar `app/adapters/commands/generate_catalog_command.ts` para validar o convite antes de gerar (RF-10)
- [x] T017 Registrar os dois casos de uso em `app/infra/init/ioc_init.ts`

## Fase 5 — As capturas

- [x] T018 Recolher `OFICINA` no Discord, conferir pela barra lateral que nenhum canal fechado está visível, e só então capturar (RF-16)
- [x] T019 [P] Gravar `app/public/imagens/comunidade/estrutura.webp` — barra lateral com as três categorias, `OFICINA` recolhida, sem a coluna de servidores pessoais
- [x] T020 [P] Gravar `app/public/imagens/comunidade/canal-boas-vindas.webp`
- [x] T021 [P] Gravar `app/public/imagens/comunidade/canal-anuncios.webp`
- [x] T022 [P] Gravar `app/public/imagens/comunidade/canal-forum.webp`
- [x] T023 Conferir uma a uma: interface em português (RF-20), soma ≤ 50 KB e nenhuma acima de 25 KB (RNF-07), legível na largura de um telefone (RNF-09)
- [x] T024 Declarar `public/` como origem de arquivos estáticos em `app/angular.json` (RF-18)

## Fase 6 — A página

- [x] T025 Teste de `app/tests/unit/adapters/presenters/community/community-page.component.test.ts`: renderiza as categorias públicas canal a canal; cita a fechada sem listar canais; marca os somente-leitura; toda imagem tem texto alternativo e dimensões declaradas; a ligação de entrada usa o convite da constante
- [x] T026 Implementar `app/adapters/presenters/community/community-page.component.ts` (RF-03 a RF-08, RF-13, RF-14, RF-15, RF-17, RF-19, RNF-08)
- [x] T027 Atualizar `app/tests/unit/infra/init/web_routes.test.ts`: a rota da comunidade resolve para o componente
- [x] T028 Acrescentar a rota em `app/infra/init/web_routes.ts`
- [x] T029 Atualizar `app/tests/unit/adapters/presenters/layout/site-header.component.test.ts`: o menu principal leva à comunidade
- [x] T030 Alterar `app/adapters/presenters/layout/site-header.component.ts` (RF-09)
- [x] T031 Atualizar `app/tests/unit/adapters/presenters/layout/site-footer.component.test.ts`: canal interno usa navegação do roteador, externo usa endereço com `rel="noopener"`; nenhum canal pendente é renderizado
- [x] T032 Alterar `app/adapters/presenters/layout/site-footer.component.ts` (RF-01, RF-09)

## Fase 7 — Comportamento

- [x] T033 Escrever `app/tests/bdd/features/discord_na_vitrine.feature` com os treze cenários da spec, em `# language: pt`
- [x] T034 Implementar `app/tests/bdd/steps/community/community_steps.ts`
- [x] T035 Cenário RF-01 e RF-08 — o canal de conversa deixa de faltar
- [x] T036 Cenário RF-02 e RF-10 — convite inválido reprova a publicação
- [x] T037 Cenário RF-03 e RF-09 — a explicação está a um clique de qualquer página
- [x] T038 Cenário RF-04 — a página descreve o servidor que existe
- [x] T039 Cenário RF-05 — onde eu posso falar fica explícito
- [x] T040 Cenário RF-06 — o que é do GitHub vai para o GitHub
- [x] T041 Cenário RF-07 e RF-14 — o espaço privado é citado sem ser exposto
- [x] T042 Cenário RF-11 — a página é arquivo estático como as demais
- [x] T043 Cenário RF-13 — cada canal é nomeado e explicado
- [x] T044 Cenário RF-15 — cada trecho tem sua ilustração
- [x] T045 Cenário RF-16 — a captura não expõe o que é fechado
- [x] T046 Cenário RF-17 e RF-19 — quem não vê a imagem não perde informação
- [x] T047 Cenário RF-18 e RNF-07 — imagem é arquivo nosso, e leve
- [x] T048 Cenário RNF-01 e RNF-02 — a página nova não rebaixa a medição

## Fase 8 — Fechamento

- [x] T049 Atualizar a descrição do alvo `catalog` em `CLAUDE.md`: passa a reprovar por curadoria **ou** convite inválido
- [x] T050 `make validate` verde, com a saída real reportada

## Ordem de execução

Fases 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8. As capturas (fase 5) vêm antes da página porque o
componente declara dimensão de cada imagem, e dimensão sai do arquivo.

## Rastreabilidade

| Requisito | Tarefas |
|---|---|
| RF-01 | T009, T010, T031, T032, T035 |
| RF-02 | T005, T006, T011, T012, T036 |
| RF-03 | T007, T008, T025, T026, T037 |
| RF-04 | T005, T006, T025, T026, T038 |
| RF-05 | T005, T006, T025, T026, T039 |
| RF-06 | T005, T006, T026, T040 |
| RF-07 | T013, T014, T026, T041 |
| RF-08 | T006, T026, T035 |
| RF-09 | T010, T029, T030, T031, T032, T037 |
| RF-10 | T011, T012, T015, T016, T036 |
| RF-11 | T007, T008, T042 |
| RF-12 | T005, T006 |
| RF-13 | T005, T006, T025, T026, T043 |
| RF-14 | T006, T013, T014, T026, T041 |
| RF-15 | T019, T020, T021, T022, T026, T044 |
| RF-16 | T018, T019, T045 |
| RF-17 | T025, T026, T046 |
| RF-18 | T024, T026, T047 |
| RF-19 | T025, T026, T046 |
| RF-20 | T023 |
| RNF-01 | T025, T026, T048 |
| RNF-02 | T023, T048, T050 |
| RNF-03 | T006, T026, T033 |
| RNF-04 | T050 |
| RNF-05 | T007, T008 |
| RNF-06 | T005, T006 |
| RNF-07 | T023, T047 |
| RNF-08 | T025, T026 |
| RNF-09 | T023 |

## Convergence

<!-- append-only: cada rodada acrescenta um bloco datado -->

### Rodada 1 — 2026-09-02

| Requisito | Estado | Evidência |
|---|---|---|
| RF-01 | realizado | `organization_constants.ts` — Discord `ready` com o convite; zero pendentes |
| RF-02 | realizado | `COMMUNITY_INVITE_URL` — convite permanente, declarado uma única vez |
| RF-03 | realizado | `site_routes_constants.ts` + `community-page.component.ts` |
| RF-04 | realizado | `community_space_constants.ts` descreve as três categorias e seus canais |
| RF-05 | realizado | A página marca `, somente leitura` e explica o motivo |
| RF-06 | realizado | `GITHUB_TOPICS` e a seção "O que não se resolve aqui" |
| RF-07 | realizado | `describe_community_space_use_case.ts` poda os canais da categoria fechada |
| RF-08 | realizado | Página e rodapé leem a mesma constante; endereço declarado uma vez |
| RF-09 | realizado | Item no cabeçalho e canal interno no rodapé, com `routerLink` |
| RF-10 | realizado | `validate_community_invite_use_case.ts`, chamado por `generate_catalog_command.ts` |
| RF-11 | realizado | `/comunidade` sai de `staticRoutes()`; medido em `dist/browser/comunidade/index.html` |
| RF-12 | realizado | A descrição vive só em `community_space_constants.ts` |
| RF-13 | realizado | Quatro canais de texto e duas salas de voz nomeados, um por linha |
| RF-14 | realizado | `OFICINA` citada com propósito e `channels: []` |
| RF-15 | realizado | Quatro capturas reais em `app/public/imagens/comunidade/` |
| RF-16 | realizado | `OFICINA` recolhida antes de cada captura, conferida por consulta ao DOM; coluna de servidores pessoais recortada |
| RF-17 | realizado | Texto alternativo e legenda distintos em cada `figure`, afirmado por cenário |
| RF-18 | realizado | `angular.json` declara `public/`; nenhuma imagem vem de terceiro |
| RF-19 | realizado | Cenário confere que todo canal ilustrado aparece também no texto |
| RF-20 | realizado | Idioma da conta trocado para português e as quatro capturas refeitas |
| RNF-01 | realizado | `axe` sem violação; Lighthouse Acessibilidade passando |
| RNF-02 | realizado | Performance 100 na página nova; CLS 0,000 |
| RNF-03 | realizado | Página, constantes, cenários e capturas em português |
| RNF-04 | realizado | `check_links.sh` cobre `/comunidade` |
| RNF-05 | realizado | Endereço `/comunidade` fixado antes de publicar |
| RNF-06 | realizado | Teste de constante recusa propósito acima de 110 caracteres |
| RNF-07 | realizado | 42,6 KB no total; maior imagem 20 KB |
| RNF-08 | realizado | Largura e altura declaradas; CLS medido em 0,000 |
| RNF-09 | realizado | Capturas em 560 px de largura, legíveis em telefone |

Veredito: **convergido**. Tarefas acrescentadas: nenhuma.

`make validate` real: 64 arquivos de teste unitário, cobertura 100% de linhas e 99,45% de ramos,
8 arquivos de integração, 90 cenários e 540 passos — todos passando.

**Excesso de escopo:** nenhum código entregue sem requisito que o peça.

**Três decisões tomadas durante a implementação:**

1. **O teto de bytes por página subiu de 126 KB para 180 KB** (`lighthouserc.json` e o cenário
   RNF-05 da feature 002). Decisão do usuário, registrada no esclarecimento 7 da spec. O que
   reprovava não era o Lighthouse — Performance mede 100 —, e sim um teto escrito à mão quando o
   sítio não tinha imagem alguma, e que deixava 12 KB para ilustração.
2. **O cenário RF-09 da feature 002 foi estreitado.** Ele afirmava que nenhuma página pública
   carrega imagem; passou a afirmar que nenhuma **imagem decorativa** é carregada nas páginas que
   sustentam a identidade. A identidade segue sem ilustração; o que passou a existir é imagem de
   conteúdo, e proibi-la impediria qualquer página de mostrar o que descreve.
3. **A rota da comunidade ficou ansiosa, e não sob demanda.** Sob demanda poupava 2,8 KB no pacote
   inicial e custava deslocamento de layout de 0,248 — o pedaço chegava depois da hidratação e o
   rodapé pulava. O pacote fica em 251,2 KB: 1,2 KB acima do limiar de **aviso**, 48,8 KB abaixo
   do de erro.

**Um defeito corrigido fora do escopo pedido:** o alvo `audit-only` não limpava os relatórios
anteriores, e o cenário de qualidade lia o pior resultado de todas as execuções já feitas — uma
construção verde parecia reprovada por medição de dias atrás. O alvo passa a limpar antes de medir.

