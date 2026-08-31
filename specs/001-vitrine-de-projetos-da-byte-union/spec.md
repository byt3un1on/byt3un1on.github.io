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

O custo é direto: o trabalho existe, mas é ilegível para quem não o escreveu. Uma pessoa
técnica não consegue responder em trinta segundos "o que essa gente construiu, e há aqui algo
que eu possa usar ou para o qual eu possa contribuir" — e por isso não vira nem usuário, nem
contribuidor, nem par. Não resolver mantém o esforço técnico já investido rendendo zero em
alcance, e o problema piora a cada repositório novo: a lista cresce e a legibilidade cai.

## Objetivo

Um sítio público que apresenta a Byte Union como oficina de projetos e expõe seu portfólio de
forma legível a quem não conhece a organização, levando o visitante técnico ao código e a um
canal de conversa com os autores.

O público prioritário é o **par técnico e a comunidade** — pessoas que usam, contribuem e
divulgam. Isso ordena as decisões da vitrine: o destaque vai para o que é reutilizável por
terceiros, o caminho mais curto de toda página leva ao repositório, e a chamada final convida a
usar e conversar, não a contratar.

Está pronto quando um visitante técnico que nunca ouviu falar da Byte Union consegue, sem sair
do sítio: entender a que a oficina se propõe; percorrer os projetos e entender o que cada um
faz; abrir o repositório do que lhe interessou; e saber onde conversar com os autores.

## Fora de escopo

- **Publicar conteúdo dos projetos**: documentação técnica, tutoriais, blog, changelog ou
  qualquer texto de projeto que deva viver no repositório de origem.
- **Expor o método de trabalho da oficina** — disciplina de spec, constituição, arquitetura,
  contrato de operação. O método é distribuído como plugin privado, instalado no ambiente do
  autor e fora dos projetos; a vitrine não o apresenta, não o explica e não expõe o repositório
  que o contém. Os artefatos que o método produz (`specs/`, `.specify/`) permanecem versionados
  normalmente nos repositórios — o que não se expõe é o plugin inteiro.
- **Área autenticada**: login, painel de administração, edição de conteúdo pela interface.
- **Formulário que envie dados**: qualquer captura de dados do visitante processada por
  servidor. O contato se dá por canais externos já existentes.
- **Exposição de repositório privado ou arquivado** da organização.
- **Perfis pessoais dos autores**: nome, papel, biografia, currículo ou ligação para perfil
  individual. A autoria é apresentada como organização — ver `RF-09`.
- **Segundo idioma e troca de idioma pelo visitante** — ver `RNF-07`.
- **Corrigir os repositórios de origem**: preencher descrição, `topics` ou `README` faltantes
  nos 12 repositórios é trabalho de outro escopo, ainda que esta spec dependa do sintoma.
- **Métricas de audiência com rastreamento do visitante**: nenhuma instrumentação de
  rastreamento é adicionada ao sítio — ver *Métricas de sucesso*.

## Personas e cenários de uso

**Pessoa técnica curiosa** *(persona prioritária)*. Achou um dos projetos e quer entender o
resto. Quer saber o que a oficina construiu, em que tecnologias, e se há algo que ela possa
usar ou para o qual possa contribuir. Vai clicar até o repositório, e julga pelo código.

**Par da indústria.** Conhece um dos autores e quer entender o trabalho conjunto. Interessa-se
pela substância técnica — que sistemas existem, quão completos são, como se dividem — e chega
a essa leitura pelos próprios projetos, já que a vitrine não fala do método.

**Contribuidor em potencial.** Encontrou algo reutilizável e quer saber se o projeto está vivo,
se aceita contribuição e onde perguntar antes de abrir uma issue.

**Os próprios autores.** Publicam um repositório novo e esperam decidir, em um lugar só, se e
como ele entra na vitrine — sem tocar em código de apresentação.

## Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | O sítio deve apresentar, na página inicial e acima da dobra, o que é a Byte Union e a que ela se propõe como oficina de projetos. | obrigatório |
| RF-02 | O sítio deve exibir um catálogo dos projetos da organização, cujos dados têm origem no catálogo de repositórios obtido da API do GitHub da organização. | obrigatório |
| RF-03 | Cada projeto no catálogo deve exibir, no mínimo: nome legível, resumo do que ele faz, tecnologia principal, sinal de atividade e ligação para o repositório de origem. | obrigatório |
| RF-04 | O catálogo deve ser de inclusão explícita: só aparece na vitrine o projeto declarado na curadoria, que é dado versionado no repositório e define ordem, destaque, resumo e composição, sem alteração de código de apresentação. | obrigatório |
| RF-05 | Entrada de curadoria sem resumo escrito é inválida e deve impedir a publicação, em vez de gerar projeto com ficha incompleta. | obrigatório |
| RF-06 | O catálogo deve excluir repositórios privados, arquivados e sem nenhum commit, ainda que a curadoria os declare. | obrigatório |
| RF-07 | Projeto composto por mais de um repositório deve ser exibido como um único item de catálogo, reunindo os repositórios que o compõem. | obrigatório |
| RF-08 | Cada projeto deve ter uma página própria, acessível por endereço estável e direto, com o detalhamento do projeto e as ligações para seus repositórios. | obrigatório |
| RF-09 | Quando um projeto tiver endereço publicado próprio, o sítio deve oferecer ligação para ele, distinta da ligação para o repositório. | obrigatório |
| RF-10 | O sítio deve apresentar a autoria como organização — sem identificar pessoas — e oferecer dois canais acionáveis: o perfil da organização no GitHub e o grupo da comunidade no Discord. | obrigatório |
| RF-11 | O sítio deve permitir ao visitante restringir o catálogo por tecnologia principal. | desejável |
| RF-12 | O sítio deve responder a endereço inexistente com uma página de erro própria, que ofereça caminho de volta ao catálogo. | obrigatório |
| RF-13 | O sítio deve exibir estado explicável quando a restrição aplicada pelo visitante não retornar itens — nunca uma área em branco sem explicação. | obrigatório |
| RF-14 | A publicação do sítio deve ser abortada, preservando no ar a versão anterior, quando o catálogo da organização não puder ser obtido integralmente. | obrigatório |
| RF-15 | Todo endereço público do sítio deve responder a acesso direto, sem depender de navegação prévia a partir da página inicial. | obrigatório |

## Requisitos não funcionais

| ID | Requisito | Critério mensurável |
|---|---|---|
| RNF-01 | Qualidade auditável das páginas públicas | Lighthouse ≥ **90** em Performance, Acessibilidade, Boas Práticas e SEO, em perfil móvel, em toda página pública |
| RNF-02 | Acessibilidade | **0** violações de severidade crítica ou séria em WCAG 2.1 AA por verificação automática; **100%** dos elementos interativos alcançáveis e acionáveis por teclado |
| RNF-03 | Velocidade de primeira leitura | LCP ≤ **2,5 s** e CLS ≤ **0,1** na página inicial e na página de projeto, em perfil móvel com rede 4G simulada |
| RNF-04 | Peso da entrega inicial | ≤ **300 KB** transferidos e comprimidos para a primeira renderização da página inicial, excluída mídia abaixo da dobra |
| RNF-05 | Alcance de dispositivos | Sítio funcional e sem rolagem horizontal de **320 px** a **1920 px** de largura de viewport |
| RNF-06 | Indexação | **100%** das páginas públicas com título e descrição únicos e não vazios, e alcançáveis a partir da página inicial em no máximo **2** cliques |
| RNF-07 | Idioma | Sítio publicado em **1** idioma: português do Brasil. **0** página pública com conteúdo voltado ao visitante em outro idioma |
| RNF-08 | Defasagem do catálogo | Alteração em repositório da organização reflete-se na vitrine em no máximo **24 h**, por publicação agendada. O visitante nunca aguarda obtenção de catálogo durante a visita: **0** requisição à API do GitHub feita pelo navegador do visitante |
| RNF-09 | Legibilidade tipográfica | Contraste mínimo de **4,5:1** para texto normal e **3:1** para texto grande, em todo o sítio |
| RNF-10 | Endereço de publicação | Sítio servido em `byt3un1on.github.io`. **100%** das ligações internas expressas de forma relativa à raiz do sítio, para que a adoção futura de domínio próprio não quebre nenhum endereço |

