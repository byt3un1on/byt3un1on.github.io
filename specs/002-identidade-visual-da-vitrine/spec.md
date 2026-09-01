# Especificação — Identidade visual da vitrine

> Descreve **o quê** e **por quê**. Não descreve como implementar: sem nome de biblioteca,
> sem esquema de banco, sem assinatura de função.

## Problema

A vitrine funciona e passa em todos os limiares que a feature 001 mediu, mas **não se parece
com nada**. O estilo foi escrito para satisfazer requisito mensurável, nunca para decidir uma
aparência, e o resultado é indistinguível de HTML sem folha de estilo.

| Sinal | Estado medido em 2026-08-31 |
|---|---|
| Folha de estilo única do sítio | 113 linhas |
| CSS servido ao visitante | 1,3 kB. Pacote inicial estimado pelo build em 66,32 kB; peso total por página medido pela auditoria em **78,05 kB** |
| Componentes de apresentação que declaram estilo próprio | 0 de 9 |
| Ligações renderizadas com o azul sublinhado padrão do navegador | todas |
| Listas de tecnologia renderizadas com marcador de lista padrão | todas |
| Controle de restrição renderizado como moldura padrão de agrupamento | 1 |
| Classe emitida pelo cartão de projeto **sem nenhuma regra que a defina** | 1 (`destaque`) |
| Fundo | claro, com texto escuro |

Três consequências, em ordem de gravidade:

1. **O destaque da curadoria não produz efeito nenhum.** O cartão emite a marcação de destaque,
   e não existe regra que a estilize: o campo que a curadoria oferece para dar proeminência a um
   projeto é decorativo. A curadoria promete um controle que a vitrine não entrega.
2. **O estado da restrição por tecnologia é invisível.** O controle informa por atributo de
   acessibilidade qual tecnologia está aplicada, mas nada distingue visualmente o botão aplicado
   dos demais. Quem enxerga não recebe a informação que quem usa leitor de tela recebe.
3. **A vitrine não é reconhecível.** O público prioritário declarado na 001 é o par técnico, que
   julga por sinal de cuidado. Uma página sem decisão visual sinaliza abandono, e o custo cai
   exatamente sobre o objetivo da 001: converter visitante técnico em usuário e contribuidor.

O fundo claro também contraria a preferência declarada do autor, que quer tema escuro com texto
claro — o que hoje exige reescrever a paleta inteira, e não ajustá-la.

## Objetivo

A vitrine passa a ter identidade visual própria — escura, tipográfica e mínima — que a torne
reconhecível como da Byte Union em vez de genérica, **sem introduzir imagem** e **sem regredir
nenhum limiar que a 001 já conquistou**.

Está pronto quando um visitante técnico percebe, na primeira tela, que a página foi desenhada
por alguém; quando o destaque e a restrição aplicada são visíveis a quem enxerga; e quando toda
medição de acessibilidade, desempenho e peso continua verde.

As três referências que orientam o resultado são <https://oxide.computer/>, <https://zed.dev/> e
<https://thebigcb.com/>. Elas orientam o **resultado**, não a técnica: o que se pede é uma
síntese própria, não a cópia de nenhuma das três.

> Registro de aferição, para o plano não repetir o trabalho: a página do TheBigCB serve o corpo
> em `#4a4a4a` sobre `#141414`, que dá **2,08:1** — reprova o mínimo de 4,5:1 exigido aqui. A
> referência vale pela paleta escura, nunca por esse contraste.

## Fora de escopo

- **Alterar qualquer texto exibido ao visitante.** Nome, resumo, tecnologia e data vêm do
  catálogo e da curadoria; o Princípio 8 proíbe descrever projeto por texto em código de
  apresentação. Esta feature muda a forma, nunca o conteúdo.
- **Alterar a ordem, a seleção ou a composição dos projetos** — isso é curadoria, e é dado.
- **Acrescentar página, rota ou seção nova.** O conjunto de endereços públicos é o que a 001
  entregou.
