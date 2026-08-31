# Especificação — Vitrine de projetos da Byte Union

> Descreve **o quê** e **por quê**. Não descreve como implementar: sem nome de biblioteca,
> sem esquema de banco, sem assinatura de função.

## Problema

A Byte Union é uma oficina de projetos, e hoje ela não tem rosto público. Quem chega pela
organização no GitHub encontra uma lista crua de repositórios que **não explica nada**:

| Sinal | Estado medido em 2026-08-30 |
|---|---|
| Repositórios públicos, não arquivados | 12 |
| Sem descrição preenchida | 9 de 12 |
| Sem `README`, ou com `README` de conteúdo desprezível (≤ 31 bytes) | 4 de 12 |
| Sem `topics` declarados | 12 de 12 |
| Repositório git completamente vazio | 1 (`documentation-site`) |
| Estrelas somadas | 0 |
| Parados há mais de 6 meses | 5 |

O custo é direto: o trabalho existe, mas é ilegível para quem não o escreveu. Um visitante não
consegue responder em trinta segundos "o que essa gente faz e sabe fazer", e por isso não vira
nem contato, nem contribuidor, nem oportunidade. Não resolver mantém o esforço técnico já
investido rendendo zero em alcance — e o problema piora a cada repositório novo, porque a lista
cresce e a legibilidade cai.

## Objetivo

Um sítio público que apresenta a Byte Union como oficina de projetos e expõe seu portfólio de
forma legível a quem não conhece a organização, levando o visitante a um passo seguinte
explícito em direção aos autores.

Está pronto quando um visitante que nunca ouviu falar da Byte Union consegue, sem sair do
sítio: entender a que a oficina se propõe; percorrer os projetos e entender o que cada um faz;
abrir o repositório do que lhe interessou; e saber como falar com os autores.

## Fora de escopo

- **Publicar conteúdo dos projetos**: documentação técnica, tutoriais, blog, changelog ou
  qualquer texto de projeto que deva viver no repositório de origem.
- **Área autenticada**: login, painel de administração, edição de conteúdo pela interface.
- **Formulário que envie dados**: qualquer captura de dados do visitante processada por
  servidor. O contato se dá por canal externo já existente.
- **Exposição de repositório privado ou arquivado** da organização.
- **Perfis pessoais completos** dos autores no formato de currículo, histórico de emprego ou
  portfólio individual paralelo ao da organização.
- **Internacionalização com troca de idioma pelo visitante** — ver `RNF-07` sobre o idioma único.
- **Corrigir os repositórios de origem**: preencher descrição, `topics` ou `README` faltantes
  nos 12 repositórios é trabalho de outro escopo, ainda que esta spec dependa do sintoma.
- **Métricas de audiência com rastreamento do visitante**.

## Personas e cenários de uso

**Contratante em avaliação.** Recebeu o link dos autores ou chegou por busca. Tem pouco tempo e
uma pergunta só: "essa gente entrega software de verdade?". Chega, varre a vitrine, procura
evidência de rigor e sai com uma impressão formada — ou com um canal de contato aberto.

**Pessoa técnica curiosa.** Achou um dos projetos e quer entender o resto. Quer saber o que a
oficina construiu, em que tecnologias, e se há algo que ela possa usar ou para o qual possa
contribuir. Vai clicar até o repositório.

**Par da indústria.** Conhece um dos autores e quer entender o trabalho conjunto. Interessa-se
mais pelo *como* — método, padrão, disciplina — do que pelo produto isolado.

**Os próprios autores.** Publicam um repositório novo e esperam que ele apareça na vitrine sem
retrabalho de interface, e que a curadoria (ordem, destaque, texto editorial) seja alterável em
um lugar só.

## Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | O sítio deve apresentar, na página inicial e acima da dobra, o que é a Byte Union e a que ela se propõe como oficina de projetos. | obrigatório |
| RF-02 | O sítio deve exibir um catálogo dos projetos da organização, cujos dados têm origem no catálogo de repositórios obtido da API do GitHub da organização. | obrigatório |
| RF-03 | Cada projeto no catálogo deve exibir, no mínimo: nome legível, resumo do que ele faz, tecnologia principal, sinal de atividade e ligação para o repositório de origem. | obrigatório |
| RF-04 | O sítio deve permitir curadoria do catálogo — ordem, destaque, resumo editorial e exclusão de itens — a partir de dado versionado no repositório, sem alteração de código de apresentação. | obrigatório |
| RF-05 | O catálogo deve excluir automaticamente repositórios privados, arquivados e sem nenhum commit. | obrigatório |
| RF-06 | Projeto composto por mais de um repositório deve poder ser exibido como um único item de catálogo, reunindo os repositórios que o compõem. | obrigatório |
| RF-07 | Cada projeto deve ter uma página própria, acessível por endereço estável e direto, com o detalhamento do projeto e as ligações para seus repositórios. | obrigatório |
| RF-08 | Quando um projeto tiver endereço publicado próprio, o sítio deve oferecer ligação para ele, distinta da ligação para o repositório. | obrigatório |
| RF-09 | O sítio deve identificar os autores da Byte Union e oferecer ao menos um canal de contato acionável. | obrigatório |
| RF-10 | O sítio deve permitir ao visitante restringir o catálogo por tecnologia principal. | desejável |
| RF-11 | O sítio deve responder a endereço inexistente com uma página de erro própria, que ofereça caminho de volta ao catálogo. | obrigatório |
| RF-12 | O sítio deve exibir estado explicável quando o catálogo estiver vazio ou o resultado da restrição não tiver itens — nunca uma área em branco sem explicação. | obrigatório |
| RF-13 | Todo endereço público do sítio deve responder a acesso direto, sem depender de navegação prévia a partir da página inicial. | obrigatório |

## Requisitos não funcionais

| ID | Requisito | Critério mensurável |
|---|---|---|
| RNF-01 | Qualidade auditável das páginas públicas | Lighthouse ≥ **90** em Performance, Acessibilidade, Boas Práticas e SEO, em perfil móvel, em toda página pública |
| RNF-02 | Acessibilidade | **0** violações de severidade crítica ou séria em WCAG 2.1 AA por verificação automática; **100%** dos elementos interativos alcançáveis e acionáveis por teclado |
| RNF-03 | Velocidade de primeira leitura | LCP ≤ **2,5 s** e CLS ≤ **0,1** na página inicial e na página de projeto, em perfil móvel com rede 4G simulada |
| RNF-04 | Peso da entrega inicial | ≤ **300 KB** transferidos e comprimidos para a primeira renderização da página inicial, excluída mídia abaixo da dobra |
| RNF-05 | Alcance de dispositivos | Sítio funcional e sem rolagem horizontal de **320 px** a **1920 px** de largura de viewport |
| RNF-06 | Indexação | **100%** das páginas públicas com título e descrição únicos e não vazios, e alcançáveis a partir da página inicial em no máximo **2** cliques |
| RNF-07 | Idioma | Sítio publicado em **1** idioma. [NECESSITA ESCLARECIMENTO: português do Brasil ou inglês? O Princípio 6 da constituição rege os artefatos do repositório, não o conteúdo voltado ao visitante; se o público-alvo inclui contratante ou par fora do Brasil, o idioma da vitrine é decisão de produto, não de convenção] |
| RNF-08 | Defasagem do catálogo | Um repositório novo ou alterado na organização aparece atualizado na vitrine em no máximo [NECESSITA ESCLARECIMENTO: qual defasagem é aceitável — minutos, 24 horas, ou só quando os autores publicarem uma nova versão do sítio? A resposta define se o catálogo é obtido no momento da publicação ou no momento da visita] |
| RNF-09 | Legibilidade tipográfica | Contraste mínimo de **4,5:1** para texto normal e **3:1** para texto grande, em todo o sítio |

## Critérios de aceite

Escritos em DADO / QUANDO / ENTÃO / MAS. Cada critério vira um cenário em
`app/tests/bdd/` sem tradução no meio.

```gherkin
# language: pt
Funcionalidade: Apresentação da oficina
  Para que um visitante que não conhece a Byte Union entenda a que ela se propõe
  Como visitante da vitrine
  Quero compreender a organização antes de olhar qualquer projeto

  Cenário: RF-01 — proposta visível na chegada
    Dado que eu nunca acessei a vitrine da Byte Union
    Quando eu abro a página inicial do sítio
    Então eu vejo o nome da organização e uma declaração do que ela faz como oficina de projetos
    E essa declaração está visível sem que eu role a página
    Mas não me é exigida nenhuma ação, cadastro ou aceite antes de ler
```

