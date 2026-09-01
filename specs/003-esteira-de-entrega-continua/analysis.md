# Análise de consistência — Esteira de entrega contínua

> Etapa somente leitura. Rodada 1, 2026-09-01. Confronta constituição × spec × plan × tasks.

## Bloqueadores

### B1 — A publicação por ação contradiz a letra do Princípio 7

**Onde.** `.specify/memory/constitution.md`, Princípio 7, primeira linha:

> "O artefato de deploy é HTML, CSS, JS e mídia estáticos, servidos pelo GitHub Pages **a partir
> da branch `master`**."

Contra `spec.md` RF-14 e o esclarecimento 7 ("passa a publicar **por ação**"), e contra
`plan.md`, que declara `actions/deploy-pages` e a troca da configuração do repositório de modo
legado para modo por ação.

**Por que bloqueia.** A constituição prevalece sobre qualquer outra instrução, e a
implementação mudaria a origem do que o Pages serve — de conteúdo de branch para artefato de
execução. Implementar assim é violar o princípio; implementar servindo `master` é reprovar
RF-14, que exige publicar o artefato já auditado. Não há terceira opção.

**Etapa dona.** `constitution` — o princípio precisa de emenda de redação, na mesma classe das
emendas 1.0.1 e 1.0.2: o que o princípio protege é *publicação estática, sem runtime de
servidor*, e isso continua íntegro; o que caducou é a cláusula que fixava o **mecanismo** da
origem. A emenda exige aprovação do usuário.

**O que fazer.** Emendar o Princípio 7 para descrever o artefato e a ausência de runtime sem
prender a origem à branch `master`, preservando integralmente as três proibições e o critério
de verificação. Sem a emenda, a alternativa é reverter o esclarecimento 7 e reescrever RF-14.

### B2 — RF-10 não diz qual é a primeira versão, e é esse o estado atual do repositório

**Onde.** `spec.md`, RF-10 e os três cenários de versionamento: todos partem de "a última
versão publicada é `v1.2.3`". O repositório tem **zero tags e zero releases** — a primeira
execução da esteira cai exatamente no caso não especificado.

**Por que bloqueia.** `tasks.md` T049 já contorna o vazio inventando requisito: "sem versão
anterior, parte da **versão inicial declarada**" — declarada onde? A spec não a declara, o
plano não a fixa, e nenhum cenário a mede. Quem implementar vai escolher entre `v0.1.0`,
`v1.0.0` e o `1.0.0` de `app/package.json` por conta própria, e o número escolhido vira a
primeira release pública da vitrine.

**Etapa dona.** `specify` — falta requisito e falta cenário. A pergunta chegou a ser feita na
clarificação ("a primeira versão parte de v1.0.0 ou de v0.1.0?"), mas a resposta recebida
tratou apenas da regra de incremento.

**O que fazer.** Acrescentar a RF-10 a regra da primeira versão e um cenário
*sem versão anterior* em `promocao_entre_branches.feature`; propagar ao plano e às tarefas.

## Avisos

| # | Achado | Onde | Por que não bloqueia |
|---|---|---|---|
| A1 | `app/angular.json` é alterado por T076 (isenção de cobertura de `main_pipeline.ts` e `pipeline_ioc_init.ts`) mas não aparece na lista de arquivos do plano | `plan.md` × `tasks.md` | A tarefa existe e está correta; a lacuna é de redação do plano. Sem ela, `make cover` reprovaria os dois arquivos de fiação |
| A2 | `config_tool.repositoryWorkspace()` não tem consumidor de produção declarado — quem lê `.github` é o motor de BDD, que é teste | `plan.md` | Acessório sem uso é YAGNI (Princípio 4). Ou ganha consumidor, ou sai do plano na implementação |
| A3 | Os cinco fluxos e o `CODEOWNERS` vivem fora de `app/`, contra a letra do Princípio 2 | `plan.md` | Exceção declarada, justificada e sem alternativa técnica: o GitHub só resolve fluxo em `.github/workflows`. Nenhum deles carrega decisão, por construção do plano |
| A4 | Cada job roda `make infra` por conta própria (build da imagem e `npm install`), dez vezes na esteira de validação | `plan.md` × RNF-07 | O teto de 30 min é por job, não pela execução. Ainda assim, se a construção da imagem passar a dominar o tempo, cache de camada vira necessidade — a medir na implementação |
| A5 | RF-19 declara proprietários, mas ligar `require_code_owner_reviews` está em *Fora de escopo* | `spec.md` | O arquivo declarado é condição necessária; torná-lo obrigatório é ato de configuração do proprietário, e a entrega o apontará |
| A6 | RF-02 pede os sete passos de `make validate`, e o plano roda dois deles como `audit-only` e `bdd-only` | `plan.md` | Mesma verificação, sem repetir construção — é o esclarecimento 6. O comportamento externo de `make audit` e `make bdd` fica idêntico |

