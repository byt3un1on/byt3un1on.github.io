# language: pt
Funcionalidade: Hierarquia tipográfica
  Para que o visitante saiba onde olhar primeiro
  Como pessoa técnica percorrendo o catálogo
  Quero distinguir título, texto e metadado sem precisar ler tudo

  @navegador
  Cenário: RF-03 — os quatro níveis se distinguem
    Dado que eu abro o catálogo de projetos
    Quando eu comparo o título da página, o título de um projeto, o texto corrido e o metadado
    Então cada nível se distingue do seguinte por mais de um atributo tipográfico
    Mas nenhum par de níveis se distingue apenas pelo tamanho da letra

  @navegador
  Cenário: RF-06 — os itens do catálogo se leem como unidades
    Dado que o catálogo exibe mais de um projeto
    Quando eu observo o espaço entre os itens
    Então o espaço que separa um item do seguinte é maior que o espaço interno do item
    Mas nenhum item se confunde visualmente com o item vizinho
