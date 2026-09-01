# Tarefas — Identidade visual da vitrine

> Ordem de dependência. `[P]` marca tarefa paralelizável (não toca arquivo de outra `[P]`
> da mesma fase). Teste vem antes da implementação que ele prova.

**Não há fase de domínio nem de aplicação.** Esta feature não cria regra, não fala com serviço
externo e não injeta nada: nada nasce em `core`, `infra` ou `interfaces`.

**Como o teste vem antes da implementação, sendo a entrega uma folha de estilo.** Estilo não tem
teste unitário porque não é código instrumentável; quem o prova é o cenário de BDD que lê o
estilo computado da página construída. Por isso a ordem é: primeiro o que permite medir (Fase 1),
depois a medição (Fase 2), **depois** tudo que a satisfaz — inclusive a fonte, que é produção e
por isso só entra na Fase 3.

> A análise de 2026-08-31 reprovou a primeira versão destas tarefas por pôr a fonte e o aperto do
> portão de peso numa Fase 0, antes dos cenários que os medem. A ordem abaixo é a correção.

## Fase 1 — Suporte de medição: o que permite os cenários existirem

Nenhum cenário da Fase 2 roda sem isto. T001 e T002 tocam o mesmo arquivo e por isso **não** são
paralelizáveis entre si — quem implementar faz as duas na mesma passagem.

- [x] T001 Em `app/tests/bdd/support/browser_driver.ts`, registrar toda requisição cujo host difira do host do sítio, expondo-as ao passo — é o que o `RNF-06` mede (hoje o driver só registra chamadas à API do GitHub)
- [x] T002 Em `app/tests/bdd/support/browser_driver.ts`, permitir abrir contexto com `reducedMotion: 'reduce'`, para o cenário do `RNF-08` poder existir
- [x] T003 [P] Em `app/tests/bdd/steps/process/audit_steps.ts`, acrescentar passo que lê o `total-byte-weight` do relatório do Lighthouse em `coverage/lighthouse` e o confronta com o teto absoluto de 126 kB por página — `RNF-05`. A linha de base por essa métrica é 78,05 kB, medida em 2026-08-31

## Fase 2 — Os cenários, que falham antes das Fases 3 e 4

