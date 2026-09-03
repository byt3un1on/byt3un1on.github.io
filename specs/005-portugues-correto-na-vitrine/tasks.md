# Tarefas — Português correto na vitrine

> Ordem de dependência. `[P]` marca tarefa paralelizável (não toca arquivo de outra `[P]`
> da mesma fase). Teste vem antes da implementação que ele prova.
>
> Em toda tarefa de correção vale a mesma regra: **só a grafia muda** (RF-11), e nada que
> dependa de codificação de caractere recebe acento (RF-12) — identificador, caminho de
> arquivo, rota, `slug`, chave de dado, nome de branch, de alvo do `Makefile` e de job.

## Fase 1 — Domínio e dados

- [x] T001 Trocar a asserção de rótulo para `'Organização no GitHub'` em `app/tests/unit/adapters/presenters/layout/site-footer.component.test.ts`, e ver o teste falhar por não encontrar a ligação
- [x] T002 Corrigir os rótulos de canal de contato em `app/core/domain/constants/organization_constants.ts` — `'Organizacao no GitHub'` vira `'Organização no GitHub'`; conferir os outros dois rótulos e os campos `id`, `url` e `target`, que não mudam
- [x] T003 [P] Corrigir os resumos editoriais em `app/data/curation.json` — os campos `name` e `summary` de cada projeto; `slug` e os nomes de repositório ficam intocados
- [x] T004 [P] Conferir `app/index.html`: `lang="pt-BR"`, título e descrição já acentuados; corrigir o que faltar
- [x] T005 `make test core` e `make test adapters/presenters/layout` verdes

## Fase 2 — Telas

- [x] T006 Trocar as asserções de texto e de descrição em `app/tests/unit/adapters/presenters/home/home-page.component.test.ts` para as formas acentuadas, e ver falhar
- [x] T007 Corrigir o template e a chamada ao `seo_tool` em `app/adapters/presenters/home/home-page.component.ts` — "construimos", "codigo", "constroi", "esta"
- [x] T008 Trocar as asserções de aviso vazio e de botão em `app/tests/unit/adapters/presenters/catalog/catalog-page.component.test.ts` para `'Nenhum projeto atende ao critério escolhido.'` e `'Remover a restrição'`, e ver falhar
- [x] T009 Corrigir o template e a chamada ao `seo_tool` em `app/adapters/presenters/catalog/catalog-page.component.ts`
- [x] T010 Trocar a asserção de ligação em `app/tests/unit/adapters/presenters/catalog/project-card.component.test.ts` para `'Ver o repositório'`, e ver falhar
- [x] T011 Corrigir o template em `app/adapters/presenters/catalog/project-card.component.ts`
- [x] T012 Trocar as três ocorrências de `'Ver o repositorio'` para `'Ver o repositório'` em `app/tests/bdd/steps/browser/catalog_steps.ts` — a asserção cita o texto da tela, e só por isso muda
- [x] T013 Trocar as asserções de ligação, título e descrição em `app/tests/unit/adapters/presenters/project/project-page.component.test.ts`, e ver falhar
- [x] T014 Corrigir o template e a chamada ao `seo_tool` em `app/adapters/presenters/project/project-page.component.ts` — "Abrir o endereco publicado", "Repositorios", "Projeto nao encontrado"
- [x] T015 Trocar as asserções de título e de descrição em `app/tests/unit/adapters/presenters/error/not-found-page.component.test.ts`, e ver falhar
- [x] T016 Corrigir o template e a chamada ao `seo_tool` em `app/adapters/presenters/error/not-found-page.component.ts`
- [x] T017 Trocar a asserção do atalho para `'Pular para o conteúdo'` em `app/tests/unit/adapters/presenters/layout/site-header.component.test.ts`, e ver falhar
- [x] T018 Corrigir o template em `app/adapters/presenters/layout/site-header.component.ts` — o alvo `href="#conteudo"` **não** muda, porque é âncora
- [x] T019 Corrigir o template e a chamada ao `seo_tool` em `app/adapters/presenters/community/community-page.component.ts` — parágrafos, títulos de seção, legendas e descrição alternativa de cada uma das quatro imagens; o caminho `imagens/comunidade/*.webp` fica intocado
- [x] T020 [P] Conferir `app/adapters/presenters/catalog/technology-filter.component.ts`: o texto exibido já está correto, e o que falta acento é comentário, fora de escopo
- [x] T021 [P] Conferir `app/adapters/presenters/layout/site-footer.component.ts`: o texto exibido já está correto; os rótulos vêm de `organization_constants.ts`, corrigidos em T002
- [x] T022 `make test adapters/presenters` verde, e `make cover adapters` acima de 90%

