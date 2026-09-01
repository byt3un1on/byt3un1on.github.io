# Plano de implementação — Identidade visual da vitrine

> Descreve **como**. Deriva da spec e da constituição; não introduz requisito novo.

## Leitura de base

O código que esta feature toca já existe e foi lido: a folha única `app/styles.css` (113 linhas,
com fichas de cor claras e três utilitários de layout), os nove componentes de apresentação
(nenhum declara estilo próprio), `app/index.html`, e a configuração de build.

Quatro fatos medidos que mandam no plano, e que a implementação não precisa redescobrir:

| Fato | Valor medido em 2026-08-31 |
|---|---|
| `styles` do build | um único arquivo, `styles.css` |
| Pipeline de assets | **não existe** — não há `assets` declarado no build |
| Orçamento por estilo de componente | aviso em 4 kB, erro em **8 kB** |
| Asserção de peso total já existente | `total-byte-weight` em 307200 bytes |

A ausência de pipeline de assets é o que decide como a fonte entra: ela não pode ser um arquivo
solto copiado para o artefato, porque nada o copiaria.

## Decisões técnicas

| Decisão | Escolha | Alternativas descartadas | Por quê |
|---|---|---|---|
| Origem da fonte embutida | `@fontsource-variable/geist` 5.3.0, OFL-1.1, declarado no `styles` do build ao lado de `styles.css` | Baixar o `.woff2` para uma pasta de assets; `@import` de dentro do `styles.css`; fonte de CDN | Não há pipeline de assets, então arquivo solto não chega ao artefato. Declarar o CSS do pacote no `styles` do build é explícito, e o próprio build emite o `.woff2` e reescreve a `url()`. CDN está proibido pelo `RNF-06` |
| Qual fonte | **Geist Sans variável**, subconjunto latino | Inter, IBM Plex Sans, JetBrains Mono | **Medido, não estimado**: Geist 29,4 kB · Inter 48,3 kB · Plex Sans 45,7 kB · JetBrains Mono 40,4 kB. Geist custa 60% do Inter e sobra orçamento; é grotesca geométrica desenhada para texto técnico, que é o registro das três referências |
| Família do metadado | Pilha monoespaçada do dispositivo (`ui-monospace`, `SFMono-Regular`, `Menlo`, `Consolas`) | Embutir também a Geist Mono | O esclarecimento 4 autorizou **uma** fonte embutida. A segunda custaria mais 30 kB e levaria o acréscimo ao teto de 60 kB do `RNF-05`. A distinção sans/mono, que é o que o `RF-03` exige, já se obtém com a mono do sistema |
| Onde vivem as fichas | Propriedades personalizadas em `:root`, em `app/styles.css` | Constante TypeScript em `core/domain/constants` gerando CSS; arquivo `tokens.css` separado | O `RF-02` exige que o conjunto de cores seja **declarado e descobrível**: lendo `:root` em tempo de execução, o cenário de BDD enumera as fichas da própria página e não duplica a lista. Constante em TypeScript criaria duas fontes da verdade; arquivo separado criaria pasta de topo que a constituição não prevê |
| Divisão entre estilo global e estilo de componente | Global para ficha, reset, elemento e utilitário de layout; estilo de componente **apenas** em `project-card` e `technology-filter` | Tudo global, à moda das referências; estilo próprio nos nove componentes | Os dois componentes citados carregam aparência **dependente de estado** — destaque da curadoria e restrição aplicada —, e escopo de componente evita que esses seletores vazem. Os outros sete são elementos semânticos, e regra de elemento no global não se repete. Nove folhas de componente violariam o DRY do Princípio 4 |
| Como o destaque se marca | Fio de acento à esquerda do item, mais selo em mono maiúsculo | Fundo elevado no item inteiro; item maior; agrupar destacados no topo | Esclarecimento 6: sem alterar posição nem tamanho. Fio mais selo são dois canais — forma e texto —, e é isso que satisfaz "a distinção não pode depender apenas de texto" |
| Como a restrição aplicada se marca | Fundo de acento com texto escuro, mais fio inferior persistente | Só mudar a cor do botão; só negrito | O `RF-05` proíbe distinção só por cor. Fundo invertido muda a **forma** percebida do botão, e o fio inferior sobrevive a daltonismo e a modo de alto contraste |
| Estratégia de carregamento da fonte | `<link rel="preload">` no `index.html` mais `font-display: swap`, com face de recuo ajustada por `size-adjust` | `font-display: optional`; `block`; não pré-carregar | O `RNF-03` herdado da 001 exige CLS ≤ 0,1, e troca de fonte é a causa clássica de deslocamento. Pré-carga encurta a janela; `size-adjust` na face de recuo faz o texto ocupar a mesma caixa antes e depois. `optional` esconderia a fonte na primeira visita, que é justamente quando a identidade precisa aparecer |
| Onde o peso é medido | Asserção `total-byte-weight` de `app/lighthouserc.json`, apertada de 307200 para **129024** bytes | Script próprio medindo o `dist/`; passo de BDD somando respostas | A ferramenta já mede e já reprova; apertar o número é uma linha. Não se escreve o que a ferramenta faz. O teto novo é o `RNF-05` (126 kB) e continua abaixo do herdado de 300 kB. A linha de base por essa mesma métrica é **78,05 kB**, medida em 2026-08-31 — e não os 66,32 kB do pacote inicial, que é outra métrica |
| Tema | Uma paleta só, sem `prefers-color-scheme` | Segunda paleta clara | Esclarecimento 3. Também elimina metade das combinações a medir contra `RNF-01` e `RNF-02` |

