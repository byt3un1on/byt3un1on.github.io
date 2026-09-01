# Especificação — Esteira de entrega contínua da vitrine

> Descreve **o quê** e **por quê**. Não descreve como implementar: sem nome de biblioteca,
> sem esquema de banco, sem assinatura de função.

## Problema

A vitrine já tem contrato de operação completo (`make validate` encadeia `fmt`, `lint`, `test`,
`cover`, `it`, `bdd` e `audit`) e já tem git flow no repositório (`feature/**`, `develop`,
`release/**`, `master`). O que não existe é a **esteira que liga uma coisa à outra**.

Hoje:

- a única automação é uma publicação por agenda diária e por push em `master`, escrita como
  **um job único de nove passos**. Quem acompanha vê um retângulo só: se falhar, não se sabe
  qual etapa falhou sem abrir o log;
- **nada valida a branch de feature**. O código chega a `develop` sem que a máquina tenha
  rodado uma linha de `make validate`;
- a promoção entre branches é manual. A feature 002 chegou a `develop` por merge feito na
  máquina do autor, porque não havia caminho automatizado — o git flow existe no nome das
  branches e não no processo;
- não há versão publicada: zero tags, zero releases, e `master` não corresponde a nenhum
  estado auditável do produto.

O custo de não resolver: mudança sobe sem prova, ninguém sabe qual versão está no ar, e a
qualidade que a constituição exige (cobertura de 90%, Lighthouse de 90 em quatro categorias)
depende de alguém lembrar de rodar o comando.

## Objetivo

Toda mudança sobe da branch de feature até a publicação por uma **esteira de quatro estágios
encadeados por Pull Request**, em que:

- cada etapa de validação é um **nó próprio no diagrama** do GitHub Actions, e o diagrama
  conta a história sem que ninguém precise abrir um log para saber onde está;
- **todo portão é bloqueante** e, ao reprovar, diz o motivo em texto legível na própria
  execução, sem exigir leitura de log;
- a promoção entre branches acontece sozinha assim que o portão humano correspondente é
  vencido — e o portão é o **merge** da Pull Request, não a aprovação —, e termina em
  publicação no GitHub Pages, tag e release;
- existe **modo automático** (padrão), em que só a primeira PR exige merge humano, e
  **modo manual**, em que toda PR exige.

Observável quando pronto: um push em `feature/**` produz, sem intervenção adicional além dos
merges previstos, um sítio publicado e uma release versionada — e qualquer reprovação
interrompe a cadeia com o motivo à vista.

## Fora de escopo

- **Alterar os alvos existentes do `Makefile`.** A esteira invoca o contrato de operação como
  ele está; se um alvo precisar mudar de comportamento, é outra feature.
- **Ambiente de pré-visualização por PR** (deploy de branch em endereço temporário).
- **Reversão automática** de publicação com defeito. Reverter continua sendo ato humano.
- **Notificação fora do GitHub** — Slack, e-mail, webhook de terceiro.
- **Declarar proteção de branch como código** (infraestrutura como código). As regras de
  proteção são ajustadas por configuração do repositório, não versionadas nesta feature.
- **Mudar conteúdo, identidade visual ou rotas do sítio.** A esteira publica o que existe.
- **Publicar a partir de fork** ou aceitar contribuição externa à organização.
- **Emitir a credencial dedicada da esteira.** A criação do token de acesso e seu registro
  como segredo do repositório são ato do proprietário da organização, fora do que esta feature
  produz — ela apenas declara o segredo de que depende e falha de forma explícita sem ele.

## Personas e cenários de uso

**Autora da mudança** — trabalha em `feature/<nome-curto>`, empurra o commit e acompanha o
diagrama. Espera saber, em segundos e sem abrir log, se passou; e, se não passou, qual das
verificações reprovou e por quê.

**Owner da organização** — não escreveu o código. Chega pela notificação da PR, precisa decidir
aprovar e mergear, ou não. Espera ver o resultado das verificações antes de decidir, e espera
que o merge seja o único ato que lhe cabe: o que vem depois anda sozinho.