## Fase 3 — Prosa em Markdown

- [x] T023 [P] Corrigir a prosa de `README.md` — conferido por duas varreduras independentes: nenhuma correção necessária
- [x] T024 [P] Conferir `CLAUDE.md`, que já está acentuado; corrigir o que faltar
- [x] T025 [P] Corrigir a prosa de `.specify/project.md` — conferido, nenhuma correção necessária
- [x] T026 [P] Corrigir a prosa de `specs/001-vitrine-de-projetos-da-byte-union/` — `spec.md`, `plan.md`, `tasks.md` e os cinco checklists — conferido, nenhuma correção necessária
- [x] T027 [P] Corrigir a prosa de `specs/002-identidade-visual-da-vitrine/` — `spec.md`, `plan.md`, `tasks.md` e os quatro checklists — conferido, nenhuma correção necessária
- [x] T028 [P] Corrigir a prosa de `specs/003-esteira-de-entrega-continua/` — `spec.md`, `plan.md`, `tasks.md`, `analysis.md` e os quatro checklists — conferido, nenhuma correção necessária
- [x] T029 [P] Corrigir a prosa de `specs/004-discord-na-vitrine/` — `spec.md`, `plan.md`, `tasks.md`, `analysis.md` e os quatro checklists — conferido, nenhuma correção necessária
- [x] T030 [P] Corrigir a prosa de `specs/005-portugues-correto-na-vitrine/` — preservando as citações da forma errada, que nomeiam o defeito

## Fase 4 — Cenários de aceite e validação

- [x] T031 Criar `app/tests/bdd/support/diacritics.ts` com a remoção de diacríticos por normalização Unicode, para o passo de RF-11 comparar as duas formas
- [x] T032 Escrever `app/tests/bdd/features/portugues_correto_na_vitrine.feature` em `# language: pt`, com os doze cenários dos critérios de aceite da spec
- [x] T033 Implementar `app/tests/bdd/steps/language/language_steps.ts` com os passos que os doze cenários exigem, dirigindo o navegador contra o sítio construído
- [x] T034 `make bdd` verde, com os doze cenários novos passando e nenhum dos anteriores quebrado
- [x] T035 `make audit` verde: Acessibilidade e Desempenho ≥ 90 nas cinco páginas, zero violação crítica ou séria, peso ≤ 180 kB
- [x] T036 `make validate` verde de ponta a ponta

## Rastreabilidade

| Requisito | Tarefas |
|---|---|
| RF-01 | T006, T007, T032, T033 |
| RF-02 | T008, T009, T032, T033 |
| RF-03 | T013, T014, T032, T033 |
| RF-04 | T019, T032, T033 |
| RF-05 | T015, T016, T032, T033 |
| RF-06 | T001, T002, T017, T018, T021, T032, T033 |
| RF-07 | T004, T007, T009, T014, T016, T019, T032, T033 |
| RF-08 | T019, T020, T021, T032, T033 |
| RF-09 | T003, T032, T033 |
| RF-10 | T023, T024, T025, T026, T027, T028, T029, T030 |
| RF-11 | T031, T032, T033 |
| RF-12 | T002, T003, T018, T019, T032, T033 |
| RF-13 | T001, T006, T008, T010, T012, T013, T015, T017 |
| RF-14 | T004, T032, T033 |
| RNF-01 | T035 |
| RNF-02 | T035 |
| RNF-03 | T035 |
| RNF-04 | T035 |
| RNF-05 | T036 |
| RNF-06 | T005, T022, T036 |

## Convergence

> Seção **append-only**, escrita por `/bu:converge`. Cada rodada acrescenta um bloco;
> nada é reescrito.

### Rodada 1 — 2026-09-02