### Paleta, com contraste medido sobre o fundo `#0e1011`

Nenhum destes números é estimativa: foram calculados pela fórmula de luminância relativa da
WCAG antes de a paleta entrar no plano.

| Ficha | Valor | Contraste sobre o fundo | Papel |
|---|---|---|---|
| `--surface` | `#0e1011` | — | fundo de toda página |
| `--surface-raised` | `#16191b` | 1,08:1 | elevação **decorativa**; nunca carrega significado sozinha |
| `--text` | `#e6eaea` | **15,73:1** | texto corrido e títulos |
| `--text-muted` | `#9aa3a5` | **7,41:1** | metadado — data, contagem, rótulo |
| `--accent` | `#3ddc84` | **10,69:1** | ligação, foco, destaque, restrição aplicada |
| `--line` | `#5a6163` | **3,02:1** | limite que **carrega significado** — atende ao `RNF-02` |
| `--hairline` | `#262b2d` | 1,33:1 | separação **decorativa**; nunca sozinha para informar |

Texto `--surface` sobre fundo `--accent`, que é o selo de destaque e o botão de restrição
aplicada: **10,69:1**.

### Escala tipográfica

Quatro níveis, e o `RF-03` exige que cada par se distinga por **mais de um** atributo — por isso
cada linha muda tamanho **e** ao menos um entre peso, entrelinha, espaçamento e família.

| Nível | Tamanho | Peso | Entrelinha | Espaçamento | Família |
|---|---|---|---|---|---|
| Título de página | `clamp(2.5rem, 1.6rem + 4vw, 4.5rem)` | 400 | 1,02 | `-0.03em` | Geist |
| Título de projeto | `clamp(1.25rem, 1.1rem + 0.7vw, 1.75rem)` | 500 | 1,15 | `-0.015em` | Geist |
| Texto corrido | `clamp(1rem, 0.97rem + 0.13vw, 1.125rem)` | 400 | 1,6 | `0` | Geist |
| Metadado | `0.8125rem` | 500 | 1,4 | `0.06em`, caixa alta | mono do dispositivo |

O título de página grande **e leve**, com espaçamento negativo e entrelinha de 1,0, é a lição
medida na Oxide — lá o `h1` tem peso 400, não 700.

## Padrões de projeto aplicados

| Padrão | Onde | Problema que resolve | Custo aceito |
|---|---|---|---|
| — | — | — | — |

**Nenhum padrão GoF se aplica a esta feature**, e registrar isso é a decisão. A entrega é uma
folha de estilo, duas folhas de componente e cenários que as medem: não há colaboração entre
objetos a estruturar, nem algoritmo a intercambiar, nem construção em etapas. Introduzir padrão
aqui seria cerimônia, e o Princípio 4 proíbe padrão por antecipação.

### Considerados e recusados

