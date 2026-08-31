# language: pt
Funcionalidade: Aprofundamento em um projeto
  Para que o visitante técnico chegue ao código em si
  Como visitante da vitrine
  Quero abrir um projeto e alcançar seus repositórios e seu endereço publicado

  @navegador
  Cenário: RF-08 — página própria por projeto
    Dado que estou no catálogo de projetos
    Quando eu abro um projeto do catálogo
    Então eu chego a uma página dedicada a esse projeto, com endereço próprio e estável
    E vejo o detalhamento do projeto e a ligação para o seu repositório
    Mas eu não sou levado para fora do sítio sem que eu tenha escolhido a ligação


  @navegador
  Cenário: RF-09 — endereço publicado é distinto do repositório
    Dado que o projeto exibido possui endereço publicado próprio além do repositório
    Quando eu abro a página desse projeto
    Então eu vejo duas ligações distintas e rotuladas: uma para o repositório e outra para o endereço publicado
    Mas as duas ligações não apontam para o mesmo destino


  @navegador
  Cenário: RF-15 — endereço direto funciona sem navegação prévia
    Dado que eu tenho o endereço da página de um projeto, recebido por terceiro
    Quando eu abro esse endereço diretamente, sem passar pela página inicial
    Então a página do projeto é exibida integralmente
    Mas eu não recebo erro de endereço não encontrado nem sou redirecionado à página inicial