| Requisito | Estado | Evidência |
|---|---|---|
| RF-01 | realizado | `app/adapters/presenters/home/home-page.component.ts:17` — "construímos" e "código"; a descrição para buscadores em `:30`. Cenário RF-01 passa |
| RF-02 | realizado | `app/adapters/presenters/catalog/catalog-page.component.ts:35` e `:36` — "critério" e "restrição"; descrição em `:66`. Cenário RF-02 passa |
| RF-03 | realizado | `app/adapters/presenters/project/project-page.component.ts:26` — "Repositórios"; ligação e título de ausência em `:22` e `:51`. Cenário RF-03 passa |
| RF-04 | realizado | `app/adapters/presenters/community/community-page.component.ts:33` e outros dezenove trechos — parágrafos, seis títulos de seção, quatro legendas. Cenário RF-04 passa, e confere a descrição de cada canal contra o domínio |
| RF-05 | realizado | `app/adapters/presenters/error/not-found-page.component.ts:13` e `:23`. Cenário RF-05 passa |
| RF-06 | realizado | `app/adapters/presenters/layout/site-header.component.ts:13` — "Pular para o conteúdo"; `app/core/domain/constants/organization_constants.ts:52` — "Organização no GitHub". Cenário RF-06 passa |
| RF-07 | realizado | Título e descrição corrigidos nas cinco chamadas ao `seo_tool`. Cenário RF-07 confere título e descrição da página da comunidade |
| RF-08 | realizado | As quatro descrições alternativas da página da comunidade. Cenário RF-08 exige toda imagem com descrição preenchida e nenhuma com a forma errada |
| RF-09 | realizado | `app/data/curation.json:13` e os outros dois resumos. Cenário RF-09 confere o texto da página contra o arquivo de curadoria |
| RF-10 | realizado, sem alteração | Conferido por duas varreduras independentes — dicionário de formas que exigem diacrítico, e varredura morfológica por sufixo — sobre `README.md`, `CLAUDE.md`, `.specify/project.md` e os 33 documentos de `specs/`, ignorando bloco de código e trecho entre crases. **Zero erros**: as 217 ocorrências da primeira medição eram forma verbal correta sem acento ("pratica", "referencia", "anuncia"), identificador, ou citação do próprio defeito. A spec foi corrigida para registrar isso |
| RF-11 | realizado | `app/tests/bdd/support/diacritics.ts` e o esquema de cenário com 16 pares. Removidos os diacríticos, cada texto novo é idêntico ao publicado antes |
| RF-12 | realizado | `href="#conteudo"`, `imagens/comunidade/*.webp`, os `id` de seção, os `slug` da curadoria e as rotas seguem em ASCII. Cenário RF-12 afirma sobre as rotas declaradas e sobre toda ligação interna da página |
| RF-13 | realizado | 16 asserções corrigidas: 13 em 7 arquivos de teste unitário, e 3 pontos em `catalog_steps.ts` e `site_steps.ts`. Cinco delas não estavam previstas no plano — ver Excesso e desvios |
| RF-14 | realizado | `app/index.html:2` declara `lang="pt-BR"`. Cenário RF-14 passa |
| RNF-01 a RNF-04 | realizado | `make audit` verde sobre as cinco páginas: assertivas do Lighthouse processadas sem reprovação, `check_links.sh` ok em RNF-06 e RNF-10 |
| RNF-05 | realizado | Todos os arquivos alterados em UTF-8 válido. Um byte NUL cru em `catalog_steps.ts` virou a sequência de escape equivalente — ver Excesso e desvios |
| RNF-06 | realizado | `make validate` encerrou com código 0, o que inclui o portão de cobertura de 90% |

**`make validate`**: código de saída **0**. 64 arquivos de teste unitário; 8 de integração com 40
testes; **117 cenários e 646 passos** de BDD, todos passando — 27 deles novos (11 cenários e as
16 linhas do esquema). O aviso de orçamento do pacote inicial (256,19 kB contra 250 kB) é
anterior a esta feature e não reprova: o limite de erro é 300 kB.

**Excesso e desvios**

1. **Cinco asserções além das previstas.** O plano mapeou 3 citações de texto de tela em
   `catalog_steps.ts`; a execução do BDD revelou mais cinco, em `catalog_steps.ts` e
   `site_steps.ts`, incluindo duas expressões regulares. Corrigidas pelo mesmo motivo das
   outras: a asserção cita o texto que a tela exibe, e RF-13 manda mantê-la verdadeira.
2. **Um byte NUL cru em `app/tests/bdd/steps/browser/catalog_steps.ts`**, anterior a esta
   feature, escrito como caractere literal dentro de uma string. Fazia toda ferramenta tratar o
   arquivo como binário. Trocado pela sequência de escape de mesmo valor, sem mudar
   comportamento. Entra por RNF-05, que exige UTF-8 válido em arquivo alterado, mas é correção
   de defeito preexistente e fica registrada como tal.
3. **Critérios de aceite refinados para a forma executável.** O critério de RF-07 afirmava sobre
   três palavras que não levam acento, e não verificaria nada; passou a afirmar sobre o título e
   a descrição da página da comunidade. O de RF-11 virou esquema de cenário com a tabela de
   pares. Nenhum critério passou a afirmar menos do que afirmava.
4. **Nada fora de escopo foi corrigido.** Comentário de código, nome de teste, comentário do
   `Makefile`, do `.gitignore` e dos workflows seguem sem acento, como o esclarecimento 3
   determinou. Nenhum alvo novo foi criado no `Makefile`.

Veredito: **convergido**
Tarefas acrescentadas: nenhuma