| Padrão | Por que foi recusado |
|---|---|
| Strategy para tema | Existe **um** tema, por decisão registrada no esclarecimento 3. Estratégia intercambiável para uma estratégia só é indireção sem problema presente |
| Decorator para variante de componente | O destaque e a restrição aplicada são **estado**, expresso por atributo que o componente já emite. Envolver o componente para trocar aparência acrescentaria camada onde um seletor resolve |
| Factory para paleta | Não há escolha de paleta em tempo de execução a resolver. Fábrica entraria para escolher entre implementações que não existem |
| Abstração de tema em `core/domain` | Cor não é regra de negócio. Levar ficha visual ao domínio inverteria a direção da dependência que o Princípio 2 fixa |

## Arquivos a criar ou alterar

Caminhos completos, respeitando as camadas de `app/`. Cada arquivo de produção lista o
arquivo de teste espelhado.

### Estilo e apresentação

| Camada | Arquivo | Ação | Teste espelhado | Requisitos |
|---|---|---|---|---|
| raiz de `app/` | `app/styles.css` | alterar | *ver nota abaixo* — verificado por `app/tests/bdd/features/identidade_visual_da_vitrine.feature` e `hierarquia_tipografica.feature` | RF-01, RF-02, RF-03, RF-06, RF-07, RF-09, RF-10, RNF-01, RNF-02, RNF-07, RNF-08 |
| adapters/presenters | `app/adapters/presenters/catalog/project-card.component.ts` | alterar — acrescenta `styles`, sem tocar no template nem na classe | `app/tests/unit/adapters/presenters/catalog/project-card.component.test.ts` | RF-04 |
| adapters/presenters | `app/adapters/presenters/catalog/technology-filter.component.ts` | alterar — acrescenta `styles`, sem tocar no template nem na classe | `app/tests/unit/adapters/presenters/catalog/technology-filter.component.test.ts` | RF-05 |
| raiz de `app/` | `app/index.html` | alterar — pré-carga da fonte | verificado por `qualidade_preservada_pela_mudanca_visual.feature` | RNF-05, RNF-06 |

> **Nota sobre teste espelhado de arquivo de estilo.** `app/styles.css` não é código executável e
> não aparece na instrumentação de cobertura, logo não tem teste unitário espelhado — pela mesma
> lógica que o Princípio 3 usa para isentar entrypoint e inicializador: a isenção vale para o
> arquivo que a cobertura não alcança, **não** para o arquivo sem verificação. Ele **é**
> verificado, e por medição: os cenários de BDD leem o estilo computado da página construída e
> reprovam a entrega quando a paleta, a hierarquia ou o foco saem do especificado.

### Configuração de build e de medição

| Camada | Arquivo | Ação | Teste espelhado | Requisitos |
|---|---|---|---|---|
| raiz de `app/` | `app/angular.json` | alterar — acrescenta o CSS da fonte ao `styles` do build | verificado por `qualidade_preservada_pela_mudanca_visual.feature` | RNF-05, RNF-06 |
| raiz de `app/` | `app/lighthouserc.json` | alterar — `total-byte-weight` de 307200 para 129024 | o próprio alvo `audit` | RNF-04, RNF-05 |
| raiz de `app/` | `app/package.json` | alterar — dependência da fonte | — | RNF-06 |

### Testes de BDD

| Camada | Arquivo | Ação | Requisitos |
|---|---|---|---|
| tests/bdd | `app/tests/bdd/features/identidade_visual_da_vitrine.feature` | criar | RF-01, RF-02, RF-08, RF-09 |
| tests/bdd | `app/tests/bdd/features/hierarquia_tipografica.feature` | criar | RF-03, RF-06 |
| tests/bdd | `app/tests/bdd/features/estado_visivel_dos_controles.feature` | criar | RF-04, RF-05, RF-07, RF-10 |
| tests/bdd | `app/tests/bdd/features/qualidade_preservada_pela_mudanca_visual.feature` | criar | RNF-01, RNF-02, RNF-05, RNF-06, RNF-08, RNF-09 |
| tests/bdd | `app/tests/bdd/steps/browser/appearance_steps.ts` | criar | RF-01 a RF-10, RNF-01, RNF-02, RNF-06, RNF-08, RNF-09 |
| tests/bdd | `app/tests/bdd/support/browser_driver.ts` | alterar | RNF-06, RNF-08 |
| tests/bdd | `app/tests/bdd/steps/process/audit_steps.ts` | alterar | RNF-05 |

