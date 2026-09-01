# language: pt
Funcionalidade: Resiliência e bordas
  Para que a vitrine nunca exponha ao visitante uma falha crua
  Como visitante da vitrine
  Quero ser conduzido de volta quando o endereço não existe

  @navegador
  Cenário: RF-12 — endereço inexistente tem página própria
    Dado que eu abro um endereço que não corresponde a nenhuma página do sítio
    Quando a página é exibida
    Então eu vejo uma página de erro do próprio sítio, com a identidade da Byte Union
    E vejo uma ligação que me leva ao catálogo de projetos
    Mas eu não vejo página de erro genérica do serviço de hospedagem