- [x] T004 Criar `app/tests/bdd/steps/browser/appearance_steps.ts` com o utilitário que normaliza cor computada para comparação numérica, ignorando o totalmente transparente — é a mitigação do risco alto do plano
- [x] T005 Cenário *RF-01 — fundo escuro com texto claro* em `app/tests/bdd/features/identidade_visual_da_vitrine.feature`, medindo luminância relativa do fundo contra a do texto (`# language: pt`)
- [x] T006 Cenário *RF-02 — nenhuma cor fora do conjunto declarado* em `app/tests/bdd/features/identidade_visual_da_vitrine.feature`, lendo as fichas de `:root` e confrontando com toda cor computada da página
- [x] T007 Cenário *RF-08 — o enquadramento é o mesmo em toda página* em `app/tests/bdd/features/identidade_visual_da_vitrine.feature`
- [x] T008 Cenário *RF-09 — a identidade não depende de imagem* em `app/tests/bdd/features/identidade_visual_da_vitrine.feature`
- [x] T009 Cenário *RF-03 — os quatro níveis se distinguem* em `app/tests/bdd/features/hierarquia_tipografica.feature`, exigindo diferença em ao menos dois atributos por par de níveis
- [x] T010 Cenário *RF-06 — os itens do catálogo se leem como unidades* em `app/tests/bdd/features/hierarquia_tipografica.feature`
- [x] T011 Cenário *RF-04 — o destaque da curadoria produz efeito visível* em `app/tests/bdd/features/estado_visivel_dos_controles.feature`, verificando também que posição e tamanho não mudam
- [x] T012 Cenário *RF-05 — a restrição aplicada é visível* em `app/tests/bdd/features/estado_visivel_dos_controles.feature`, exigindo distinção que não se reduza à cor
- [x] T013 Cenário *RF-07 — o foco é sempre visível* em `app/tests/bdd/features/estado_visivel_dos_controles.feature`
- [x] T014 Cenário *RF-10 — nenhum controle com aparência padrão do navegador* em `app/tests/bdd/features/estado_visivel_dos_controles.feature`
- [x] T015 Cenário *RNF-01 e RNF-02 — contraste de texto e de elemento* em `app/tests/bdd/features/qualidade_preservada_pela_mudanca_visual.feature`
- [x] T016 Cenário *RNF-05 — o peso da entrega permanece dentro do orçamento* em `app/tests/bdd/features/qualidade_preservada_pela_mudanca_visual.feature`
- [x] T017 Cenário *RNF-06 — o artefato não depende de domínio externo* em `app/tests/bdd/features/qualidade_preservada_pela_mudanca_visual.feature`
- [x] T018 Cenário *RNF-08 — movimento reduzido é respeitado* em `app/tests/bdd/features/qualidade_preservada_pela_mudanca_visual.feature`
- [x] T019 Cenário *RNF-09 — a mudança visual não alterou o conteúdo* em `app/tests/bdd/features/qualidade_preservada_pela_mudanca_visual.feature`
- [x] T020 Implementar em `app/tests/bdd/steps/browser/appearance_steps.ts` todos os passos que os cenários T005 a T019 declaram e que ainda não existem
- [x] T021 Rodar `bdd` de `app/Makefile` e **registrar quais cenários falham**. A lista é o critério de pronto das Fases 3 e 4. Registrar também, separadamente, quais passam **antes** da implementação: `RNF-05` e `RNF-06` passam de saída, porque são guardas contra regressão e não motores de mudança — cenário que passa de saída sem ser guarda é cenário que não mede nada.
  **Medido em 2026-08-31**: 46 cenários, 39 passam, **7 falham** — RF-01 (fundo claro nas 6 rotas),
  RF-02 (435 cores fora do conjunto), RF-03 (corrido e metadado idênticos), RF-04 (destaque sem
  estilo), RF-05 (restrição sem estilo), RF-09 (branco padrão do navegador), RF-10 (botões com
  aparência padrão). Passam de saída, como guardas: RF-06, RF-07, RF-08, RNF-01/02, RNF-05,
  RNF-06, RNF-08 e RNF-09

## Fase 3 — A fonte entra no artefato

- [x] T022 Acrescentar `@fontsource-variable/geist@5.3.0` às dependências em `app/package.json`, e instalar pelo alvo `install` de `app/Makefile`
- [x] T023 **Divergência do plano, com motivo.** A `index.css` do pacote declara **cinco** subconjuntos — cirílico, cirílico estendido, vietnamita, latin-ext e latin — e a vitrine só escreve português. Em vez de declará-la no `styles` do build, a `@font-face` do subconjunto latino foi escrita em `app/styles.css`, o que embarca **um** arquivo de 29,4 kB e permite declarar a face de recuo no mesmo lugar. `app/angular.json` não precisou mudar; o build emitiu `media/geist-latin-wght-normal-T72VVCUW.woff2` e reescreveu a `url()`
- [x] T024 **Abandonada com motivo, em 2026-08-31.** O build emite a fonte com hash de conteúdo no nome — `media/geist-latin-wght-normal-T72VVCUW.woff2` —, e `app/index.html` é estático: não há como referenciar o arquivo numa pré-carga escrita à mão. A mitigação de CLS passa a ser inteiramente a face de recuo com `size-adjust`, que já era a parte que sustentava o número. O portão de CLS ≤ 0,1 continua medindo o resultado
- [x] T025 Apertar a asserção `total-byte-weight` de `app/lighthouserc.json` de 307200 para 129024 bytes, que é o teto de 126 kB do `RNF-05`, e confirmar pelo alvo `audit` que o peso com a fonte já embutida cabe nele