Nenhum arquivo é criado em `core`, `adapters/clients`, `adapters/repositories`, `infra` ou
`interfaces`: esta feature não introduz regra, não fala com serviço externo e não injeta nada.
Não havendo dependência injetada nova, não há abstração nova a declarar em `app/interfaces/`.

## Contrato entre camadas

Esta feature **não altera contrato nenhum**. Nenhuma assinatura muda, nenhum caso de uso é
tocado, nenhum dado novo trafega. Os dois componentes alterados recebem apenas uma folha de
estilo escopada; o template e a classe permanecem como estão, e é por isso que os testes
unitários existentes continuam válidos sem edição.

O tratamento de erro também não muda, porque não há caminho de erro novo: estilo que não carrega
não produz exceção, produz página feia — e é exatamente essa a falha que os cenários de BDD
pegam, ao medir estilo computado em vez de presença de arquivo.

## Como cada requisito é medido

O `RF-02` merece detalhe, por ser o único que exige uma técnica não óbvia: o passo lê as
propriedades personalizadas declaradas em `:root`, monta o conjunto de cores válidas a partir
delas, percorre todo elemento de cada página pública e reprova qualquer cor computada — de
texto, fundo ou limite — que não pertença ao conjunto. É por isso que as fichas moram em `:root`
e não em constante de TypeScript: o conjunto declarado e o conjunto verificado são o mesmo, por
construção.

| Requisito | Como o cenário mede |
|---|---|
| RF-01 | Luminância relativa do fundo menor que a do texto, em toda rota pública |
| RF-02 | Conjunto lido de `:root` × toda cor computada da página |
| RF-03 | Estilo computado dos quatro níveis; cada par difere em ≥ 2 atributos |
| RF-04 | Estilo computado do item destacado × dos demais, mais posição e caixa idênticas |
| RF-05 | Estilo computado do botão com `aria-pressed=true` × dos demais, em ≥ 2 atributos |
| RF-06 | Distância entre caixas de itens vizinhos > espaçamento interno do item |
| RF-07 | Estilo computado do elemento antes e depois de receber foco por teclado |
| RF-08 | Cabeçalho, rodapé e fundo computados, comparados entre todas as rotas |
| RF-09 | Contagem de requisições de imagem e de `background-image` com `url()` |
| RF-10 | Nenhum elemento interativo com a aparência que o navegador daria por omissão |
| RNF-01, RNF-02 | Varredura `axe`, regras de contraste, já ligada ao alvo `bdd` |
| RNF-05 | Asserção `total-byte-weight` do relatório do Lighthouse |
| RNF-06 | Requisições registradas pelo driver cujo host difere do host do sítio |
| RNF-07 | Viewport de 320 px sem rolagem horizontal — cenário herdado da 001 |
| RNF-08 | Contexto com `reducedMotion: 'reduce'`; duração de animação e transição igual a zero |
| RNF-09 | Textos renderizados × catálogo gerado |

## Dependências externas

| Dependência | Versão | Justificativa | Simulada nos testes por |
|---|---|---|---|
| `@fontsource-variable/geist` | 5.3.0 | Auto-hospeda a Geist variável, licença OFL-1.1. Subconjunto latino medido em 29,4 kB. É o que permite a hierarquia tipográfica do `RF-03` sem violar o `RNF-06`, que proíbe domínio externo | Não é simulada: o arquivo entra no artefato e é medido nele. O cenário do `RNF-06` prova que nenhuma requisição sai do host do sítio |

Nenhuma outra dependência entra. Em especial, **nenhum framework de estilo** — o esclarecimento 1
fixou CSS próprio.

## Impacto no contrato de operação

**Nenhum alvo novo e nenhum serviço novo.** A cadeia `fmt → lint → test → cover → it → bdd →
audit` já cobre tudo que esta feature precisa provar.

Dois pontos de operação a registrar:

- `make install` passa a ser obrigatório depois desta feature, por causa da dependência da fonte.
  Quem trocar de branch sem instalar verá o build falhar ao resolver o `styles` — falha alta e
  clara, que é a preferível.
- O alvo `audit` fica mais estrito: `total-byte-weight` cai de 300 kB para 126 kB. Esse número é
  o `RNF-05`, e apertá-lo é o que impede que a fonte embutida abra caminho para peso futuro.

