# language: pt
Funcionalidade: Estado visível dos controles
  Para que quem enxerga receba a mesma informação que a via acessível já entrega
  Como visitante que usa o catálogo
  Quero ver o que está destacado, o que está aplicado e onde está o meu foco

  @navegador
  Cenário: RF-04 — o destaque da curadoria produz efeito visível
    Dado que a curadoria declara um projeto como destaque
    Quando eu observo o catálogo de projetos
    Então o item desse projeto se distingue visualmente dos demais
    E a sua posição e o seu tamanho permanecem os mesmos dos demais itens
    Mas a distinção não se reduz a uma palavra escrita no cartão

  @navegador
  Cenário: RF-05 — a restrição aplicada é visível
    Dado que eu restrinjo o catálogo a uma tecnologia
    Quando eu observo o controle de restrição
    Então o critério aplicado se distingue visualmente dos não aplicados
    Mas a distinção não se reduz à cor

  @navegador
  Cenário: RF-07 — o foco é sempre visível
    Dado que eu percorro qualquer página pública somente pelo teclado
    Quando o foco alcança cada elemento interativo
    Então a aparência do elemento focado difere da do elemento não focado
    Mas nenhum elemento interativo recebe foco sem indicação visível

  @navegador
  Cenário: RF-10 — nenhum controle com aparência padrão do navegador
    Dado que eu percorro todas as páginas públicas do sítio
    Quando eu observo os elementos interativos
    Então todos apresentam aparência declarada pelo sítio
    Mas nenhum aparece com a aparência que o navegador daria por omissão
