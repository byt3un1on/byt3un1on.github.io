# language: pt
Funcionalidade: Legibilidade da esteira
  Para que quem acompanha nunca fique em dúvida sobre o que está acontecendo
  Como pessoa que abre a aba de Actions
  Quero ler o diagrama e o resumo sem precisar abrir log

  @esteira
  Cenário: RNF-01 — nome de job não é truncado
    Dado que as ações da esteira estão definidas
    Quando eu leio o nome de cada job
    Então nenhum nome passa de 20 caracteres
    Mas todo nome continua dizendo o que aquele job faz

  @esteira
  Cenário: RNF-02 — job pequeno, diagrama expressivo
    Dado que as ações da esteira estão definidas
    Quando eu conto os passos de cada job
    Então nenhum job declara mais de 6 passos
    Mas nenhuma etapa da esteira deixa de aparecer no diagrama por ter virado passo interno

  @esteira
  Cenário: RNF-07 — nenhuma execução fica pendurada
    Dado que um job da esteira deixou de responder
    Quando o tempo máximo declarado para esse job se esgota
    Então o job termina com veredito explícito de falha por tempo esgotado
    Mas ele não permanece em execução indefinidamente

  @esteira
  Cenário: RF-18 — a publicação agendada também é legível
    Dado que a publicação agendada do catálogo foi disparada
    Quando eu observo o diagrama dessa execução
    Então eu vejo suas etapas como jobs separados, e não como um job único
    Mas havendo falha, o motivo aparece no resumo sem que eu abra um job

  @esteira
  Cenário: RF-11 e RF-12 — o resumo responde sem abrir log
    Dado que uma execução da esteira terminou
    Quando eu abro o resumo dessa execução
    Então eu leio o que foi verificado, o que passou e o que reprovou
    E havendo reprovação, eu leio a causa em no máximo três linhas
    Mas eu não preciso abrir nenhum job para saber qual etapa falhou