**Quem observa a esteira** — pode ser qualquer um dos dois em outro momento. Abre a aba de
Actions e quer responder, só olhando: em que estágio a mudança está, o que já passou, o que
falta, e se algo está parado esperando gente.

## Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | Push em branch `feature/**` deve disparar a esteira de validação, e a execução deve ser identificada pela **descrição do último commit** — não por um nome fixo igual para toda execução | obrigatório |
| RF-02 | A esteira de validação deve executar `fmt`, `lint`, `test`, `cover`, `it`, `bdd` e `audit` — os sete passos de `make validate` — **cada um como job próprio**, sem que a reprovação de um impeça os demais de reportar seu próprio resultado | obrigatório |
| RF-03 | A esteira de validação deve reprovar quando a cobertura ficar **abaixo de 90%**, e a reprovação deve nomear a cobertura medida | obrigatório |
| RF-04 | Com todos os jobs de verificação aprovados, a esteira deve abrir a Pull Request de título **`PR - feature/<nome-curto> -> develop`**, ou atualizar a que já existir para a mesma branch, sem abrir duplicata | obrigatório |
| RF-05 | Com qualquer job reprovado, a esteira **não deve abrir nem avançar** a Pull Request, e deve registrar o motivo da reprovação de forma visível na execução | obrigatório |
| RF-06 | O **merge** da PR `feature -> develop` deve disparar a ação **`Action - feature/<nome-curto> -> develop`**, que cria a branch `release/vX.Y.Z` a partir de `master` e abre a PR **`PR - develop -> release/vX.Y.Z`**. O gatilho é o merge consumado, e não a aprovação: aprovar sem mergear não promove nada, e fechar a PR sem mergear não dispara estágio algum | obrigatório |
| RF-07 | O **merge** da PR `develop -> release` deve disparar a ação **`Action - develop -> release/vX.Y.Z`**, que abre a PR **`PR - release/vX.Y.Z -> master`** | obrigatório |
| RF-08 | O **merge** da PR `release -> master` deve disparar a ação **`Action - release -> master`**, que publica o sítio no GitHub Pages e cria a **tag** e a **release** daquela versão. O gatilho observável é o **push em `master`** que o merge produz, e não a Pull Request: o ambiente de publicação só aceita implantação vinda de `refs/heads/master`, e uma execução de `pull_request` carrega `refs/pull/<n>/merge`, que a proteção do ambiente recusa | obrigatório |
| RF-09 | A esteira deve operar em dois modos: **automático**, em que só a PR `feature -> develop` exige merge humano e as demais são mergeadas pela própria esteira; e **manual**, em que as três PRs exigem merge humano. O modo padrão é uma **configuração do repositório**, cujo valor de fábrica é `automatico`, e uma **marcação aplicada à PR de feature** força o modo manual naquela cadeia | obrigatório |
| RF-10 | A versão `vX.Y.Z` deve seguir versionamento semântico, derivado das **mensagens de commit no padrão de commits convencionais**: mudança incompatível eleva a *major*, funcionalidade nova eleva a *minor*, e o restante eleva a *patch*. **Não havendo versão anterior alguma**, a primeira versão publicada é **`v1.0.0`**, sem aplicar incremento — o incremento só passa a valer da segunda em diante. Nenhuma versão já existente é repetida ou sobrescrita | obrigatório |
| RF-11 | Cada ação da esteira deve expor suas etapas como **jobs separados**, de modo que o diagrama do GitHub Actions mostre a sequência sem que seja preciso abrir um job para saber o que ele faz | obrigatório |
| RF-12 | Quem acompanha uma execução deve conseguir responder, **pelo resumo da execução**, sem abrir log: o que foi verificado, o que passou, o que reprovou e por qual motivo | obrigatório |
| RF-13 | Toda reprovação de portão deve **interromper a cadeia**: nenhum estágio posterior é executado, e nenhuma PR posterior é aberta ou mergeada | obrigatório |
| RF-14 | A publicação no GitHub Pages deve usar o **mesmo artefato** construído e verificado pelo estágio anterior — não uma construção nova e não verificada | obrigatório |
| RF-15 | Quando a esteira falhar por motivo de permissão, credencial ausente ou conflito de integração, a execução deve declarar **qual** dessas causas ocorreu, em lugar de terminar com erro genérico | obrigatório |
| RF-16 | O job de formatação deve **reprovar quando a formatação deixar arquivos modificados**, nomeando os arquivos fora de formato, sem alterar a branch de quem programa | obrigatório |
| RF-17 | Havendo conflito de integração com a branch de destino, a esteira deve **reprovar e devolver à autora**, nomeando a branch de destino e os arquivos em conflito, sem tentar resolvê-lo sozinha | obrigatório |
| RF-18 | A publicação agendada existente, que mantém a atualidade do catálogo independentemente de mudança de código, deve **permanecer**, reescrita com as mesmas regras de legibilidade desta esteira — etapas como jobs separados e motivo de falha visível no resumo | obrigatório |
| RF-19 | O repositório deve declarar seus **proprietários de código**, de modo que a revisão exigida na Pull Request de feature seja de proprietário declarado. A esteira nunca mergeia essa Pull Request sozinha, em modo algum | obrigatório |
| RF-20 | A esteira deve operar sob **credencial dedicada, registrada como segredo do repositório**, distinta da credencial padrão da execução — sem a qual as ações seguintes não seriam disparadas nem os merges automáticos seriam possíveis. Ausente o segredo, a execução deve reprovar declarando essa causa | obrigatório |