## Fase 4 — O estilo que faz os cenários passarem

- [x] T026 Declarar as fichas em `:root` de `app/styles.css`: `--surface`, `--surface-raised`, `--text`, `--text-muted`, `--accent`, `--line`, `--hairline`, com o contraste medido de cada uma no comentário, como o arquivo já faz hoje (`RF-01`, `RF-02`, `RNF-01`, `RNF-02`)
- [x] T027 Declarar em `app/styles.css` a escala tipográfica dos quatro níveis — tamanho, peso, entrelinha, espaçamento e família —, com a família do metadado na pilha monoespaçada do dispositivo (`RF-03`)
- [x] T028 Declarar em `app/styles.css` a face de recuo ajustada por `size-adjust` e o `font-display: swap`, para a troca de fonte não deslocar o texto e não estourar o CLS de 0,1 herdado da 001
- [x] T029 Aplicar em `app/styles.css` o fundo escuro e o texto claro em `body`, mais `color-scheme: dark`, para o navegador acompanhar barra de rolagem e controle nativo (`RF-01`)
- [x] T030 Estilar em `app/styles.css` os elementos que hoje aparecem com a aparência padrão do navegador: ligação, lista de tecnologias, botão e agrupamento de controle (`RF-10`)
- [x] T031 Declarar em `app/styles.css` a indicação de foco por `:focus-visible`, com contraste de ao menos 3:1 contra o entorno (`RF-07`, `RNF-02`)
- [x] T032 Ajustar em `app/styles.css` o ritmo vertical e a malha do catálogo, de modo que o espaço entre itens supere o espaço interno do item (`RF-06`)
- [x] T033 Declarar em `app/styles.css` o enquadramento — cabeçalho, rodapé e fundo — uma única vez, de modo que valha para toda rota (`RF-08`)
- [x] T034 Manter em `app/styles.css` a supressão de animação e transição sob `prefers-reduced-motion`, cobrindo animação **e** transição (`RNF-08`)
- [x] T035 Acrescentar `styles` a `app/adapters/presenters/catalog/project-card.component.ts` — fio de acento e selo em mono para o item destacado, sem tocar no template nem na classe, e sem alterar posição ou tamanho (`RF-04`). Provado por T011; os testes unitários existentes em `app/tests/unit/adapters/presenters/catalog/project-card.component.test.ts` continuam valendo sem edição, porque o comportamento não muda
- [x] T036 Acrescentar `styles` a `app/adapters/presenters/catalog/technology-filter.component.ts` — fundo de acento com texto escuro e fio inferior persistente no botão com `aria-pressed="true"`, sem tocar no template nem na classe (`RF-05`). Provado por T012; os testes unitários existentes em `app/tests/unit/adapters/presenters/catalog/technology-filter.component.test.ts` continuam valendo sem edição

## Fase 5 — Fechamento

- [x] T037 Rodar `bdd` de `app/Makefile` e confirmar que **todos** os cenários listados em T021 passaram, sem nenhum cenário novo falhando
- [x] T038 Rodar `audit` de `app/Makefile` e confirmar Lighthouse ≥ 90 nas quatro categorias, LCP ≤ 2,5 s, CLS ≤ 0,1 e peso total dentro dos 129024 bytes (`RNF-04`, `RNF-05`). **Medido em 2026-08-31**: desempenho 100, boas práticas 100, SEO 100, acessibilidade 98; peso da página mais pesada **112.050 B (109,4 kB)** contra o teto de 129.024 B
- [x] T039 `make validate` verde de ponta a ponta pelo alvo `validate` de `app/Makefile`: `fmt` → `lint` → `test` → `cover` → `it` → `bdd` → `audit`

## Rastreabilidade