## Critérios de aceite

Escritos em DADO / QUANDO / ENTÃO / MAS. Cada critério vira um cenário em
`app/tests/bdd/` sem tradução no meio.

```gherkin
# language: pt
Funcionalidade: Apresentação da oficina
  Para que uma pessoa técnica que não conhece a Byte Union entenda a que ela se propõe
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
    Dado que o catálogo exibe um projeto declarado na curadoria
    Quando eu observo o item desse projeto no catálogo
    Então eu vejo seu nome legível, um resumo do que ele faz, sua tecnologia principal e um sinal de sua atividade
    E eu vejo uma ligação que leva ao repositório de origem
    Mas eu não vejo campo obrigatório exibido em branco ou com texto de preenchimento

  Cenário: RF-04 — repositório não declarado na curadoria não aparece
    Dado que a organização possui o repositório público "shared-claude-plugin"
    E que a curadoria não declara esse repositório
    Quando eu abro o catálogo de projetos
    Então "shared-claude-plugin" não aparece em lugar nenhum do sítio
    Mas os projetos declarados na curadoria continuam sendo exibidos

  Cenário: RF-06 — repositório privado não é exposto ainda que declarado
    Dado que a curadoria declara o repositório "niche-scout"
    E que "niche-scout" é privado na organização
    Quando o catálogo de projetos é montado
    Então "niche-scout" não aparece em lugar nenhum do sítio
    Mas os demais projetos declarados continuam sendo exibidos

  Cenário: RF-06 — repositório sem commit não é exposto ainda que declarado
    Dado que a curadoria declara o repositório "documentation-site"
    E que "documentation-site" não possui nenhum commit
    Quando o catálogo de projetos é montado
    Então "documentation-site" não aparece no catálogo
    Mas nenhuma mensagem de erro é exibida ao visitante

  Cenário: RF-07 — sistema de vários repositórios é um projeto só
    Dado que a curadoria declara um projeto composto pelos repositórios "shortsmaker-api", "shortsmaker-frontend", "shortsmaker-worker", "shortsmaker-infra" e "shortsmaker-docs"
    Quando eu abro o catálogo de projetos
    Então eu vejo um único item de catálogo para esse projeto
    E ao abri-lo eu vejo os cinco repositórios que o compõem, cada um com sua ligação
    Mas eu não vejo cinco itens separados no catálogo

  Cenário: RF-11 — restrição por tecnologia
    Dado que o catálogo exibe projetos de mais de uma tecnologia principal
    Quando eu restrinjo o catálogo à tecnologia "TypeScript"
    Então eu vejo apenas os projetos cuja tecnologia principal é "TypeScript"
    E o critério aplicado permanece visível para mim
    Mas a restrição não altera o endereço dos projetos nem impede que eu a remova

  Cenário: RF-13 — restrição sem resultado se explica
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
  Quero declarar em um único lugar versionado o que entra, em que ordem e com que texto

  Cenário: RF-04 — ordem e destaque vêm da curadoria
    Dado que a curadoria declara um projeto como destaque e primeiro da ordem
    Quando eu abro o catálogo de projetos
    Então esse projeto aparece em primeiro lugar e sinalizado como destaque
    Mas nenhuma alteração de ordem ou destaque exigiu mudança em código de apresentação

  Cenário: RF-04 — resumo editorial supre a descrição ausente
    Dado que o repositório "templates-library" não tem descrição preenchida no GitHub
    E que a curadoria declara um resumo para esse repositório
    Quando eu observo esse projeto no catálogo
    Então eu vejo o resumo declarado pela curadoria
    Mas eu não vejo resumo vazio nem o nome do repositório repetido no lugar do resumo

  Cenário: RF-05 — entrada sem resumo impede a publicação
    Dado que a curadoria declara um projeto sem resumo escrito
    Quando a publicação do sítio é executada
    Então a publicação falha indicando qual entrada de curadoria está sem resumo
    Mas nenhum projeto com ficha incompleta é publicado
```