## Riscos

| Risco | Probabilidade | Mitigação |
|---|---|---|
| A troca de fonte desloca o texto e estoura o CLS ≤ 0,1 herdado da 001 | média | Pré-carga da fonte, `font-display: swap` e face de recuo ajustada por `size-adjust`. O Lighthouse já reprova CLS acima de 0,1, então o risco é detectado pelo portão, não em produção |
| A fonte embutida derruba a nota de Performance abaixo de 90 | baixa | 29,4 kB medidos, com o total em ~126 kB contra o teto de 300 kB. A asserção nova de `total-byte-weight` reprova antes de a nota cair |
| O cenário do `RF-02` reprova por cor que o navegador sintetiza, e não por cor declarada | **alta** | É o risco mais provável do plano: `transparent`, `rgba(0,0,0,0)`, cor herdada de `currentColor` e a cor de seleção de texto aparecem no estilo computado sem terem sido declaradas. O passo normaliza a cor, ignora o totalmente transparente e compara em espaço numérico, não por texto |
| O estilo de componente estoura o orçamento de 8 kB por componente | baixa | São dois componentes com regra de estado, na casa das centenas de bytes. O build reprova sozinho se estourar |
| A pilha monoespaçada do dispositivo varia demais entre sistemas e quebra a hierarquia do `RF-03` | média | O `RF-03` exige distinção por família, não uma família específica. Qualquer mono do sistema satisfaz, e o cenário mede a diferença de família, não o nome dela |
| O passo do `RF-10` reprova elemento cuja aparência padrão coincide com a declarada | baixa | O passo compara contra a aparência de um elemento igual renderizado sem a folha do sítio, e não contra uma lista de valores presumidos |

## Conformidade com a constituição

| Princípio | Como este plano o respeita |
|---|---|
| 1 — Contrato de operação | Nenhuma ferramenta de linguagem é invocada fora do `Makefile`. Nenhum alvo novo é preciso; a cadeia do `make validate` já prova a feature inteira, e o `audit` fica mais estrito, não contornado |
| 2 — Arquitetura limpa | Nada é criado em `core`, `infra` ou `interfaces`. A mudança vive em `adapters/presenters` e na folha global, que é a camada de apresentação. Cor e tipografia **não** descem ao domínio: a dependência continua apontando para dentro, e `core` segue sem conhecer ninguém |
| 3 — Testes provam a entrega | Dezesseis cenários em quatro arquivos de BDD, todos medindo estilo computado da página construída, e não presença de arquivo. Os testes unitários existentes dos dois componentes alterados continuam válidos porque template e classe não mudam. `styles.css` é isento de teste unitário pela mesma lógica de arquivo não instrumentável que o Princípio 3 já aplica — e continua verificado por medição |
| 4 — Simplicidade defensável | Nenhum framework de estilo, nenhuma dependência além da fonte, nenhum padrão GoF, uma paleta só, estilo de componente apenas nos dois que têm aparência dependente de estado. Cada recusa está registrada com o motivo |
| 5 — Autoria | Nenhum artefato desta feature credita ferramenta de IA. A licença OFL-1.1 da fonte é preservada como o upstream a distribui |
| 6 — Idioma | Spec, plano, tarefas e cenários em português do Brasil, Gherkin `# language: pt`. Identificadores de código em inglês, fichas de CSS em inglês |
| 7 — Publicação estática | A fonte é servida pelo próprio artefato, como arquivo estático emitido pelo build. Nenhum runtime, nenhuma reescrita de servidor, nenhum domínio externo — e o `RNF-06` mede exatamente isso |
| 8 — O catálogo deriva do GitHub | O `RNF-09` existe para provar que esta feature **não** tocou o conteúdo: cada nome, resumo, tecnologia e data exibido continua idêntico ao do catálogo. Nenhum texto de projeto passa a viver em código de apresentação |
| 9 — Acessibilidade e performance são medidas | Toda cor da paleta teve o contraste calculado antes de entrar no plano, e o menor deles, o limite significativo, está em 3,02:1 contra o mínimo de 3:1. A varredura `axe` e o Lighthouse continuam no `make validate`, e o teto de peso fica mais estrito |