## Requisitos não funcionais

| ID | Requisito | Critério mensurável |
|---|---|---|
| RNF-01 | Nome de job legível sem truncamento na interface do GitHub Actions | todo nome de job tem no máximo **20 caracteres**, sem reticências e sem abreviação inventada |
| RNF-02 | Job enxuto, para que o diagrama seja a unidade de leitura e não o log | nenhum job da esteira declara mais de **6 passos** |
| RNF-03 | Cobertura mínima da entrega | **≥ 90%** de linhas, medida pelo alvo `cover` do contrato de operação |
| RNF-04 | Qualidade das páginas publicadas preservada pela esteira | as quatro categorias do Lighthouse — Performance, Acessibilidade, Boas Práticas e SEO — em **≥ 90** no perfil móvel, medidas pelo alvo `audit` antes de qualquer publicação |
| RNF-05 | Paralelismo real na validação, sem construção repetida | os **5** jobs que não dependem de construção — formatação, análise estática, testes unitários, cobertura e integração — começam sem esperar uns aos outros nem pela construção; **auditoria** espera apenas a construção, e **comportamento** espera a auditoria, porque afirma sobre o relatório que ela produz; a construção do sítio acontece **1** vez por execução, e a auditoria **1** vez |
| RNF-06 | Nenhum segredo no que é publicado | **0** ocorrências de token, credencial ou segredo no artefato enviado ao GitHub Pages |
| RNF-07 | Nenhuma execução fica pendurada sem desfecho | todo job tem tempo máximo declarado e termina com veredito explícito — sucesso, falha ou cancelamento — em no máximo **30 minutos** |
| RNF-08 | O motivo da reprovação chega antes do log | o resumo da execução nomeia a etapa reprovada e a causa em, no máximo, **3 linhas**, sem exigir abertura de job |

## Critérios de aceite

Escritos em DADO / QUANDO / ENTÃO / MAS. Cada critério vira um cenário em
`app/tests/bdd/` sem tradução no meio.