- **Ilustração, fotografia, ícone rasterizado, mascote ou qualquer arquivo de imagem** — decisão
  do autor em 2026-08-31, ao escolher que a identidade venha de tipografia e ritmo.
- **Animação decorativa**, transição de entrada e efeito de rolagem.
- **Segundo idioma**, alternador de idioma e qualquer conteúdo fora do português do Brasil.
- **Alterar o pipeline de publicação**, o processo de montagem do catálogo ou o formato da
  curadoria.
- **Trocar o canal de contato pendente por um ativo** — o Discord segue pendente por decisão
  registrada na 001 e depende de o grupo existir.

## Personas e cenários de uso

**Pessoa técnica que chega pela primeira vez** *(persona prioritária)*. Decide em segundos se o
que vê merece atenção. Lê o enquadramento, percorre os projetos e julga o cuidado pela forma
antes de julgar o conteúdo pelo código.

**Pessoa que já conhece a organização e volta ao sítio.** Precisa reconhecê-lo como o mesmo
lugar, em qualquer página, sem procurar o nome no topo.

**Pessoa que navega só por teclado, ou com leitor de tela.** Precisa enxergar onde está o foco e
receber, por via visual, a mesma informação de estado que a via acessível já entrega.

**Pessoa que abre o sítio no celular, sob luz ruim.** Precisa que o texto permaneça legível e que
nada exija rolagem lateral.

**Os próprios autores.** Publicam um projeto novo e esperam que ele entre na vitrine com a mesma
aparência dos demais, e que o destaque da curadoria produza efeito real — sem tocar em estilo.

## Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | Toda página pública deve ser apresentada sobre fundo escuro com texto claro, para todo visitante, independentemente da preferência de tema declarada pelo sistema dele. | obrigatório |
| RF-02 | Toda cor empregada no sítio deve pertencer a um conjunto declarado e finito de cores; nenhuma página pública pode exibir cor fora desse conjunto. | obrigatório |
| RF-03 | O sítio deve estabelecer hierarquia tipográfica perceptível entre título de página, título de projeto, texto corrido e metadado, distinguindo-os por mais de um atributo tipográfico — e não apenas por tamanho. | obrigatório |
| RF-04 | Projeto declarado como destaque pela curadoria deve ser visualmente distinguível dos demais no catálogo, e a distinção não pode depender apenas de texto. O destaque não altera a posição nem o tamanho do item. | obrigatório |
| RF-05 | A restrição por tecnologia atualmente aplicada deve ser visualmente distinguível das não aplicadas, e a distinção não pode depender apenas de cor. | obrigatório |
| RF-06 | Os itens do catálogo devem ser perceptíveis como unidades separadas: o espaço que separa um item do seguinte deve ser maior que o espaço interno de cada item. | obrigatório |
| RF-07 | Todo elemento interativo deve exibir indicação de foco visível e distinta do seu estado normal quando alcançado por teclado. | obrigatório |
| RF-08 | O enquadramento do sítio — cabeçalho, rodapé e fundo — deve ser idêntico em todas as páginas públicas, para que qualquer uma seja reconhecível como do mesmo sítio. | obrigatório |
| RF-09 | A identidade visual não pode depender de arquivo de imagem: nenhuma página pública pode carregar imagem, ilustração ou ícone como recurso externo. | obrigatório |
| RF-10 | Nenhum elemento interativo pode permanecer com a aparência padrão do navegador. | obrigatório |

## Requisitos não funcionais