## Conferências que passaram

- **tasks × plan** — os 33 arquivos de produção e teste do plano têm tarefa; nenhuma tarefa
  cria arquivo que o plano não preveja, exceto `app/angular.json` (A1).
- **tasks × spec** — os 26 cenários da spec viraram 26 tarefas de cenário (T018–T031 e
  T086–T097), sem sobra e sem falta.
- **tasks × tasks** — nenhuma tarefa `[P]` compartilha arquivo com outra `[P]` da mesma fase.
  Nos arquivos `.feature`, escritos por duas fases, apenas a primeira tarefa de cada arquivo
  em cada fase é `[P]`.
- **plan × spec** — os 20 RF e os 8 RNF aparecem na tabela de rastreabilidade do plano, cada
  um com arquivo nomeado.
- **plan × constituição** — dependências apontam para dentro: `core/application/pipeline` só
  conhece `core/domain` e as abstrações de `interfaces/`; processo e disco ficam nos
  repositories; ambiente fica em `infra/tools`. Todo arquivo de produção tem teste espelhado no
  caminho espelhado, salvo os dois isentos por natureza de fiação.

## Veredito

**`nook`** — dois bloqueadores. Voltar para **`/bu:constitution`** (B1), que é a etapa mais
anterior das duas; a passagem por `/bu:specify` na sequência resolve B2.

---

# Análise de consistência — rodada 2

> 2026-09-01, após a emenda constitucional e a segunda rodada de clarificação.

## Bloqueadores da rodada 1 — desfecho

| # | Estado | Como foi fechado |
|---|---|---|
| B1 | **fechado** | Constituição emendada para **1.0.3**, com texto lido e aprovado pelo usuário. O Princípio 7 deixa de prender a publicação à branch `master` e passa a exigir o que protege — artefato estático construído e verificado, sem runtime entre o visitante e o disco. As três proibições e o critério de verificação seguem palavra por palavra; nenhum princípio foi removido ou invertido |
| B2 | **fechado** | RF-10 passa a declarar a primeira versão: **`v1.0.0`, sem aplicar incremento**, com o esclarecimento 11 registrado, cenário *sem versão anterior* na spec, decisão técnica no plano e tarefa T102 |

## Avisos da rodada 1 — desfecho

| # | Estado | Observação |
|---|---|---|
| A1 | **corrigido** | `app/angular.json` entra na lista de arquivos do plano, com o motivo da isenção |
| A2 | **corrigido** | `repositoryWorkspace()` sai do plano e das tarefas. `config_tool` ganha três acessos, cada um com consumidor de produção |
| A3 | **mantido** | Fluxos e `CODEOWNERS` fora de `app/`: exceção declarada, justificada e sem alternativa técnica. Nenhum deles carrega decisão |
| A4 | **mantido** | `make infra` por job pode dominar o tempo. A medir na implementação; o teto de RNF-07 é por job |
| A5 | **mantido** | Ligar `require_code_owner_reviews` é ato de configuração do proprietário, apontado na entrega |
| A6 | **mantido** | `audit-only` e `bdd-only` fazem a mesma verificação sem repetir construção — esclarecimento 6 |

## Conferências desta rodada

- **spec** — zero marcas `[NECESSITA ESCLARECIMENTO]`; onze esclarecimentos registrados com data.
- **spec × tasks** — 27 cenários na especificação, 27 tarefas de cenário nas tarefas.
- **spec × constituição** — RF-14 e o esclarecimento 7 agora repousam sobre o Princípio 7
  emendado; nenhum outro requisito confronta princípio.
- **plan × tasks** — todo arquivo do plano tem tarefa; nenhuma tarefa cria arquivo ausente do
  plano.
- **tasks × tasks** — nenhuma `[P]` compartilha arquivo com outra `[P]` da mesma fase; T102
  entra em `promocao_entre_branches.feature` sem `[P]`, porque T089 já a marca naquela fase.
- **constituição** — os princípios da organização seguem íntegros; os específicos deste
  projeto, mais os refinamentos dos Princípios 1, 2 e 3, passam a viver em `.specify/project.md`,
  que é versionado. Até esta rodada eles existiam apenas no arquivo que o `.gitignore` exclui, e
  não sobreviviam a um clone.

## Veredito

**`ok`** — zero bloqueadores. Segue para `/bu:implement`.