```gherkin
# language: pt
Funcionalidade: Validação da branch de feature

  Cenário: RF-01 — a execução se identifica pelo último commit
    Dado que existe uma branch de feature com um commit cuja descrição é conhecida
    Quando um push é feito nessa branch
    Então a esteira de validação é disparada
    E a execução é identificada pela descrição desse commit
    Mas a execução não é identificada por um nome fixo, igual para toda execução

  Cenário: RF-02 — as sete verificações são sete jobs
    Dado que a esteira de validação foi disparada por push em branch de feature
    Quando eu observo o diagrama da execução
    Então eu vejo um job próprio para cada uma das sete verificações: formatação, análise estática, testes unitários, cobertura, integração, comportamento e auditoria
    Mas eu não vejo nenhuma dessas verificações escondida como passo dentro de um job de outra verificação

  Cenário: RNF-05 — nada é esperado além do que a dependência real exige
    Dado que a esteira de validação foi disparada
    Quando eu observo as dependências declaradas entre os jobs de verificação
    Então formatação, análise estática, testes unitários, cobertura e integração não dependem de nenhum outro job
    E auditoria depende apenas do job de construção, e comportamento depende apenas do job de auditoria
    Mas o sítio é construído uma única vez na execução, e auditado uma única vez

  Cenário: RF-03 — cobertura abaixo do mínimo reprova e diz quanto mediu
    Dado que a mudança na branch de feature deixa a cobertura de linhas abaixo de 90%
    Quando a esteira de validação executa a verificação de cobertura
    Então o job de cobertura reprova
    E o resumo da execução informa a cobertura medida e o mínimo exigido de 90%
    Mas a esteira não abre a Pull Request para develop

  Cenário: RF-16 — formatação pendente reprova e nomeia os arquivos
    Dado que existe na branch um arquivo fora do formato do projeto
    Quando o job de formatação é executado
    Então o job reprova e o resumo nomeia os arquivos fora de formato
    Mas nenhum commit de formatação é empurrado para a branch

  Cenário: RF-04 — validação aprovada abre a Pull Request com o título previsto
    Dado que todos os jobs de verificação aprovaram na branch "feature/nome-curto"
    Quando o portão de validação é avaliado
    Então é aberta a Pull Request de título "PR - feature/nome-curto -> develop"
    Mas nenhuma outra Pull Request é aberta pela mesma execução

  Cenário: RF-04 — push seguinte não duplica a Pull Request
    Dado que já existe Pull Request aberta da branch "feature/nome-curto" para develop
    Quando um novo push é feito nessa mesma branch e a validação aprova
    Então a Pull Request existente é atualizada com o resultado da nova validação
    Mas nenhuma segunda Pull Request é aberta para a mesma branch

  Cenário: RF-05 e RF-13 — uma reprovação interrompe a cadeia inteira
    Dado que todas as verificações aprovaram exceto uma, que reprovou
    Quando o portão de validação é avaliado
    Então o portão reprova e nomeia a verificação que falhou
    E nenhum estágio posterior da esteira é executado
    Mas as verificações aprovadas continuam exibindo seu resultado próprio de aprovação
```

