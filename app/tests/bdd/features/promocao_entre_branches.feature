# language: pt
Funcionalidade: Promoção entre branches por aprovação
  Para que a mudança suba da feature até a publicação sem merge feito à mão
  Como owner que aprova a Pull Request
  Quero que cada aprovação dispare o estágio seguinte sozinha

  @esteira
  Cenário: RF-06 — aprovar a primeira PR promove a feature e abre a release
    Dado que a Pull Request "PR - feature/nome-curto -> develop" recebeu aprovação de proprietário
    Quando a ação "Action - feature/nome-curto -> develop" é executada
    Então a branch de feature é integrada em develop
    E é criada a branch "release/vX.Y.Z" a partir de master
    E é aberta a Pull Request "PR - develop -> release/vX.Y.Z"
    Mas master não é alterada nesta etapa

  @esteira
  Cenário: RF-07 — aprovar a segunda PR leva develop à branch de release
    Dado que a Pull Request "PR - develop -> release/vX.Y.Z" recebeu aprovação
    Quando a ação "Action - develop -> release/vX.Y.Z" é executada
    Então develop é integrada em "release/vX.Y.Z"
    E é aberta a Pull Request "PR - release/vX.Y.Z -> master"
    Mas nada é publicado nesta etapa

  @esteira
  Cenário: RF-08 — aprovar a terceira PR publica, integra, marca e libera
    Dado que a Pull Request "PR - release/vX.Y.Z -> master" recebeu aprovação
    Quando a ação "Action - release/vX.Y.Z -> master" é executada
    Então o sítio é publicado no GitHub Pages
    E a branch de release é integrada em master
    E são criadas a tag e a release da versão "vX.Y.Z"
    Mas a integração em master não acontece antes de a publicação ter concluído com sucesso

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
