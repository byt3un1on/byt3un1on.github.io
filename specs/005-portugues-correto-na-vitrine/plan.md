# Plano de implementação — Português correto na vitrine

> Descreve **como**. Deriva da spec e da constituição; não introduz requisito novo.

## Decisões técnicas

| Decisão | Escolha | Alternativas descartadas | Por quê |
|---|---|---|---|
| Como aplicar a correção | Edição arquivo a arquivo, lendo cada trecho antes de trocar | Substituição global por dicionário (`sed`, script de troca em massa) | O mesmo `organizacao` aparece em prosa e em `apresentacao_da_oficina.feature`; a mesma `versao` aparece em frase e em `pipeline version`. Nenhuma troca cega distingue os dois, e RF-12 proíbe errar essa distinção. O volume — 109 ocorrências em tela — cabe em edição revisada, e é a leitura de cada trecho que separa o erro real da forma verbal correta sem acento |
| Fronteira do que é "tela" dentro de um `.ts` | Só o **literal de texto** que chega ao navegador: template do componente, título e descrição passados ao `seo_tool`, rótulo em `constants`. Comentário, docstring e identificador não são tocados | Tratar o arquivo inteiro como dentro ou fora do escopo | O esclarecimento 3 separa por **destino do texto**, não por extensão de arquivo. Um componente carrega as duas coisas: a frase que o visitante lê e o comentário que só o mantenedor lê |
| O que fazer com os testes | Alterar **apenas** a asserção que cita literalmente um texto de tela — 13 pontos em 7 arquivos de teste unitário e 3 em um arquivo de passo | Corrigir todo o português dos testes; ou não tocar em teste algum | Não tocar quebra a suíte no instante em que a tela muda: `getByRole('link', { name: 'Ver o repositorio' })` deixa de encontrar o elemento. Corrigir tudo invade o escopo que o esclarecimento 3 fechou |
| Como provar RF-11 (só a grafia mudou) | Cenário com tabela de pares *(texto publicado antes, texto publicado agora)*; o passo remove os diacríticos do novo e exige igualdade ao antigo | Comparar contra um instantâneo do HTML anterior; revisão humana do diff | A tabela é o registro do que mudou, legível na própria spec executável, e falha se alguém reescrever a frase em vez de acentuá-la. Instantâneo de HTML mediria também estilo e marcação, que não são o assunto |
| Onde mora a remoção de diacríticos | Função privada do arquivo de passos, em `app/tests/bdd/support/` | Utilitário em `app/infra/tools/` | Nenhum código de produção precisa dela. Criar ferramenta de produção sem consumidor viola YAGNI, e o esclarecimento 2 já recusou verificação automática de ortografia no projeto |
| Escopo em `specs/` | Corrigir a prosa das features 001 a 005, preservando intocado tudo dentro de bloco de código, caminho de arquivo, identificador e citação da forma errada | Congelar as features fechadas; corrigir tudo, inclusive blocos de código | O esclarecimento 3 põe Markdown no escopo sem exceção por data. Bloco de código e caminho são justamente o que RF-12 protege |

## Padrões de projeto aplicados

| Padrão | Onde | Problema que resolve | Custo aceito |
|---|---|---|---|
| — | — | — | — |

Nenhum padrão GoF é aplicado, e a ausência é deliberada. A feature não introduz colaboração
nova entre objetos: ela corrige o conteúdo de literais e de prosa já existentes. Padrão
introduzido aqui seria antecipação pura, contra o Princípio 4.

**Considerados e recusados:**

- **Strategy** para escolher a forma correta por idioma — recusado: a vitrine é monolíngue por
  decisão registrada em Fora de escopo, e a segunda estratégia nunca existiria.
- **Template Method** para uma varredura de texto reutilizável entre passos — recusado: o
  esclarecimento 2 recusou a varredura; sobra um único passo, e abstrair um caso é DRY mal
  aplicado.

## Arquivos a criar ou alterar

Caminhos completos, respeitando as camadas de `app/`. Cada arquivo de produção lista o
arquivo de teste espelhado.

### Tela — literais que o visitante lê

