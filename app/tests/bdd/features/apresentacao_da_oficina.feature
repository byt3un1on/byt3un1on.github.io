# language: pt
Funcionalidade: Apresentação da oficina
  Para que uma pessoa técnica que não conhece a Byte Union entenda a que ela se propõe
  Como visitante da vitrine
  Quero compreender a organização antes de olhar qualquer projeto

  @navegador
  Cenário: RF-01 — proposta visível na chegada
    Dado que eu nunca acessei a vitrine da Byte Union
    Quando eu abro a página inicial do sítio
    Então eu vejo o nome da organização e uma declaração do que ela faz como oficina de projetos
    E essa declaração está visível sem que eu role a página
    Mas não me é exigida nenhuma ação, cadastro ou aceite antes de ler
