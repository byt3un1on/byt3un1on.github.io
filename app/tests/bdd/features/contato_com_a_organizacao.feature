# language: pt
Funcionalidade: Contato com a organização
  Para que o interesse gerado pela vitrine tenha para onde ir
  Como visitante convencido pelo portfólio
  Quero alcançar o código da organização e conversar com quem o mantém

  @navegador
  Cenário: RF-10 — autoria como organização e dois canais acionáveis
    Dado que estou em qualquer página pública do sítio
    Quando eu procuro por quem mantém a Byte Union
    Então eu encontro a autoria apresentada como organização
    E encontro uma ligação para o perfil da organização no GitHub e outra para o grupo da comunidade no Discord
    Mas eu não vejo nome, papel, biografia ou perfil individual de nenhum autor
