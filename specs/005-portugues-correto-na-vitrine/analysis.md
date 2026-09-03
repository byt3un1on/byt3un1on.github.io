# Análise — Português correto na vitrine

> Etapa somente leitura. Não corrige: aponta e devolve à etapa dona.

## Rodada 1 — 2026-09-02

### Bloqueadores

Nenhum.

### Avisos

| # | Achado | Onde | Dona | Por que não bloqueia |
|---|---|---|---|---|
| A1 | RF-13 — os cenários que citam texto de tela seguem citando o texto exibido — não tem critério de aceite próprio | `spec.md`, seção Critérios de aceite | specify | O requisito se prova sozinho: enquanto a asserção citar a forma antiga, a suíte fica vermelha e `make validate` reprova. Um cenário que afirmasse isso estaria afirmando que a suíte passa, o que já é o portão da fase |
| A2 | RF-10 — a prosa dos documentos em Markdown — não tem cenário automatizável | `spec.md` RF-10, `tasks.md` T023 a T030 | specify | O esclarecimento 2 recusou a verificação automática de ortografia. Sem ela, a conferência de Markdown é humana por decisão do usuário, e está declarada como tarefa explícita em vez de subentendida |
| A3 | O repositório fica com prosa acentuada em Markdown e prosa sem acento em comentário de código, lado a lado no mesmo arquivo | `spec.md`, Fora de escopo | specify | É a decisão registrada no esclarecimento 3, tomada pelo usuário depois de ver a medição das ~3.300 ocorrências. A inconsistência é conhecida e escolhida, não descuidada |
| A4 | `app/tests/bdd/support/diacritics.ts` carrega lógica — normalização Unicode — sem teste unitário espelhado | `plan.md`, seção Cenários de aceite | plan | Não é arquivo de produção: nada em `app/adapters`, `app/core` ou `app/infra` o importa. O Princípio 3 exige espelho para código de produção, e o próprio uso nos doze cenários exercita a função em cada execução do `make bdd` |
| A5 | T002 corrige `organization_constants.ts`, mas o teste que fica vermelho antes dela é o do rodapé, em outra camada | `tasks.md` T001 e T002 | tasks | O rótulo é dado de domínio consumido pelo adapter, e é no adapter que ele vira texto de tela. `organization_constants.test.ts` afirma sobre estrutura — `id`, `url`, `target` —, e não sobre a redação do rótulo; forçar uma asserção de redação ali só para ter espelho direto duplicaria a verificação |
| A6 | Documentos em Markdown vivem fora de `app/`, e o Princípio 2 manda todo o código morar lá | `plan.md`, seção Prosa em Markdown | plan | O princípio fala de **código**. `README.md`, `specs/` e `.specify/` são justamente os artefatos que a própria constituição situa fora de `app/`, e a estrutura do projeto já os coloca ali desde a feature 001 |

### Confrontos verificados

| Confronto | Resultado |
|---|---|
| spec × constituição | Sem violação. A feature realiza o Princípio 6, que já mandava escrever em português do Brasil; nenhum requisito enfraquece outro princípio. O Princípio 8 é preservado: só o texto editorial da curadoria é tocado, e o que vem da API do GitHub fica intocado por Fora de escopo |
| plan × spec | Os quatorze RF e os seis RNF aparecem em ao menos um arquivo do plano. Nenhum arquivo do plano existe sem requisito que o justifique — as três criações em `tests/bdd/` derivam de RF-11 e dos critérios de aceite |
| plan × constituição | Nenhum caminho de código fora de `app/`. Nenhuma dependência muda de direção: `core/domain` continua sem importar `adapters` ou `infra`, e a correção em `organization_constants.ts` é valor de dado. Nenhuma ferramenta de linguagem é chamada fora do `make` |
| tasks × plan | Os arquivos do plano têm tarefa: doze de tela (T002 a T004, T007, T009, T011, T014, T016, T018 a T021), oito de teste que cita tela (T001, T006, T008, T010, T012, T013, T015, T017), três de cenário (T031 a T033) e oito de Markdown (T023 a T030). Nenhuma tarefa cria arquivo que o plano não previu |
| tasks × tasks | Nenhuma `[P]` da mesma fase compartilha arquivo. Na fase 1, T003 e T004 tocam arquivos distintos; na fase 2, T020 e T021 são componentes distintos; na fase 3, as oito tarefas são pastas ou arquivos distintos. T001 e T002 não são `[P]` porque a segunda depende de ver a primeira falhar |
| tasks × spec | Os doze cenários da spec estão em T032, e os passos que eles exigem em T033. Os requisitos sem cenário — RF-10 e RF-13 — estão registrados em A1 e A2, com a razão |

### Veredito

`ok` — implementar. Os seis avisos são de limite do que máquina verifica e de decisão já tomada
pelo usuário; nenhum impede começar.