| ID | Requisito | Critério mensurável |
|---|---|---|
| RNF-01 | Contraste de texto | Mínimo de **4,5:1** para texto normal e **3:1** para texto grande, em **100%** do texto de toda página pública |
| RNF-02 | Contraste de elemento não textual | Mínimo de **3:1** entre a indicação de foco, o limite de controle interativo e o seu entorno imediato |
| RNF-03 | Acessibilidade verificada | **0** violações de severidade crítica ou séria de WCAG 2.1 AA por verificação automática, em toda página pública |
| RNF-04 | Qualidade auditável | Lighthouse ≥ **90** em Performance, Acessibilidade, Boas Práticas e SEO, em perfil móvel, em toda página pública |
| RNF-05 | Peso da entrega | Peso total transferido de no máximo **126 kB** por página pública, medido pelo `total-byte-weight` da auditoria — que é a métrica que o portão reprova. Equivale a **48 kB** de acréscimo sobre a linha de base de **78,05 kB** medida por essa mesma métrica em 2026-08-31, e permanece dentro do teto de **300 kB** herdado da 001 |
| RNF-06 | Autossuficiência do artefato | **0** requisição a domínio externo ao sítio durante a visita, incluindo fonte, folha de estilo e ícone |
| RNF-07 | Alcance de dispositivos | Sítio legível e sem rolagem horizontal de **320 px** a **1920 px** de largura de viewport |
| RNF-08 | Preferência por menos movimento | **0** animação ou transição com duração perceptível quando o sistema do visitante sinaliza preferência por movimento reduzido |
| RNF-09 | Preservação do conteúdo | **100%** dos nomes, resumos, tecnologias e datas exibidos permanecem idênticos aos do catálogo, antes e depois desta feature |

> **RNF-03, RNF-04 e RNF-07 já são guardados pela suíte da 001** — os cenários *varredura
> automática de acessibilidade*, *limiares de qualidade em perfil móvel* e *alcance de
> dispositivos* continuam rodando e continuam obrigatórios. Eles reaparecem aqui como requisito
> porque esta feature é a que pode quebrá-los, mas não ganham cenário novo: duplicar o cenário
> duplicaria a medição, não a garantia. O `RNF-07` entrou nesta lista na análise de 2026-08-31,
> que flagrou o cenário escrito aqui como cópia palavra por palavra do da 001.

## Critérios de aceite

Escritos em DADO / QUANDO / ENTÃO / MAS. Cada critério vira um cenário em
`app/tests/bdd/` sem tradução no meio.

```gherkin
# language: pt
Funcionalidade: Paleta e enquadramento da vitrine
  Para que a vitrine seja reconhecível como da Byte Union
  Como visitante que chega pela primeira vez
  Quero encontrar uma página que foi desenhada, e não uma página sem estilo

  Cenário: RF-01 — fundo escuro com texto claro
    Dado que eu abro qualquer página pública do sítio
    Quando a página termina de carregar
    Então o fundo é mais escuro que o texto que ele carrega
    Mas nenhuma página pública é servida com fundo claro

  Cenário: RF-02 — nenhuma cor fora do conjunto declarado
    Dado que o sítio declara um conjunto finito de cores
    Quando eu percorro todas as páginas públicas
    Então toda cor de texto, de fundo e de limite pertence a esse conjunto
    Mas nenhuma página introduz cor avulsa

  Cenário: RF-08 — o enquadramento é o mesmo em toda página
    Dado que eu percorro todas as páginas públicas do sítio
    Quando eu comparo o cabeçalho, o rodapé e o fundo de cada uma
    Então eles são idênticos entre todas as páginas
    Mas nenhuma página pública aparece com enquadramento próprio

  Cenário: RF-09 — a identidade não depende de imagem
    Dado que eu percorro todas as páginas públicas do sítio
    Quando a página termina de carregar
    Então nenhuma imagem, ilustração ou ícone é carregada como recurso
    Mas o sítio continua tendo aparência própria
```

```gherkin
# language: pt
Funcionalidade: Hierarquia tipográfica
  Para que o visitante saiba onde olhar primeiro
  Como pessoa técnica percorrendo o catálogo
  Quero distinguir título, texto e metadado sem precisar ler tudo

  Cenário: RF-03 — os quatro níveis se distinguem
    Dado que eu abro o catálogo de projetos
    Quando eu comparo o título da página, o título de um projeto, o texto corrido e o metadado
    Então cada nível se distingue do seguinte por mais de um atributo tipográfico
    Mas nenhum par de níveis se distingue apenas pelo tamanho da letra

  Cenário: RF-06 — os itens do catálogo se leem como unidades
    Dado que o catálogo exibe mais de um projeto
    Quando eu observo o espaço entre os itens
    Então o espaço que separa um item do seguinte é maior que o espaço interno do item
    Mas nenhum item se confunde visualmente com o item vizinho
```

