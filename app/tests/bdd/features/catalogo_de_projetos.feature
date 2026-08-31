# language: pt
Funcionalidade: Catálogo de projetos
  Para que o trabalho da oficina seja legível a quem não o escreveu
  Como visitante da vitrine
  Quero percorrer os projetos e entender o que cada um faz

  @navegador
  Cenário: RF-02 — catálogo tem origem no GitHub da organização
    Dado que a organização possui repositórios públicos com commits
    Quando eu abro o catálogo de projetos
    Então cada projeto exibido corresponde a repositório existente da organização
    Mas nenhum projeto exibido tem origem em texto desvinculado de um repositório


  @navegador
  Cenário: RF-03 — ficha mínima de cada projeto
    Dado que o catálogo exibe um projeto declarado na curadoria
    Quando eu observo o item desse projeto no catálogo
    Então eu vejo seu nome legível, um resumo do que ele faz, as tecnologias que ele emprega e um sinal de sua atividade
    E eu vejo uma ligação que leva ao repositório de origem
    Mas eu não vejo campo obrigatório exibido em branco ou com texto de preenchimento


  @navegador
  Cenário: RF-04 — repositório não declarado na curadoria não aparece
    Dado que a organização possui o repositório público "shared-claude-plugin"
    E que a curadoria não declara esse repositório
    Quando eu abro o catálogo de projetos
    Então "shared-claude-plugin" não aparece em lugar nenhum do sítio
    Mas os projetos declarados na curadoria continuam sendo exibidos


  @processo
  Cenário: RF-06 — repositório privado não é exposto ainda que declarado
    Dado que a curadoria declara o repositório "niche-scout"
    E que "niche-scout" é privado na organização
    Quando o catálogo de projetos é montado
    Então "niche-scout" não aparece em lugar nenhum do sítio
    Mas os demais projetos declarados continuam sendo exibidos


  @processo
  Cenário: RF-06 — repositório sem commit não é exposto ainda que declarado
    Dado que a curadoria declara o repositório "documentation-site"
    E que "documentation-site" não possui nenhum commit
    Quando o catálogo de projetos é montado
    Então "documentation-site" não aparece no catálogo
    Mas nenhuma mensagem de erro é exibida ao visitante


  @navegador
  Cenário: RF-07 — sistema de vários repositórios é um projeto só
    Dado que a curadoria declara um projeto composto pelos repositórios "shortsmaker-api", "shortsmaker-frontend", "shortsmaker-worker", "shortsmaker-infra" e "shortsmaker-docs"
    Quando eu abro o catálogo de projetos
    Então eu vejo um único item de catálogo para esse projeto
    E esse item exibe a união das tecnologias dos cinco repositórios
    E esse item exibe a data de atividade mais recente entre os cinco
    E ao abri-lo eu vejo os cinco repositórios que o compõem, cada um com sua ligação
    Mas eu não vejo cinco itens separados no catálogo


  @navegador
  Cenário: RF-11 — restrição por tecnologia alcança projeto multi-tecnologia
    Dado que o catálogo exibe um projeto cujas tecnologias são "Python" e "TypeScript"
    Quando eu restrinjo o catálogo à tecnologia "TypeScript"
    Então esse projeto continua visível
    E o critério aplicado permanece visível para mim
    Mas a restrição não altera o endereço dos projetos nem impede que eu a remova


  @navegador
  Cenário: RF-13 — restrição sem resultado se explica
    Dado que o catálogo está exibindo projetos
    Quando eu aplico uma restrição que não corresponde a nenhum projeto
    Então eu vejo uma mensagem que explica que nenhum projeto atende ao critério
    E eu vejo como remover a restrição
    Mas eu não vejo uma área vazia sem explicação


  @navegador
  Cenário: RF-13 — a mudança de resultado é anunciada a quem usa leitor de tela
    Dado que eu percorro o catálogo com leitor de tela
    Quando eu altero a restrição por tecnologia
    Então a quantidade de projetos resultante me é anunciada
    Mas o meu foco permanece onde estava, no controle de restrição