| Camada | Arquivo | Ação | Teste espelhado |
|---|---|---|---|
| adapters/presenters | `app/adapters/presenters/home/home-page.component.ts` | alterar | `app/tests/unit/adapters/presenters/home/home-page.component.test.ts` |
| adapters/presenters | `app/adapters/presenters/catalog/catalog-page.component.ts` | alterar | `app/tests/unit/adapters/presenters/catalog/catalog-page.component.test.ts` |
| adapters/presenters | `app/adapters/presenters/catalog/project-card.component.ts` | alterar | `app/tests/unit/adapters/presenters/catalog/project-card.component.test.ts` |
| adapters/presenters | `app/adapters/presenters/catalog/technology-filter.component.ts` | verificar | `app/tests/unit/adapters/presenters/catalog/technology-filter.component.test.ts` |
| adapters/presenters | `app/adapters/presenters/project/project-page.component.ts` | alterar | `app/tests/unit/adapters/presenters/project/project-page.component.test.ts` |
| adapters/presenters | `app/adapters/presenters/error/not-found-page.component.ts` | alterar | `app/tests/unit/adapters/presenters/error/not-found-page.component.test.ts` |
| adapters/presenters | `app/adapters/presenters/layout/site-header.component.ts` | alterar | `app/tests/unit/adapters/presenters/layout/site-header.component.test.ts` |
| adapters/presenters | `app/adapters/presenters/layout/site-footer.component.ts` | verificar | `app/tests/unit/adapters/presenters/layout/site-footer.component.test.ts` |
| adapters/presenters | `app/adapters/presenters/community/community-page.component.ts` | alterar | `app/tests/unit/adapters/presenters/community/community-page.component.test.ts` |
| core/domain | `app/core/domain/constants/organization_constants.ts` | alterar | `app/tests/unit/core/domain/constants/organization_constants.test.ts` |
| dados | `app/data/curation.json` | alterar | `app/tests/unit/core/application/catalog/generate_catalog_use_case.test.ts` |
| raiz da aplicação | `app/index.html` | verificar | — (documento de entrada, sem regra; coberto por RF-14 no BDD) |

### Testes que citam texto de tela

| Camada | Arquivo | Ação | Teste espelhado |
|---|---|---|---|
| tests/unit | `app/tests/unit/adapters/presenters/catalog/catalog-page.component.test.ts` | alterar | — |
| tests/unit | `app/tests/unit/adapters/presenters/catalog/project-card.component.test.ts` | alterar | — |
| tests/unit | `app/tests/unit/adapters/presenters/error/not-found-page.component.test.ts` | alterar | — |
| tests/unit | `app/tests/unit/adapters/presenters/project/project-page.component.test.ts` | alterar | — |
| tests/unit | `app/tests/unit/adapters/presenters/home/home-page.component.test.ts` | alterar | — |
| tests/unit | `app/tests/unit/adapters/presenters/layout/site-header.component.test.ts` | alterar | — |
| tests/unit | `app/tests/unit/adapters/presenters/layout/site-footer.component.test.ts` | alterar | — |
| tests/bdd | `app/tests/bdd/steps/browser/catalog_steps.ts` | alterar | — |

### Cenários de aceite

| Camada | Arquivo | Ação | Teste espelhado |
|---|---|---|---|
| tests/bdd | `app/tests/bdd/features/portugues_correto_na_vitrine.feature` | criar | — |
| tests/bdd | `app/tests/bdd/steps/language/language_steps.ts` | criar | — |
| tests/bdd | `app/tests/bdd/support/diacritics.ts` | criar | — |

### Prosa em Markdown

| Camada | Arquivo | Ação | Teste espelhado |
|---|---|---|---|
| raiz | `README.md` | alterar | — |
| raiz | `CLAUDE.md` | verificar | — |
| processo | `specs/001-vitrine-de-projetos-da-byte-union/**/*.md` | alterar | — |
| processo | `specs/002-identidade-visual-da-vitrine/**/*.md` | alterar | — |
| processo | `specs/003-esteira-de-entrega-continua/**/*.md` | alterar | — |
| processo | `specs/004-discord-na-vitrine/**/*.md` | alterar | — |
| processo | `specs/005-portugues-correto-na-vitrine/**/*.md` | alterar | — |
| processo | `.specify/project.md` | alterar | — |

`.specify/memory/constitution.md` fica de fora: é gerada do template do plugin a cada execução,
e a correção seria desfeita na geração seguinte. Não há `docs/` neste repositório.

Dois componentes aparecem como **verificar** e não como **alterar**: o filtro de tecnologia
("Restringir por tecnologia", "Todas") e o rodapé ("Mantido por") já estão corretos no texto
que exibem — o que está errado neles é comentário, que o esclarecimento 3 deixou de fora.

## Contrato entre camadas

Nenhum contrato muda. As dependências continuam apontando para dentro, e nenhuma assinatura
de função, tipo ou interface é alterada — o que muda é o **valor** de literais de texto e o
conteúdo de documentos.

Um ponto merece registro: `organization_constants.ts` (`core/domain`) guarda o rótulo que o
rodapé (`adapters/presenters`) exibe. Corrigir "Organizacao no GitHub" para "Organização no
GitHub" é edição de dado no domínio, e o adapter continua apenas lendo — a direção da
dependência não se inverte.

