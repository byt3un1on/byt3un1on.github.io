# language: pt
Funcionalidade: Curadoria do catálogo
  Para que os autores controlem a narrativa sem mexer na interface
  Como autor da Byte Union
  Quero declarar em um único lugar versionado o que entra, em que ordem e com que texto

  @navegador
  Cenário: RF-04 — ordem e destaque vêm da curadoria
    Dado que a curadoria declara um projeto como destaque e primeiro da ordem
    Quando eu abro o catálogo de projetos
    Então esse projeto aparece em primeiro lugar e sinalizado como destaque
    Mas nenhuma alteração de ordem ou destaque exigiu mudança em código de apresentação


  @navegador
  Cenário: RF-04 — resumo editorial supre a descrição ausente
    Dado que o repositório "shortsmaker-api" não tem descrição preenchida no GitHub
    E que a curadoria declara um resumo para esse repositório
    Quando eu observo esse projeto no catálogo
    Então eu vejo o resumo declarado pela curadoria
    Mas eu não vejo resumo vazio nem o nome do repositório repetido no lugar do resumo


  @processo
  Cenário: RF-05 — entrada sem resumo impede a publicação
    Dado que a curadoria declara um projeto sem resumo escrito
    Quando a publicação do sítio é executada
    Então a publicação falha indicando qual entrada de curadoria está sem resumo
    Mas nenhum projeto com ficha incompleta é publicado


  @processo
  Cenário: RF-05 — referência a repositório inexistente impede a publicação
    Dado que a curadoria declara um repositório que não existe mais na organização
    Quando a publicação do sítio é executada
    Então a publicação falha indicando qual referência está quebrada
    Mas a vitrine não é publicada omitindo silenciosamente esse projeto


  @processo
  Cenário: RF-05 — repositório declarado em dois projetos impede a publicação
    Dado que a curadoria declara o mesmo repositório em dois projetos distintos
    Quando a publicação do sítio é executada
    Então a publicação falha indicando o repositório repetido e os dois projetos que o declaram
    Mas nenhum catálogo com repositório duplicado é publicado