```gherkin
# language: pt
Funcionalidade: Promoção entre branches por merge

  Cenário: RF-06 — mergear a primeira PR abre a release
    Dado que a Pull Request "PR - feature/nome-curto -> develop" foi mergeada
    Quando a ação "Action - feature/nome-curto -> develop" é executada
    Então a promoção é disparada pelo merge, e não pela aprovação
    E a ação só reage a merge de branch de feature em develop
    E é criada a branch "release/vX.Y.Z" a partir de master
    E é aberta a Pull Request "PR - develop -> release/vX.Y.Z"
    Mas master não é alterada nesta etapa

  Cenário: RF-07 — mergear a segunda PR abre a Pull Request que publica
    Dado que a Pull Request "PR - develop -> release/vX.Y.Z" foi mergeada
    Quando a ação "Action - develop -> release/vX.Y.Z" é executada
    Então a promoção é disparada pelo merge, e não pela aprovação
    E a ação só reage a merge de develop em branch de release
    E é aberta a Pull Request "PR - release/vX.Y.Z -> master"
    Mas nada é publicado nesta etapa

  Cenário: RF-08 — mergear a terceira PR publica, marca e libera
    Dado que a Pull Request "PR - release/vX.Y.Z -> master" foi mergeada
    Quando a ação "Action - release/vX.Y.Z -> master" é executada
    Então a promoção é disparada pelo merge, e não pela aprovação
    E a ação só reage a merge de branch de release em master
    E o sítio é publicado no GitHub Pages
    E são criadas a tag e a release da versão "vX.Y.Z"
    Mas a marca da versão não é criada antes de a publicação ter concluído com sucesso

  Cenário: RF-06 — fechar a Pull Request sem mergear não promove nada
    Dado que a Pull Request "PR - feature/nome-curto -> develop" foi fechada sem merge
    Quando a ação "Action - feature/nome-curto -> develop" é executada
    Então a ação exige merge consumado, e fechamento sem merge não a dispara
    Mas isso vale igualmente para os três estágios da cadeia

  Cenário: RF-10 — funcionalidade nova eleva a minor
    Dado que a última versão publicada é "v1.2.3"
    E que os commits promovidos declaram funcionalidade nova, sem mudança incompatível
    Quando a esteira decide o número da nova versão
    Então a nova versão é "v1.3.0"
    Mas nenhuma tag existente é sobrescrita

  Cenário: RF-10 — mudança incompatível eleva a major
    Dado que a última versão publicada é "v1.2.3"
    E que os commits promovidos declaram mudança incompatível
    Quando a esteira decide o número da nova versão
    Então a nova versão é "v2.0.0"
    Mas nenhuma tag existente é sobrescrita

  Cenário: RF-10 — sem funcionalidade nem incompatibilidade, eleva a patch
    Dado que a última versão publicada é "v1.2.3"
    E que os commits promovidos não declaram funcionalidade nova nem mudança incompatível
    Quando a esteira decide o número da nova versão
    Então a nova versão é "v1.2.4"
    Mas nenhuma tag existente é sobrescrita

  Cenário: RF-10 — sem versão anterior, a esteira publica a primeira
    Dado que não existe versão publicada alguma
    E que os commits promovidos declaram funcionalidade nova
    Quando a esteira decide o número da nova versão
    Então a nova versão é "v1.0.0"
    Mas o incremento dos commits não é aplicado sobre ela, e a esteira não falha por não encontrar versão anterior

  Cenário: RF-14 — publica o artefato que foi verificado
    Dado que o estágio anterior construiu e auditou o sítio
    Quando a publicação no GitHub Pages acontece
    Então o que é publicado é o mesmo artefato que passou pela auditoria
    Mas não é feita uma construção nova sem verificação para publicar

  Cenário: RF-15 e RF-20 — credencial ausente se declara como tal
    Dado que a credencial dedicada da esteira não está registrada como segredo do repositório
    Quando uma ação de promoção é executada
    Então a execução reprova declarando que a causa foi ausência da credencial dedicada
    Mas a execução não termina apenas com erro genérico de comando

  Cenário: RF-17 — conflito de integração volta para a autora
    Dado que a branch de destino avançou e conflita com a branch de origem
    Quando a esteira tenta a integração
    Então a execução reprova nomeando a branch de destino e os arquivos em conflito
    Mas a esteira não altera a branch de origem para tentar resolver o conflito
```

```gherkin
# language: pt
Funcionalidade: Modos de operação da esteira

  Cenário: RF-09 — no modo automático só a primeira PR espera por gente
    Dado que a esteira opera em modo automático
    Quando a Pull Request "PR - feature/nome-curto -> develop" é mergeada por um proprietário
    Então as Pull Requests seguintes da cadeia são mergeadas pela própria esteira
    Mas a primeira Pull Request não é mergeada pela esteira em nenhuma hipótese

  Cenário: RF-09 — a marcação na PR de feature força o modo manual
    Dado que a configuração do repositório define o modo automático
    E que a Pull Request de feature recebeu a marcação de modo manual
    Quando a Pull Request "PR - develop -> release/vX.Y.Z" é aberta
    Então a esteira aguarda merge humano antes de prosseguir
    Mas a esteira não mergeia essa Pull Request sozinha

  Cenário: RF-09 — sem configuração nem marcação vale o modo automático
    Dado que o repositório não define modo algum e a Pull Request não tem marcação
    Quando a esteira decide como tratar os merges da cadeia
    Então ela opera em modo automático
    Mas ela registra no resumo da execução qual modo está em vigor

  Cenário: RF-19 — quem revisa a Pull Request de feature é proprietário declarado
    Dado que o repositório declara seus proprietários de código
    Quando uma Pull Request da esteira aguarda revisão
    Então a revisão que satisfaz o portão é a de um proprietário declarado
    Mas a esteira nunca mergeia a Pull Request de feature sozinha
```