```gherkin
# language: pt
Funcionalidade: Aprofundamento em um projeto
  Para que o visitante técnico chegue ao código em si
  Como visitante da vitrine
  Quero abrir um projeto e alcançar seus repositórios e seu endereço publicado

  Cenário: RF-08 — página própria por projeto
    Dado que estou no catálogo de projetos
    Quando eu abro um projeto do catálogo
    Então eu chego a uma página dedicada a esse projeto, com endereço próprio e estável
    E vejo o detalhamento do projeto e a ligação para o seu repositório
    Mas eu não sou levado para fora do sítio sem que eu tenha escolhido a ligação

  Cenário: RF-09 — endereço publicado é distinto do repositório
    Dado que o projeto exibido possui endereço publicado próprio além do repositório
    Quando eu abro a página desse projeto
    Então eu vejo duas ligações distintas e rotuladas: uma para o repositório e outra para o endereço publicado
    Mas as duas ligações não apontam para o mesmo destino

  Cenário: RF-15 — endereço direto funciona sem navegação prévia
    Dado que eu tenho o endereço da página de um projeto, recebido por terceiro
    Quando eu abro esse endereço diretamente, sem passar pela página inicial
    Então a página do projeto é exibida integralmente
    Mas eu não recebo erro de endereço não encontrado nem sou redirecionado à página inicial
```

```gherkin
# language: pt
Funcionalidade: Contato com a organização
  Para que o interesse gerado pela vitrine tenha para onde ir
  Como visitante convencido pelo portfólio
  Quero alcançar o código da organização e conversar com quem o mantém

  Cenário: RF-10 — autoria como organização e dois canais acionáveis
    Dado que estou em qualquer página pública do sítio
    Quando eu procuro por quem mantém a Byte Union
    Então eu encontro a autoria apresentada como organização
    E encontro uma ligação para o perfil da organização no GitHub e outra para o grupo da comunidade no Discord
    Mas eu não vejo nome, papel, biografia ou perfil individual de nenhum autor
```

```gherkin
# language: pt
Funcionalidade: Frescura e integridade do catálogo
  Para que a vitrine nunca publique um retrato incompleto da organização
  Como autor da Byte Union
  Quero que o catálogo seja obtido antes da publicação e que falha na obtenção impeça a troca

  Cenário: RF-14 — falha na obtenção não publica catálogo incompleto
    Dado que a versão atual do sítio está no ar
    Quando a publicação é executada e o catálogo da organização não pode ser obtido integralmente
    Então a publicação é abortada e informa a falha
    E a versão anterior do sítio permanece no ar, intacta
    Mas nenhuma versão com catálogo parcial ou vazio é publicada

  Cenário: RNF-08 — o visitante não espera pela rede
    Dado que eu abro qualquer página pública do sítio
    Quando a página termina de carregar
    Então todos os dados dos projetos já estão presentes
    Mas o meu navegador não realizou nenhuma requisição à API do GitHub
```

```gherkin
# language: pt
Funcionalidade: Resiliência e bordas
  Para que a vitrine nunca exponha ao visitante uma falha crua
  Como visitante da vitrine
  Quero ser conduzido de volta quando o endereço não existe

  Cenário: RF-12 — endereço inexistente tem página própria
    Dado que eu abro um endereço que não corresponde a nenhuma página do sítio
    Quando a página é exibida
    Então eu vejo uma página de erro do próprio sítio, com a identidade da Byte Union
    E vejo uma ligação que me leva ao catálogo de projetos
    Mas eu não vejo página de erro genérica do serviço de hospedagem
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

  Cenário: RNF-07 — idioma único
    Dado que percorro todas as páginas públicas do sítio
    Quando eu leio o conteúdo voltado ao visitante
    Então todo ele está em português do Brasil
    Mas não há alternador de idioma nem conteúdo em segundo idioma
```

## Ambiguidades

Nenhuma. As 11 marcas registradas na primeira versão desta spec foram respondidas pelo usuário
em 2026-08-30 e aplicadas nos requisitos acima — ver *Esclarecimentos*.

## Esclarecimentos