`RNF-03`, `RNF-04` e `RNF-07` não têm tarefa de cenário próprio: já são guardados pela suíte da
001, que continua rodando na mesma cadeia. Aparecem aqui nas tarefas de fechamento, que são
onde se confirma que não regrediram.

| Requisito | Tarefas |
|---|---|
| RF-01 | T004, T005, T026, T029 |
| RF-02 | T004, T006, T026 |
| RF-03 | T009, T020, T022, T023, T024, T027, T028 |
| RF-04 | T011, T020, T035 |
| RF-05 | T012, T020, T036 |
| RF-06 | T010, T020, T032 |
| RF-07 | T013, T020, T031 |
| RF-08 | T007, T020, T033 |
| RF-09 | T008, T020 |
| RF-10 | T014, T020, T030 |
| RNF-01 | T015, T020, T026, T038 |
| RNF-02 | T015, T020, T026, T031, T038 |
| RNF-03 | T015, T037, T038 |
| RNF-04 | T038, T039 |
| RNF-05 | T003, T016, T025, T028, T038 |
| RNF-06 | T001, T017, T020, T022, T023 |
| RNF-07 | T037, T039 |
| RNF-08 | T002, T018, T020, T034 |
| RNF-09 | T019, T020 |

## Convergence

> Seção **append-only**, escrita por `/bu:converge`. Cada rodada acrescenta um bloco;
> nada é reescrito.


### Rodada 1 — 2026-08-31

| Requisito | Estado | Evidência |
|---|---|---|
| RF-01 | realizado | `app/styles.css:45` (`--surface: #0e1011`), `:88` (`color-scheme: dark`) e `:92` (`body`). O cenário mede luminância do fundo contra a do texto nas **6** rotas públicas e passa |
| RF-02 | realizado | As sete fichas em `:root`, `app/styles.css:45-51`. O cenário lê o conjunto da própria página e o confronta com toda cor pintada; passa com **0** cores fora, contra **435** na primeira medição |
| RF-03 | realizado | `app/styles.css:118` (h1 a 40px, peso 400, tracking −1,2px, entrelinha 1,02) e `:292` (metadado em `ui-monospace`, 13px, caixa alta). Cada par de níveis difere em mais de um atributo; o cenário passa |
| RF-04 | realizado | `styles` de `app/adapters/presenters/catalog/project-card.component.ts` — fio de acento `rgb(61,220,132)` à esquerda e selo em mono invertido. O cenário verifica também que largura e posição não mudam, e passa |
| RF-05 | realizado | `styles` de `app/adapters/presenters/catalog/technology-filter.component.ts` — fundo de acento, peso 700 e fio inferior de 2,4px. O cenário exige distinção que não se reduza à cor e passa |
| RF-06 | realizado | `app/styles.css:240`, malha com `gap: var(--space-6)`. O cenário mede espaço entre itens contra espaço interno e passa |
| RF-07 | realizado | `app/styles.css:163`, `:focus-visible` com contorno de acento. O cenário percorre todo elemento interativo e passa |
| RF-08 | realizado | Cabeçalho, rodapé e `main` declarados uma vez em `app/styles.css`. O cenário compara o enquadramento computado entre as 6 rotas e passa |
| RF-09 | realizado | Nenhuma imagem em nenhuma rota; o artefato tem apenas HTML, JS, CSS e a fonte. O cenário passa |
| RF-10 | realizado | `app/styles.css:152` (ligação), `:265` (botão), `:249` (agrupamento). O cenário compara cada elemento interativo com o mesmo elemento renderizado sem a folha do sítio, num documento isolado, e passa |
| RNF-01 | realizado | Varredura `axe` de contraste sobre as 6 rotas: **0** violações. Contrastes declarados e medidos no comentário de `app/styles.css:38` |
| RNF-02 | realizado | `--line` em **3,02:1** contra o mínimo de 3:1; foco em `--accent`, **10,69:1** |
| RNF-03 | realizado | **0** violações críticas ou sérias. A varredura passou a cobrir também as páginas de projeto e a registrar contraste em qualquer severidade — duas lacunas da 001 corrigidas aqui |
| RNF-04 | realizado | Lighthouse sobre 5 URLs: desempenho **100**, boas práticas **100**, SEO **100**, acessibilidade **98** |
| RNF-05 | realizado | Peso da página mais pesada: **112.050 B (109,4 kB)** contra o teto de 129.024 B. A asserção `total-byte-weight` de `app/lighthouserc.json` foi apertada de 307.200 para 129.024 |
| RNF-06 | realizado | **0** requisições a domínio externo. A fonte é servida pelo próprio artefato, em `dist/browser/media/geist-latin-wght-normal-T72VVCUW.woff2` |
| RNF-07 | realizado | Cenário de 320 px herdado da 001, que continua rodando e passando |
| RNF-08 | realizado | `app/styles.css:338`, cobrindo animação **e** transição. O cenário abre contexto com `reducedMotion: 'reduce'` e passa |
| RNF-09 | realizado | O cenário confronta nome, resumo e tecnologia renderizados com `data/catalog.generated.json`, no catálogo e em cada página de projeto, e passa |