```gherkin
# language: pt
Funcionalidade: Legibilidade da esteira

  Cenário: RNF-01 — nome de job não é truncado
    Dado que as ações da esteira estão definidas
    Quando eu leio o nome de cada job
    Então nenhum nome passa de 20 caracteres
    Mas todo nome continua dizendo o que aquele job faz

  Cenário: RNF-02 — job pequeno, diagrama expressivo
    Dado que as ações da esteira estão definidas
    Quando eu conto os passos de cada job
    Então nenhum job declara mais de 6 passos
    Mas nenhuma etapa da esteira deixa de aparecer no diagrama por ter virado passo interno

  Cenário: RF-11 e RF-12 — o resumo responde sem abrir log
    Dado que uma execução da esteira terminou
    Quando eu abro o resumo dessa execução
    Então eu leio o que foi verificado, o que passou e o que reprovou
    E havendo reprovação, eu leio a causa em no máximo três linhas
    Mas eu não preciso abrir nenhum job para saber qual etapa falhou

  Cenário: RNF-07 — nenhuma execução fica pendurada
    Dado que um job da esteira deixou de responder
    Quando o tempo máximo declarado para esse job se esgota
    Então o job termina com veredito explícito de falha por tempo esgotado
    Mas ele não permanece em execução indefinidamente

  Cenário: RF-18 — a publicação agendada também é legível
    Dado que a publicação agendada do catálogo foi disparada
    Quando eu observo o diagrama dessa execução
    Então eu vejo suas etapas como jobs separados, e não como um job único
    Mas havendo falha, o motivo aparece no resumo sem que eu abra um job
```

## Ambiguidades

Nenhuma. As dez marcas da primeira redação e a décima primeira, aberta pela análise de
2026-09-01, foram resolvidas pelo usuário e estão registradas na tabela abaixo.

## Esclarecimentos

| # | Pergunta | Resposta do usuário | Data |
|---|---|---|---|
| 1 | Como a versão semântica é decidida, e de que versão se parte? | Pelas mensagens de commit, no padrão de commits convencionais: incompatibilidade eleva a *major*, funcionalidade nova eleva a *minor*, o restante eleva a *patch*. | 2026-09-01 |
| 2 | Onde vive o interruptor entre modo automático e manual? | Configuração do repositório define o padrão (`automatico`), e uma marcação aplicada à Pull Request de feature força o modo manual naquela cadeia. | 2026-09-01 |
| 3 | Quem são os *owners* que aprovam, se não há declaração de proprietários? | Declarar os proprietários de código da organização, de modo que a aprovação exigida seja de proprietário declarado. | 2026-09-01 |
| 4 | Como a esteira aprova uma PR no modo automático, se o GitHub proíbe autoaprovação e a credencial padrão não dispara outras ações? | Gerar uma credencial de acesso nova, com **apenas as permissões necessárias**, e registrá-la como segredo do repositório. A esteira opera sob ela. | 2026-09-01 |
| 5 | O que caracteriza reprovação de formatação, se o alvo reescreve os arquivos? | Reprovar quando a formatação deixar arquivos modificados, nomeando-os. Sem empurrar formatação de volta para a branch e sem alvo novo no contrato. | 2026-09-01 |
| 6 | Independência plena dos sete jobs, ou construção única compartilhada? | Construção única, em job próprio, que alimenta auditoria e comportamento. Os cinco jobs restantes seguem independentes e paralelos. | 2026-09-01 |
| 7 | O GitHub Pages continua em modo legado (branch `master`) ou passa a publicar por ação? | Passa a publicar **por ação**, para que o que vai ao ar seja o artefato construído e auditado pela esteira. | 2026-09-01 |
| 8 | Qual o destino da publicação agendada diária existente? | Permanece, reescrita nos mesmos padrões desta esteira — etapas como jobs separados e motivo visível no resumo. | 2026-09-01 |
| 9 | A terceira ação usa dois-pontos ou hífen, como as demais? | Hífen, padronizada com as outras duas: `Action - develop -> release/vX.Y.Z`. | 2026-09-01 |
| 10 | O que a esteira faz quando a branch de destino avançou e conflita? | Reprova e devolve à autora, nomeando o conflito. Não tenta atualizar a branch de origem sozinha. | 2026-09-01 |
| 11 | Qual é a primeira versão, se o repositório não tem tag alguma? | `v1.0.0`, sem aplicar incremento. O sítio já está publicado e `app/package.json` já declara `1.0.0`: a primeira marca diz a verdade sobre um produto no ar, e o incremento passa a valer da segunda versão em diante. | 2026-09-01 |

