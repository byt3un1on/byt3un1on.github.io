# language: pt
Funcionalidade: Promoção entre branches por merge
  Para que a mudança suba da feature até a publicação sem etapa feita à mão
  Como owner que mergeia a Pull Request
  Quero que cada merge dispare o estágio seguinte sozinho

  @esteira
  Cenário: RF-06 — mergear a primeira PR abre a release
    Dado que a Pull Request "PR - feature/nome-curto -> develop" foi mergeada
    Quando a ação "Action - feature/nome-curto -> develop" é executada
    Então a promoção é disparada pelo merge, e não pela aprovação
    E a ação só reage a merge de branch de feature em develop
    E é criada a branch "release/vX.Y.Z" a partir de master
    E é aberta a Pull Request "PR - develop -> release/vX.Y.Z"
    Mas master não é alterada nesta etapa

  @esteira
  Cenário: RF-07 — mergear a segunda PR abre a Pull Request que publica
    Dado que a Pull Request "PR - develop -> release/vX.Y.Z" foi mergeada
    Quando a ação "Action - develop -> release/vX.Y.Z" é executada
    Então a promoção é disparada pelo merge, e não pela aprovação
    E a ação só reage a merge de develop em branch de release
    E é aberta a Pull Request "PR - release/vX.Y.Z -> master"
    Mas nada é publicado nesta etapa

  @esteira
  Cenário: RF-08 — mergear a terceira PR publica, marca e libera
    Dado que a Pull Request "PR - release/vX.Y.Z -> master" foi mergeada
    Quando a ação "Action - release/vX.Y.Z -> master" é executada
    Então a publicação reage ao que entrou em master, e não à Pull Request
    E o sítio é publicado no GitHub Pages
    E são criadas a tag e a release da versão "vX.Y.Z"
    Mas a marca da versão não é criada antes de a publicação ter concluído com sucesso

  @esteira
  Cenário: RF-06 — fechar a Pull Request sem mergear não promove nada
    Dado que a Pull Request "PR - feature/nome-curto -> develop" foi fechada sem merge
    Quando a ação "Action - feature/nome-curto -> develop" é executada
    Então a ação exige merge consumado, e fechamento sem merge não a dispara
    Mas isso vale igualmente para os dois estágios de promoção

  @esteira
  Cenário: RF-13 — versão inválida reprova em vez de virar nome de branch
    Dado que a Pull Request "PR - feature/nome-curto -> develop" foi mergeada
    Quando a ação "Action - feature/nome-curto -> develop" é executada
    Então o job da versão confere o valor antes de entregá-lo ao job seguinte
    Mas a branch de release nasce de master sem trazer a árvore de master para o runner

  @esteira
  Cenário: RF-14 — publica o artefato que foi verificado
    Dado que o estágio anterior construiu e auditou o sítio
    Quando a publicação no GitHub Pages acontece
    Então o que é publicado é o mesmo artefato que passou pela auditoria
    Mas não é feita uma construção nova sem verificação para publicar

  @esteira
  Cenário: RF-10 — funcionalidade nova eleva a minor
    Dado que a última versão publicada é "v1.2.3"
    E que os commits promovidos declaram funcionalidade nova, sem mudança incompatível
    Quando a esteira decide o número da nova versão
    Então a nova versão é "v1.3.0"
    Mas nenhuma tag existente é sobrescrita

  @esteira
  Cenário: RF-10 — mudança incompatível eleva a major
    Dado que a última versão publicada é "v1.2.3"
    E que os commits promovidos declaram mudança incompatível
    Quando a esteira decide o número da nova versão
    Então a nova versão é "v2.0.0"
    Mas nenhuma tag existente é sobrescrita

  @esteira
  Cenário: RF-10 — sem funcionalidade nem incompatibilidade, eleva a patch
    Dado que a última versão publicada é "v1.2.3"
    E que os commits promovidos não declaram funcionalidade nova nem mudança incompatível
    Quando a esteira decide o número da nova versão
    Então a nova versão é "v1.2.4"
    Mas nenhuma tag existente é sobrescrita

  @esteira
  Cenário: RF-10 — sem versão anterior, a esteira publica a primeira
    Dado que não existe versão publicada alguma
    E que os commits promovidos declaram funcionalidade nova
    Quando a esteira decide o número da nova versão
    Então a nova versão é "v1.0.0"
    Mas o incremento dos commits não é aplicado sobre ela, e a esteira não falha por não encontrar versão anterior

  @esteira
  Cenário: RF-15 e RF-20 — credencial ausente se declara como tal
    Dado que a credencial dedicada da esteira não está registrada como segredo do repositório
    Quando uma ação de promoção é executada
    Então a execução reprova declarando que a causa foi ausência da credencial dedicada
    Mas a execução não termina apenas com erro genérico de comando

  @esteira
  Cenário: RF-17 — conflito de integração volta para a autora
    Dado que a branch de destino avançou e conflita com a branch de origem
    Quando a esteira tenta a integração
    Então a execução reprova nomeando a branch de destino e os arquivos em conflito
    Mas a esteira não altera a branch de origem para tentar resolver o conflito
