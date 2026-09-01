# language: pt
Funcionalidade: Modos de operação da esteira
  Para que a cadeia ande sozinha sem deixar de ter portão humano
  Como organização que publica a vitrine
  Quero escolher entre exigir um merge humano ou exigir todos

  @esteira
  Cenário: RF-19 — quem revisa a Pull Request de feature é proprietário declarado
    Dado que o repositório declara seus proprietários de código
    Quando uma Pull Request da esteira aguarda revisão
    Então a revisão que satisfaz o portão é a de um proprietário declarado
    Mas a esteira nunca mergeia a Pull Request de feature sozinha

  @esteira
  Cenário: RF-09 — no modo automático só a primeira PR espera por gente
    Dado que a esteira opera em modo automático
    Quando a Pull Request "PR - feature/nome-curto -> develop" é mergeada por um proprietário
    Então as Pull Requests seguintes da cadeia são mergeadas pela própria esteira
    Mas a primeira Pull Request não é mergeada pela esteira em nenhuma hipótese

  @esteira
  Cenário: RF-09 — a marcação na PR de feature força o modo manual
    Dado que a configuração do repositório define o modo automático
    E que a Pull Request de feature recebeu a marcação de modo manual
    Quando a Pull Request "PR - develop -> release/vX.Y.Z" é aberta
    Então a esteira aguarda merge humano antes de prosseguir
    Mas a esteira não mergeia essa Pull Request sozinha

  @esteira
  Cenário: RF-09 — sem configuração nem marcação vale o modo automático
    Dado que o repositório não define modo algum e a Pull Request não tem marcação
    Quando a esteira decide como tratar os merges da cadeia
    Então ela opera em modo automático
    Mas ela registra no resumo da execução qual modo está em vigor