```gherkin
# language: pt
Funcionalidade: Catálogo de projetos
  Para que o trabalho da oficina seja legível a quem não o escreveu
  Como visitante da vitrine
  Quero percorrer os projetos e entender o que cada um faz

  Cenário: RF-02 — catálogo tem origem no GitHub da organização
    Dado que a organização possui repositórios públicos com commits
    Quando eu abro o catálogo de projetos
    Então cada projeto exibido corresponde a repositório existente da organização
    Mas nenhum projeto exibido tem origem em texto desvinculado de um repositório

  Cenário: RF-03 — ficha mínima de cada projeto
    Dado que o catálogo exibe o projeto "shared-claude-plugin"
    Quando eu observo o item desse projeto no catálogo
    Então eu vejo seu nome legível, um resumo do que ele faz, sua tecnologia principal e um sinal de sua atividade
    E eu vejo uma ligação que leva ao repositório de origem
    Mas eu não vejo campo obrigatório exibido em branco ou com texto de preenchimento

  Cenário: RF-05 — repositório privado não é exposto
    Dado que a organização possui o repositório privado "niche-scout"
    Quando eu abro o catálogo de projetos
    Então "niche-scout" não aparece em lugar nenhum do sítio
    Mas o catálogo continua exibindo os projetos públicos

  Cenário: RF-05 — repositório sem commit não é exposto
    Dado que a organização possui o repositório público "documentation-site" sem nenhum commit
    Quando eu abro o catálogo de projetos
    Então "documentation-site" não aparece no catálogo
    Mas nenhuma mensagem de erro é exibida ao visitante

  Cenário: RF-06 — sistema de vários repositórios é um projeto só
    Dado que os repositórios "shortsmaker-api", "shortsmaker-frontend", "shortsmaker-worker", "shortsmaker-infra" e "shortsmaker-docs" compõem um único sistema
    E que a curadoria declara esse agrupamento
    Quando eu abro o catálogo de projetos
    Então eu vejo um único item de catálogo para esse sistema
    E ao abri-lo eu vejo os cinco repositórios que o compõem, cada um com sua ligação
    Mas eu não vejo cinco itens separados no catálogo

  Cenário: RF-10 — restrição por tecnologia
    Dado que o catálogo exibe projetos de mais de uma tecnologia principal
    Quando eu restrinjo o catálogo à tecnologia "TypeScript"
    Então eu vejo apenas os projetos cuja tecnologia principal é "TypeScript"
    E o critério aplicado permanece visível para mim
    Mas a restrição não altera o endereço dos projetos nem impede que eu a remova

  Cenário: RF-12 — restrição sem resultado se explica
    Dado que o catálogo está exibindo projetos
    Quando eu aplico uma restrição que não corresponde a nenhum projeto
    Então eu vejo uma mensagem que explica que nenhum projeto atende ao critério
    E eu vejo como remover a restrição
    Mas eu não vejo uma área vazia sem explicação
```

```gherkin
# language: pt
Funcionalidade: Curadoria do catálogo
  Para que os autores controlem a narrativa sem mexer na interface
  Como autor da Byte Union
  Quero definir ordem, destaque, resumo e exclusão em um único lugar versionado

  Cenário: RF-04 — ordem e destaque vêm da curadoria
    Dado que a curadoria declara "shared-claude-plugin" como projeto em destaque e primeiro da ordem
    Quando eu abro o catálogo de projetos
    Então "shared-claude-plugin" aparece em primeiro lugar e sinalizado como destaque
    Mas nenhuma alteração de ordem ou destaque exigiu mudança em código de apresentação

  Cenário: RF-04 — resumo editorial supre a descrição ausente
    Dado que o repositório "templates-library" não tem descrição preenchida no GitHub
    E que a curadoria declara um resumo editorial para esse repositório
    Quando eu observo esse projeto no catálogo
    Então eu vejo o resumo editorial declarado pela curadoria
    Mas eu não vejo resumo vazio nem o nome do repositório repetido no lugar do resumo

  Cenário: RF-04 — exclusão declarada pela curadoria é respeitada
    Dado que a curadoria declara que um repositório público não deve aparecer na vitrine
    Quando eu abro o catálogo de projetos
    Então esse repositório não aparece em lugar nenhum do sítio
    Mas os demais repositórios públicos continuam sendo exibidos
```