**`make validate` — saída real:**

```
fmt    ok
lint   ok
test   38 arquivos, 283 testes, 0 falhas
cover  38 arquivos, 283 testes, limiar perFile de 90%
it      5 arquivos,  22 testes, 0 falhas
bdd    46 scenarios (46 passed) · 294 steps (294 passed)
audit  Lighthouse 5 URLs · 100/98/100/100 · peso 112.050 B de 129.024 B
VALIDATE EXIT=0
```

**O vermelho antes do verde.** A Fase 2 escreveu os 15 cenários e mediu o estado inicial: **7
falhavam** — RF-01 (fundo claro nas 6 rotas), RF-02 (435 cores fora do conjunto), RF-03 (texto
corrido e metadado idênticos), RF-04, RF-05, RF-09 e RF-10. Os outros 8 passavam de saída, por
serem guardas contra regressão e não motores de mudança. Nenhum cenário passou por afrouxamento
de asserção.

**Duas divergências do plano, ambas registradas nas tarefas:**

1. A fonte foi declarada em `app/styles.css`, e não pelo `styles` do `angular.json`: a folha do
   pacote traz cinco subconjuntos e a vitrine só escreve português. Um arquivo, 29,4 kB.
2. A pré-carga da fonte foi abandonada: o build emite o arquivo com hash de conteúdo no nome, e
   `index.html` é estático. A mitigação de CLS ficou inteiramente na face de recuo com
   `size-adjust`, que já era a parte que sustentava o número — e o CLS medido continua dentro de
   0,1.

**Três defeitos do arnês corrigidos de passagem**, todos encontrados por escrever os cenários:
a varredura `axe` da 001 nunca cobriu as páginas de projeto, apesar de o comentário ao lado
prometer que sim; violação de contraste podia escapar por severidade; e dois passos novos
colidiam com passos da 001, o que faria o Cucumber reprovar por ambiguidade.

**Excesso de escopo:** nenhum. Dez arquivos alterados e cinco criados, todos previstos no plano.
Nada do que a spec proíbe foi entregue: nenhum texto exibido mudou (`RNF-09` prova), nenhuma rota
foi acrescentada (6 antes, 6 depois), nenhuma imagem, nenhuma animação decorativa, nenhum segundo
idioma, e o canal de contato pendente segue pendente.

**Uma pendência de higiene, não de requisito:** `.specify/run.json`, o estado do orquestrador,
ficou sem rastreamento definido — o análogo `.claude/.bu-state.json` está no `.gitignore`, e este
não. Decidir se entra no `.gitignore` é do autor.

**Veredito: convergido.**

Tarefas acrescentadas: nenhuma. As 39 tarefas estão fechadas.