```gherkin
# language: pt
Funcionalidade: Estado visível dos controles
  Para que quem enxerga receba a mesma informação que a via acessível já entrega
  Como visitante que usa o catálogo
  Quero ver o que está destacado, o que está aplicado e onde está o meu foco

  Cenário: RF-04 — o destaque da curadoria produz efeito visível
    Dado que a curadoria declara um projeto como destaque
    Quando eu observo o catálogo de projetos
    Então o item desse projeto se distingue visualmente dos demais
    E a sua posição e o seu tamanho permanecem os mesmos dos demais itens
    Mas a distinção não se reduz a uma palavra escrita no cartão

  Cenário: RF-05 — a restrição aplicada é visível
    Dado que eu restrinjo o catálogo a uma tecnologia
    Quando eu observo o controle de restrição
    Então o critério aplicado se distingue visualmente dos não aplicados
    Mas a distinção não se reduz à cor

  Cenário: RF-07 — o foco é sempre visível
    Dado que eu percorro qualquer página pública somente pelo teclado
    Quando o foco alcança cada elemento interativo
    Então a aparência do elemento focado difere da do elemento não focado
    Mas nenhum elemento interativo recebe foco sem indicação visível

  Cenário: RF-10 — nenhum controle com aparência padrão do navegador
    Dado que eu percorro todas as páginas públicas do sítio
    Quando eu observo os elementos interativos
    Então todos apresentam aparência declarada pelo sítio
    Mas nenhum aparece com a aparência que o navegador daria por omissão
```

```gherkin
# language: pt
Funcionalidade: Qualidade preservada pela mudança visual
  Para que a identidade não seja comprada com regressão
  Como responsável pela qualidade da entrega
  Quero que os limiares conquistados continuem medidos e verdes

  Cenário: RNF-01 e RNF-02 — contraste de texto e de elemento
    Dado que o sítio foi construído para publicação
    Quando a verificação automática de acessibilidade é executada
    Então nenhuma violação de contraste é encontrada
    Mas nenhuma página pública é dispensada da verificação

  Cenário: RNF-05 — o peso da entrega permanece dentro do orçamento
    Dado que o sítio foi construído para publicação
    Quando o peso da entrega inicial é medido
    Então o peso total de nenhuma página pública excede 126 kB
    Mas ele permanece abaixo do teto de 300 kB

  Cenário: RNF-06 — o artefato não depende de domínio externo
    Dado que eu abro qualquer página pública do sítio
    Quando a página termina de carregar
    Então nenhuma requisição foi feita a domínio externo ao sítio
    Mas todos os recursos de que a página precisa foram servidos

  Cenário: RNF-08 — movimento reduzido é respeitado
    Dado que o meu sistema sinaliza preferência por movimento reduzido
    Quando eu abro qualquer página pública do sítio
    Então nenhuma animação ou transição de duração perceptível é executada
    Mas o conteúdo continua chegando completo

  Cenário: RNF-09 — a mudança visual não alterou o conteúdo
    Dado que o catálogo declara os projetos publicados
    Quando eu percorro o catálogo e as páginas de projeto
    Então cada nome, resumo, tecnologia e data exibido é idêntico ao do catálogo
    Mas nenhum texto de projeto passou a ser escrito em código de apresentação
```

## Decisões esclarecidas

Nenhuma marca aberta. As cinco ambiguidades da rodada de especificação foram levadas ao autor em
2026-08-31 e respondidas por ele; nenhuma foi deduzida.

1. **Estilo próprio, sem framework.** O pedido dizia "escolher um framework de estilo adequado",
   e a resposta é que o requisito é o resultado, não a ferramenta: a vitrine usa CSS próprio, com
   as cores, a tipografia e o ritmo declarados como conjunto de fichas em um lugar único — que é
   como as três referências são feitas, e o que o Princípio 4 da constituição pede.
