# language: pt
Funcionalidade: Qualidade medida das páginas públicas
  Para que a vitrine seja utilizável por qualquer pessoa em qualquer dispositivo
  Como responsável pela qualidade da entrega
  Quero que acessibilidade e desempenho sejam verificados e não presumidos

  @processo
  Cenário: RNF-01 e RNF-03 — limiares de qualidade em perfil móvel
    Dado que o sítio foi construído para publicação
    Quando a auditoria automática é executada sobre cada página pública em perfil móvel
    Então nenhuma das categorias Performance, Acessibilidade, Boas Práticas e SEO fica abaixo de 90
    E o LCP não excede 2,5 segundos e o CLS não excede 0,1
    Mas nenhuma página é dispensada da auditoria


  @navegador
  Cenário: RNF-02 — operação apenas por teclado
    Dado que estou em qualquer página pública do sítio
    Quando eu percorro a página usando somente o teclado
    Então eu alcanço e aciono todos os elementos interativos, com foco sempre visível
    Mas nenhum elemento retém o foco impedindo que eu prossiga


  @navegador
  Cenário: RNF-05 — alcance de dispositivos
    Dado que abro qualquer página pública em uma viewport de 320 px de largura
    Quando a página é renderizada
    Então todo o conteúdo permanece legível e utilizável
    Mas não há rolagem horizontal


  @navegador
  Cenário: RNF-07 — idioma único
    Dado que percorro todas as páginas públicas do sítio
    Quando eu leio o conteúdo voltado ao visitante
    Então todo ele está em português do Brasil
    Mas não há alternador de idioma nem conteúdo em segundo idioma
