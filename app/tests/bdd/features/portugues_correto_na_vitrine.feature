# language: pt
Funcionalidade: Português correto na vitrine
  Para que quem lê a vitrine encontre o português que ela declara falar
  Como visitante que chega pela busca ou pelo convite do Discord
  Quero ler texto acentuado conforme a norma do português do Brasil

  @idioma @navegador
  Cenário: RF-01 — a página inicial se apresenta em português correto
    Dado que o visitante abre a página inicial
    Então a página escreve "construímos" e "código"
    Mas a página não escreve "construimos" nem "codigo"

  @idioma @navegador
  Cenário: RF-02 — a página de projetos fala em português correto
    Dado que o visitante abre a página de projetos
    Quando ele restringe o catálogo a uma tecnologia que nenhum projeto usa
    Então a página escreve "critério" e "restrição"
    Mas a página não escreve "criterio" nem "restricao"

  @idioma @navegador
  Cenário: RF-03 — a página de um projeto fala em português correto
    Dado que o visitante abre a página de um projeto do catálogo
    Então a página escreve "Repositórios"
    Mas a página não escreve "Repositorios"

  @idioma @navegador
  Cenário: RF-04 — a página da comunidade explica o servidor em português correto
    Dado que o visitante abre a página da comunidade
    Então a página escreve "espaço", "código" e "organizado"
    E a descrição de cada canal público aparece acentuada como no domínio
    Mas a página não escreve "espaco", "codigo" nem "organizacao"

  @idioma @navegador
  Cenário: RF-05 — o endereço inexistente responde em português correto
    Dado que o visitante abre a página de endereço não encontrado
    Então a página escreve "Endereço não encontrado"
    Mas a página não escreve "Endereco nao encontrado"

  @idioma @navegador
  Cenário: RF-06 — cabeçalho e rodapé estão corretos em toda página
    Dado que o visitante abre qualquer página pública
    Então a página escreve "Pular para o conteúdo" e "Organização no GitHub"
    Mas a página não escreve "Pular para o conteudo" nem "Organizacao no GitHub"

  @idioma @navegador
  Cenário: RF-07 — o título da aba e a descrição chegam corretos
    Dado que o visitante abre a página da comunidade
    Então o título do documento escreve "Comunidade — Byte Union"
    E a descrição entregue aos buscadores escreve "o que há em cada canal"
    Mas a descrição entregue aos buscadores não escreve "o que ha em cada canal"

  @idioma @navegador
  Cenário: RF-08 — o leitor de tela recebe texto correto
    Dado que o visitante abre a página da comunidade
    Então toda imagem tem descrição alternativa preenchida
    Mas nenhuma descrição alternativa escreve "areas", "codigo" nem "publicacao"

  @idioma @navegador
  Cenário: RF-09 — a curadoria descreve os projetos em português correto
    Dado que o visitante abre a página de projetos
    Então o resumo de cada projeto aparece acentuado como na curadoria
    Mas a página não escreve "criacao", "sitio" nem "videos"

  @idioma
  Esquema do Cenário: RF-11 — a correção mexe na grafia e em nada mais
    Dado o texto publicado antes da correção "<antes>"
    Quando os diacríticos são removidos do texto publicado agora "<agora>"
    Então o resultado é idêntico ao texto anterior

    Exemplos:
      | antes                                        | agora                                        |
      | Endereco nao encontrado                      | Endereço não encontrado                      |
      | A pagina que voce procurou nao existe nesta vitrine. | A página que você procurou não existe nesta vitrine. |
      | Ver o repositorio                            | Ver o repositório                            |
      | Nenhum projeto atende ao criterio escolhido. | Nenhum projeto atende ao critério escolhido. |
      | Remover a restricao                          | Remover a restrição                          |
      | Pular para o conteudo                        | Pular para o conteúdo                        |
      | Organizacao no GitHub                        | Organização no GitHub                        |
      | Abrir o endereco publicado                   | Abrir o endereço publicado                   |
      | Repositorios                                 | Repositórios                                 |
      | Projeto nao encontrado                       | Projeto não encontrado                       |
      | Como o servidor e organizado                 | Como o servidor é organizado                 |
      | Por onde comecar                             | Por onde começar                             |
      | Onde voce pode escrever                      | Onde você pode escrever                      |
      | Um forum por projeto                         | Um fórum por projeto                         |
      | O que nao se resolve aqui                    | O que não se resolve aqui                    |
      | Topico com titulo, e nao mensagem solta.     | Tópico com título, e não mensagem solta.     |

  @idioma @navegador
  Cenário: RF-12 — o que depende de codificação continua em ASCII
    Dado que o visitante abre a página de projetos
    Então nenhuma rota pública declarada contém caractere acentuado
    E todo endereço interno da página está em ASCII
    Mas o resumo de cada projeto aparece acentuado como na curadoria

  @idioma @navegador
  Cenário: RF-14 — a vitrine continua declarando o idioma do Brasil
    Dado que o visitante abre qualquer página pública
    Então o documento declara o idioma "pt-BR"