```gherkin
# language: pt
Funcionalidade: Aprofundamento em um projeto
  Para que o visitante interessado chegue ao trabalho em si
  Como visitante da vitrine
  Quero abrir um projeto e alcançar seu repositório e seu endereço publicado

  Cenário: RF-07 — página própria por projeto
    Dado que estou no catálogo de projetos
    Quando eu abro o projeto "shared-claude-plugin"
    Então eu chego a uma página dedicada a esse projeto, com endereço próprio e estável
    E vejo o detalhamento do projeto e a ligação para o seu repositório
    Mas eu não sou levado para fora do sítio sem que eu tenha escolhido a ligação

  Cenário: RF-08 — endereço publicado é distinto do repositório
    Dado que o projeto exibido possui endereço publicado próprio além do repositório
    Quando eu abro a página desse projeto
    Então eu vejo duas ligações distintas e rotuladas: uma para o repositório e outra para o endereço publicado
    Mas as duas ligações não apontam para o mesmo destino

  Cenário: RF-13 — endereço direto funciona sem navegação prévia
    Dado que eu tenho o endereço da página de um projeto, recebido por terceiro
    Quando eu abro esse endereço diretamente, sem passar pela página inicial
    Então a página do projeto é exibida integralmente
    Mas eu não recebo erro de endereço não encontrado nem sou redirecionado à página inicial
```

```gherkin
# language: pt
Funcionalidade: Contato com os autores
  Para que o interesse gerado pela vitrine tenha para onde ir
  Como visitante convencido pelo portfólio
  Quero saber quem são os autores e como falar com eles

  Cenário: RF-09 — autores identificados e contato acionável
    Dado que estou em qualquer página pública do sítio
    Quando eu procuro por quem mantém a Byte Union
    Então eu encontro a identificação dos autores e ao menos um canal de contato acionável
    Mas não me é exigido preencher formulário no próprio sítio para estabelecer contato
```

```gherkin
# language: pt
Funcionalidade: Resiliência e bordas
  Para que a vitrine nunca exponha ao visitante uma falha crua
  Como visitante da vitrine
  Quero ser conduzido de volta quando algo não existe ou não carrega

  Cenário: RF-11 — endereço inexistente tem página própria
    Dado que eu abro um endereço que não corresponde a nenhuma página do sítio
    Quando a página é exibida
    Então eu vejo uma página de erro do próprio sítio, com a identidade da Byte Union
    E vejo uma ligação que me leva ao catálogo de projetos
    Mas eu não vejo página de erro genérica do serviço de hospedagem

  Cenário: RF-12 — catálogo indisponível se explica
    Dado que o catálogo de projetos não pôde ser obtido
    Quando eu abro a página do catálogo
    Então eu vejo uma mensagem que explica que os projetos não puderam ser carregados
    E vejo uma alternativa para alcançar a organização no GitHub
    Mas eu não vejo mensagem técnica de erro nem uma área em branco
```

```gherkin
# language: pt
Funcionalidade: Qualidade medida das páginas públicas
  Para que a vitrine seja utilizável por qualquer pessoa em qualquer dispositivo
  Como responsável pela qualidade da entrega
  Quero que acessibilidade e desempenho sejam verificados e não presumidos

  Cenário: RNF-01 e RNF-03 — limiares de qualidade em perfil móvel
    Dado que o sítio foi construído para publicação
    Quando a auditoria automática é executada sobre cada página pública em perfil móvel
    Então nenhuma das categorias Performance, Acessibilidade, Boas Práticas e SEO fica abaixo de 90
    E o LCP não excede 2,5 segundos e o CLS não excede 0,1
    Mas nenhuma página é dispensada da auditoria

  Cenário: RNF-02 — operação apenas por teclado
    Dado que estou em qualquer página pública do sítio
    Quando eu percorro a página usando somente o teclado
    Então eu alcanço e aciono todos os elementos interativos, com foco sempre visível
    Mas nenhum elemento retém o foco impedindo que eu prossiga

  Cenário: RNF-05 — alcance de dispositivos
    Dado que abro qualquer página pública em uma viewport de 320 px de largura
    Quando a página é renderizada
    Então todo o conteúdo permanece legível e utilizável
    Mas não há rolagem horizontal
```

## Ambiguidades

`/bu:clarify` só encerra quando esta lista está vazia.