Os passos novos de BDD dirigem o navegador contra o sítio já construído, como os demais passos
de `tests/bdd/steps/browser/`, e não importam código de produção além das rotas declaradas.

## Dependências externas

| Dependência | Versão | Justificativa | Simulada nos testes por |
|---|---|---|---|
| — | — | Nenhuma dependência nova. `String.prototype.normalize('NFD')` do próprio ECMAScript remove os diacríticos exigidos por RF-11 | — |

## Impacto no contrato de operação

**Nenhum.** Sem alvo novo no `Makefile`, sem serviço novo no compose, sem variável de ambiente
nova. O esclarecimento 2 recusou explicitamente a verificação automática de ortografia, então
a cadeia `make validate` permanece com os mesmos sete passos.

## Riscos

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Acentuar por engano um identificador, caminho de arquivo ou rota, quebrando a construção | média | Edição manual em vez de troca em massa; cenário de RF-12 afirma que nenhuma rota e nenhum `slug` carrega acento; `make build` e a suíte inteira reprovam antes da entrega |
| Acentuar dentro de bloco de código nos documentos de `specs/`, criando exemplo que não roda | média | Regra explícita: em Markdown, só a prosa muda; bloco cercado por crases, caminho de arquivo e identificador entre crases ficam intactos. Revisão arquivo a arquivo |
| Reescrever a frase em vez de acentuá-la, mudando o que a vitrine afirma | baixa | RF-11 tem cenário executável: removidos os diacríticos, o texto novo tem de ser idêntico ao anterior |
| A suíte quebrar em massa porque a asserção cita o texto antigo | alta | Já mapeado: 13 asserções em 7 arquivos de teste unitário e 3 em `catalog_steps.ts`. A tarefa que altera a tela altera a asserção no mesmo passo |
| O peso da página crescer com os acentos em UTF-8 e estourar o teto de 180 kB | baixa | Cada acento custa 1 byte a mais; 109 ocorrências somam menos de 0,2 kB sobre os 159,6 kB medidos. `make audit` mede e reprova se errar |
| Corrigir documento de feature já entregue apagar o registro do que foi decidido | baixa | Só a grafia muda. Citação da forma errada — o defeito nomeado entre aspas — é preservada, inclusive nesta spec |
| A esteira reprovar por relatório de Lighthouse antigo no diretório | baixa | Já corrigido na feature 004: `audit-only` limpa os relatórios antes de medir |

## Conformidade com a constituição

| Princípio | Como este plano o respeita |
|---|---|
| Contrato de operação | Nenhuma ferramenta de linguagem é chamada direto. `make fmt`, `make lint`, `make test`, `make cover`, `make it`, `make bdd` e `make audit` seguem sendo a única via, e nenhum alvo novo é criado |
| Arquitetura limpa | Nenhum arquivo é criado fora de `app/`, salvo os documentos em Markdown, que não são código. `core/domain` continua sem importar `adapters` ou `infra`; a correção em `organization_constants.ts` é valor de dado, não dependência nova |
| Testes provam a entrega | Cada arquivo de produção alterado já tem teste espelhado, listado acima. Os cenários novos ficam em `app/tests/bdd/` com Gherkin `# language: pt`, em blocos Arrange/Act/Assert onde houver corpo de teste, e a cobertura permanece acima de 90% porque nenhuma linha executável é acrescentada ao código de produção |
| Simplicidade defensável | Nenhum padrão GoF, nenhuma dependência nova, nenhum utilitário de produção sem consumidor. A feature faz uma coisa — corrigir grafia — e recusou explicitamente a ferramenta de verificação que a tornaria maior |
| Idioma (6) | É a razão de ser da feature: o Princípio 6 manda escrever em português do Brasil, e este plano faz o texto cumprir a norma do idioma que já declarava |
| Publicação estática (7) | Nada muda no artefato além do conteúdo de texto. Continua HTML, CSS e JS estáticos, com toda rota prerenderizada e sem runtime de servidor |
| Catálogo deriva do GitHub (8) | Só o texto editorial da curadoria é corrigido, e ele já é o campo que o princípio autoriza como curadoria em arquivo de dados versionado. Nome, descrição e linguagem vindos da API do GitHub não são tocados |
| Acessibilidade e performance medidas (9) | RNF-01 a RNF-04 repetem os limiares do princípio, e `make audit` os verifica na cadeia do `make validate`. A correção tende a melhorar a leitura por sintetizador de voz, nunca a piorá-la |
| Autoria (5) | Nenhum artefato desta feature credita ferramenta de IA; o commit leva apenas o autor configurado no git |