2. **Acento verde.** A mesma família que Oxide e TheBigCB usam, escolhida sabendo que aproxima a
   vitrine das referências; a originalidade vem da composição — paleta, escala tipográfica e
   ritmo —, não de fugir da cor.
3. **Escuro sempre.** O tema escuro é decisão de identidade e não preferência a negociar: todo
   visitante vê a mesma vitrine, mesmo quem declara preferir tema claro no sistema. Não há
   segunda paleta a declarar nem a medir.
4. **Fonte embutida no artefato.** A tipografia pode usar fonte servida pelo próprio sítio, para
   alcançar o controle que a hierarquia do `RF-03` exige. Servida pelo próprio sítio, nunca por
   domínio externo — o `RNF-06` continua valendo em zero requisição externa.
5. **Destaque marcado no lugar.** O item destacado recebe tratamento visual próprio sem mudar de
   posição e sem mudar de tamanho. É a única forma que não contradiz a 001, que tem teste
   garantindo que o destaque sinaliza sem reordenar.

Como consequência direta da decisão 4, o teto de peso do `RNF-05` subiu de 30 kB para 60 kB de
acréscimo — total de ~126 kB contra o teto herdado de 300 kB. O autor escolheu esse valor entre
30, 60 e 100 kB.

A implementação, em 2026-08-31, descobriu que os 66,32 kB citados na primeira redação eram a
estimativa de pacote inicial do build, e **não** a métrica que o portão reprova. Medido pelo
`total-byte-weight` da auditoria, o peso por página é de **78,05 kB**. O requisito foi reescrito
para nomear a métrica e fixar o teto absoluto de **126 kB** por página, que era a intenção do
autor e continua sendo — muda a redação, não a decisão.

## Esclarecimentos

| # | Pergunta | Resposta | Data |
|---|---|---|---|
| 1 | O pedido manda escolher um framework de estilo, mas as três referências são feitas de CSS próprio. Framework é exigência, ou o pedido aceita estilo próprio? | **CSS próprio com fichas.** Sem dependência nova; descartados Tailwind e biblioteca de componentes | 2026-08-31 |
| 2 | Qual família de cor de acento, sabendo que Oxide e TheBigCB usam verde? | **Verde**, a mesma família das referências; descartados âmbar e ciano | 2026-08-31 |
| 3 | Escuro sempre, ou claro quando o sistema do visitante declarar preferir claro? | **Escuro sempre** — decisão de identidade, paleta única a medir | 2026-08-31 |
| 4 | A tipografia pode embutir fonte no artefato, ou fica nas famílias do dispositivo? | **Fonte embutida**, servida pelo próprio sítio | 2026-08-31 |
| 5 | Com fonte embutida, o acréscimo de peso de 30 kB fica apertado. Qual teto vale? | **60 kB** de acréscimo, total ~126 kB; descartados 30 kB e 100 kB | 2026-08-31 |
| 6 | Como o destaque da curadoria se manifesta no catálogo? | **Marcação no lugar**, sem alterar posição nem tamanho; descartados item maior e agrupamento no topo | 2026-08-31 |

## Métricas de sucesso

Nenhuma delas depende de rastrear o visitante — a 001 proibiu instrumentação de rastreamento, e
esta feature não a reintroduz.

- **Zero elemento interativo com aparência padrão do navegador** nas páginas públicas, contra
  todos hoje.
- **Zero classe de estilo emitida sem regra que a defina**, contra uma hoje.
- **O destaque da curadoria produz efeito visual mensurável**, contra nenhum hoje.
- **Todos os limiares da 001 permanecem verdes**: Lighthouse ≥ 90 nas quatro categorias, zero
  violação crítica ou séria de acessibilidade, sem rolagem horizontal de 320 px a 1920 px.
- **O peso total de cada página permanece abaixo de 126 kB**, contra 78,05 kB hoje e um teto
  de 300 kB — ambos medidos pelo `total-byte-weight` da auditoria, que é a métrica do portão.
- **O autor reconhece a vitrine como da Byte Union** ao vê-la ao lado das três referências —
  aferição qualitativa, feita por ele, registrada na convergência.