1. **[NECESSITA ESCLARECIMENTO: qual é o público-alvo prioritário — contratante que compra
   serviço, empregador que contrata pessoas, ou par técnico que contribui e divulga?]** O pedido
   diz "atrair público alvo para nós (autores)", e os três públicos levam a vitrines diferentes:
   o primeiro quer prova de entrega e capacidade; o segundo quer competência individual
   atribuída a pessoas; o terceiro quer código e método. Esta é a ambiguidade de maior impacto —
   ela decide a página inicial, a ordem do catálogo e a chamada final.
2. **[NECESSITA ESCLARECIMENTO: quem são os autores, quantos são, e cada um deve ser
   identificado individualmente com nome, papel e ligação para seu perfil, ou a autoria é
   apresentada apenas como organização?]** `RF-09` depende disso.
3. **[NECESSITA ESCLARECIMENTO: qual é o canal de contato acionável — e-mail, perfil no GitHub,
   rede profissional, outro?]** `RF-09` exige ao menos um, e a seção *Fora de escopo* já
   descarta formulário processado por servidor.
4. **[NECESSITA ESCLARECIMENTO: dos 12 repositórios públicos, quais entram na vitrine?]** Nove
   não têm descrição, quatro não têm `README` útil, cinco estão parados há mais de seis meses e
   um está vazio. Expor tudo mostra volume e expõe abandono; expor pouco mostra rigor e parece
   vazio. É decisão editorial, não técnica.
5. **[NECESSITA ESCLARECIMENTO: os cinco repositórios `shortsmaker-*` formam um projeto só na
   vitrine, e qual o nome e o resumo desse projeto?]** `RF-06` prevê o agrupamento, mas não
   pode inventar como ele se chama nem o que faz — nenhum dos cinco repositórios tem descrição
   preenchida.
6. **[NECESSITA ESCLARECIMENTO: quem escreve os resumos editoriais dos projetos sem descrição, e
   até quando?]** `RF-04` prevê onde eles vivem; a spec não pode presumir que o texto existirá a
   tempo. Sem essa resposta, `RF-03` corre o risco de exibir ficha incompleta na publicação.
7. **[NECESSITA ESCLARECIMENTO: RNF-07 — o sítio é publicado em português do Brasil ou em
   inglês?]**
8. **[NECESSITA ESCLARECIMENTO: RNF-08 — qual defasagem do catálogo é aceitável?]** A resposta
   determina se o catálogo é fixado no momento da publicação ou obtido no momento da visita, e
   isso muda o comportamento observável em `RF-12` (catálogo indisponível só é cenário real na
   segunda hipótese).
9. **[NECESSITA ESCLARECIMENTO: a vitrine deve apresentar o método de trabalho da oficina —
   disciplina de spec, testes, arquitetura — como conteúdo próprio, ou o método só aparece
   implícito na qualidade dos projetos?]** A persona *par da indústria* se interessa mais pelo
   método que pelo produto, e isso pode justificar uma seção que hoje não existe em nenhum `RF`.
10. **[NECESSITA ESCLARECIMENTO: o sítio permanecerá em `byt3un1on.github.io` ou usará domínio
    próprio?]** Afeta `RF-07` (estabilidade dos endereços) e `RNF-06`.
11. **[NECESSITA ESCLARECIMENTO: como as métricas de sucesso abaixo serão medidas, dado que
    *Fora de escopo* descarta rastreamento do visitante?]** Sem uma resposta, as métricas são
    intenção declarada e não instrumento verificável.

## Métricas de sucesso

Sujeitas à ambiguidade 11 — como medir ainda não está decidido.

- **Alcance**: a vitrine passa a ser o endereço que os autores enviam ao apresentar o trabalho,
  em lugar da lista de repositórios do GitHub.
- **Conversão de atenção**: visitantes que abrem ao menos uma página de projeto a partir do
  catálogo — evidência de que o resumo foi suficiente para gerar interesse.
- **Conversão de destino**: visitantes que seguem de uma página de projeto para o repositório de
  origem, ou que acionam o canal de contato.
- **Custo de manutenção**: publicar um repositório novo na organização e vê-lo aparecer na
  vitrine com ficha completa exige alteração em **um único** arquivo de curadoria — nenhuma em
  código de apresentação.
- **Qualidade sustentada**: os limiares de `RNF-01` a `RNF-03` permanecem atendidos a cada
  publicação, sem exceção registrada.