| # | Pergunta | Resposta | Data | Onde foi aplicada |
|---|---|---|---|---|
| 1 | Qual é o público-alvo prioritário — contratante, empregador ou par técnico? | **Par técnico e comunidade.** O destaque vai para o reutilizável, o caminho mais curto leva ao repositório, e a chamada final convida a usar e conversar. | 2026-08-30 | *Objetivo*, *Personas* |
| 2 | Qual defasagem do catálogo é aceitável, e o catálogo é fixado na publicação ou buscado na visita? | **≤ 24 h, por publicação agendada.** Catálogo fixado no momento da publicação; o navegador do visitante não consulta a API do GitHub. | 2026-08-30 | `RNF-08`, `RF-14` |
| 3 | Quais dos 12 repositórios públicos entram na vitrine? | **Só os que a curadoria listar** — inclusão explícita, não exclusão. | 2026-08-30 | `RF-04` |
| 4 | Como os autores aparecem na vitrine? | **Apenas como organização.** Sem nome, papel, biografia ou perfil individual. | 2026-08-30 | `RF-10`, *Fora de escopo* |
| 5 | Qual é o canal de contato acionável? | **Perfil da organização no GitHub e grupo da comunidade no Discord** — dois canais. | 2026-08-30 | `RF-10` |
| 6 | Em que idioma a vitrine é publicada? | **Português do Brasil**, idioma único. | 2026-08-30 | `RNF-07` |
| 7 | A vitrine deve ter conteúdo próprio sobre o método de trabalho da oficina? | **Não.** O método é plugin privado, instalado no ambiente do autor e fora dos projetos; a vitrine não o apresenta nem expõe o repositório que o contém. Os artefatos que ele produz (`specs/`, `.specify/`) seguem versionados normalmente nos repositórios — o que não se expõe é o plugin inteiro. | 2026-08-30 | *Fora de escopo*, `RF-04` |
| 8 | O sítio fica em `byt3un1on.github.io` ou usa domínio próprio? | **`byt3un1on.github.io`**, com ligações internas relativas para não travar a adoção futura de domínio próprio. | 2026-08-30 | `RNF-10` |
| 9 | `shared-claude-plugin` entra na vitrine, dado que o método será privado? | **Não entra.** Consequência direta do esclarecimento 7. | 2026-08-30 | `RF-04` e seu cenário |
| 10 | Os cinco repositórios `shortsmaker-*` entram, e como? | **Sim, como um projeto só**, reunindo os cinco repositórios em um item de catálogo. Nome e resumo do projeto são conteúdo da curadoria. | 2026-08-30 | `RF-07` e seu cenário |
| 11 | De onde vem o resumo de cada projeto, já que 9 dos 12 repositórios não têm descrição? | **A curadoria exige resumo**: entrada sem resumo escrito é inválida e impede a publicação. | 2026-08-30 | `RF-05` |
| 12 | Como medir se a vitrine funcionou, sem rastrear o visitante? | **Sinais do próprio GitHub** — estrelas, forks, issues de terceiros e as estatísticas de tráfego e referenciador que o GitHub dá ao dono do repositório. Nenhuma instrumentação de rastreamento no sítio. | 2026-08-30 | *Métricas de sucesso*, *Fora de escopo* |

## Métricas de sucesso

Medidas sem nenhuma instrumentação de rastreamento no sítio, a partir dos sinais que o GitHub
já oferece ao dono dos repositórios.

- **Conversão para o código**: visitas a repositório da organização cujo referenciador é
  `byt3un1on.github.io`, nas estatísticas de tráfego do GitHub. É a medida direta de que a
  vitrine cumpriu o objetivo — o visitante saiu dela e foi ao código.
- **Interesse da comunidade**: estrelas, forks e issues abertas por pessoas de fora da
  organização nos projetos expostos, comparados ao ponto de partida de **0** estrelas em
  2026-08-30.
- **Alcance**: a vitrine passa a ser o endereço que os autores enviam ao apresentar o trabalho,
  em lugar da lista de repositórios do GitHub.
- **Custo de manutenção**: publicar um repositório novo na vitrine com ficha completa exige
  alteração em **um único** arquivo de curadoria — nenhuma em código de apresentação.
- **Qualidade sustentada**: os limiares de `RNF-01` a `RNF-03` permanecem atendidos a cada
  publicação, sem exceção registrada.