## Correções posteriores ao esclarecimento

| # | O que mudou | Por quê | Data |
|---|---|---|---|
| 1 | RNF-05 e seu cenário: `comportamento` deixa de depender só da construção e passa a depender da **auditoria** | A leitura do contrato de operação durante o planejamento mostrou que o alvo de comportamento afirma sobre o relatório que a auditoria produz — a dependência já existe e é de dado, não de gosto. A redação anterior descrevia uma cadeia que não existe. | 2026-09-01 |
| 2 | RF-06, RF-07, RF-08, RF-09, RF-13, RF-19 e RF-20: o gatilho de cada estágio deixa de ser a **aprovação** da Pull Request e passa a ser o **merge**; o modo automático deixa de aprovar sozinho e passa a **mergear** sozinho; os jobs que faziam o merge desaparecem, porque o merge virou o gatilho | A primeira execução real provou o defeito: o owner fez a coisa natural — clicou em *Merge pull request* — e a cadeia não viu, porque escutava `pull_request_review`. Aprovação é opinião registrada; merge é fato consumado. Só o fato deve mover a esteira, e quem mergeia sem aprovar promoveu do mesmo jeito. Efeito colateral bem-vindo: some a necessidade de duas identidades para contornar a proibição de auto-aprovação do GitHub. | 2026-09-01 |
| 3 | RF-08: o gatilho do estágio que publica passa a ser o **push em `master`**, e não a Pull Request mergeada | A publicação reprovou em execução real com *Branch "refs/pull/12/merge" is not allowed to deploy to github-pages due to environment protection rules*. A política do ambiente aceita só `refs/heads/master`, e execução de `pull_request` nunca carrega esse ref. Afrouxar a proteção do ambiente para caber no código seria trocar uma garantia real por conveniência; o push em `master` é o mesmo fato, com o ref que o ambiente exige. | 2026-09-01 |

## Métricas de sucesso

- **Nenhuma promoção manual.** Após a adoção, 100% das integrações em `master` têm origem em
  execução da esteira — nenhuma em merge feito na máquina de alguém. A integração em `develop`
  é o portão humano, e acontece na interface do GitHub.
- **Toda publicação é rastreável a uma versão.** Cada estado publicado corresponde a uma tag e
  a uma release; hoje são zero.
- **Diagnóstico sem log.** Em toda execução reprovada, a etapa e a causa estão no resumo da
  execução — a medida é não haver reprovação cuja causa exija abrir um job para ser conhecida.
- **Qualidade não regride pela automação.** Cobertura ≥ 90% e as quatro categorias do
  Lighthouse ≥ 90 continuam sendo condição de publicação, agora verificadas pela máquina em
  toda mudança, e não por lembrança de quem programa.
