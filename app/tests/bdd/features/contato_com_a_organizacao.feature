# language: pt
Funcionalidade: Contato com a organização
  Para que o interesse gerado pela vitrine tenha para onde ir
  Como visitante convencido pelo portfólio
  Quero alcançar o código da organização e conversar com quem o mantém

  @navegador
  Cenário: RF-10 — autoria como organização e canal acionável
    Dado que estou em qualquer página pública do sítio
    Quando eu procuro por quem mantém a Byte Union
    Então eu encontro a autoria apresentada como organização
    E encontro uma ligação para o perfil da organização no GitHub
    Mas eu não vejo nome, papel, biografia ou perfil individual de nenhum autor


  @navegador
  Cenário: RF-10 — canal ainda inexistente não vira ligação morta
    Dado que a organização só oferece canal com endereço declarado
    Quando eu procuro os canais de contato em qualquer página pública
    Então canal pendente algum me é oferecido em lugar nenhum do sítio
    Mas os canais que já existem continuam acionáveis
