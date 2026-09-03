# Especificação — Português correto na vitrine

> Descreve **o quê** e **por quê**. Não descreve como implementar: sem nome de biblioteca,
> sem esquema de banco, sem assinatura de função.

## Problema

A vitrine é escrita em português do Brasil e declara `lang="pt-BR"`, mas o texto que o
visitante lê está sem acentuação. Não é um deslize isolado: das cinco páginas públicas,
**as cinco** trazem palavras erradas — "codigo", "pagina", "voce", "nao", "sao",
"organizacao", "endereco", "espaco", "forum", "anuncios", "criterio". Entre os componentes
de apresentação, o documento de entrada e o arquivo de curadoria há **109 ocorrências** de
palavras que exigem diacrítico e não o têm.

A prosa dos documentos em Markdown, ao contrário, foi escrita acentuada desde a feature 001:
a primeira medição acusou 217 ocorrências, mas a conferência palavra a palavra mostrou que
todas eram forma verbal correta sem acento — "pratica", "referencia", "anuncia" —, identificador
dentro de crase, ou citação do próprio defeito. RF-10 existe para exigir a conferência e
registrar o resultado, não porque haja erro conhecido lá.

O custo é direto e é reputacional. A vitrine existe para convencer um visitante técnico de
que a oficina faz trabalho cuidadoso; a primeira frase da página inicial diz "construimos
software de ponta a ponta" — e erra a própria palavra que promete cuidado. Quem chega pelo
Discord lê uma página de comunidade que escreve "Nosso espaco de conversa" e "Como o servidor
e organizado", onde "e" deveria ser "é". O erro contradiz a mensagem.

Há dano além do estético. O texto declarado como `pt-BR` chega ao leitor de tela sem os
acentos que definem a pronúncia: um sintetizador lê "e organizado" como conjunção, não como
verbo, e a frase muda de sentido para quem depende dele. Buscadores indexam a forma errada,
que não é a que ninguém procura.

> Este documento cita as formas erradas entre aspas — "codigo", "espaco", "nao" — para nomear
> o defeito. São citações do problema, e permanecem como estão.

## Objetivo

Toda palavra que o visitante lê nas páginas públicas, e toda prosa dos documentos em Markdown
do repositório, está grafada em português do Brasil correto, com os diacríticos que a norma
exige — sem que nada que dependa de codificação de caractere para funcionar seja tocado.

## Fora de escopo

- **Arquivos de código.** Comentários, docstrings, nomes de teste, código de passo BDD,
  mensagens de erro dirigidas a quem opera, comentários do `Makefile`, do `.gitignore` e dos
  workflows, e nomes de job que aparecem na interface da esteira. Ficam como estão, por
  decisão registrada no esclarecimento 3.
- **Tudo que pode quebrar por codificação**: identificador de código, nome de arquivo e de
  pasta, rota, `slug`, chave de dado, nome de branch, de alvo do `Makefile` e de job. Permanece
  sem acento por construção, e não por descuido.
- **Reescrever o conteúdo.** Corrige-se a grafia; não se muda o que a frase diz, seu tom nem
  seu tamanho. Uma frase malformulada continua como está — o defeito aqui é ortográfico.
- **Texto que vem da API do GitHub** — nome, descrição e linguagem de repositório. A origem é
  externa, e o Princípio 8 proíbe reescrever à mão o que o catálogo deriva.
- **Verificação automática de ortografia.** Não há alvo novo, nem passo novo na cadeia de
  validação: a feature corrige o que está errado e para aí, por decisão registrada no
  esclarecimento 2.
- **Histórico já gravado**: mensagens de commit anteriores, releases publicadas, corpo de PR
  já aberta. Reescrever histórico é proibido pela skill de entrega.
- **A constituição da organização** (`.specify/memory/constitution.md`). É gerada do template
  do plugin a cada execução, e correção feita ali é desfeita na geração seguinte.
- **Conteúdo do servidor no Discord.** As mensagens já publicadas lá são outra superfície,
  fora do repositório.
- **Tradução ou internacionalização.** A vitrine continua monolíngue.

## Personas e cenários de uso

**O visitante técnico** chega pela busca ou pelo convite do Discord e lê a página inicial em
dez segundos. É a leitura em que decide se este é um lugar sério. Espera texto sem erro de
grafia — não porque procure erros, mas porque um erro visível desqualifica o resto.

**A pessoa que usa leitor de tela** navega pelas mesmas páginas com o sintetizador em
português. Espera que a pronúncia corresponda à palavra, o que só acontece quando o
diacrítico está lá.

**Quem lê o repositório para decidir se contribui** abre o `README.md` e a especificação de
uma feature antes de abrir o código. Espera prosa correta onde a prosa é para gente, e aceita
sem estranhar que caminho de arquivo e identificador continuem em ASCII.

## Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | Todo texto exibido ao visitante na página inicial está grafado em português do Brasil correto, com diacríticos | obrigatório |
| RF-02 | Todo texto exibido ao visitante na página de projetos — incluindo o aviso de resultado vazio e o rótulo dos controles — está grafado corretamente | obrigatório |
| RF-03 | Todo texto exibido ao visitante na página de um projeto, inclusive a mensagem de projeto inexistente, está grafado corretamente | obrigatório |
| RF-04 | Todo texto exibido ao visitante na página da comunidade — títulos de seção, parágrafos, legendas e a descrição de cada categoria e de cada canal — está grafado corretamente | obrigatório |
| RF-05 | Todo texto exibido ao visitante na página de endereço não encontrado está grafado corretamente | obrigatório |
| RF-06 | O cabeçalho e o rodapé, presentes em todas as páginas, têm rótulos de navegação e nomes de canal grafados corretamente | obrigatório |
| RF-07 | O título e a descrição de cada página, entregues à aba do navegador e aos buscadores, estão grafados corretamente | obrigatório |
| RF-08 | Os textos que só o leitor de tela alcança — descrição alternativa de imagem, rótulo acessível de lista e de navegação, legenda de grupo de controles e a ligação de pular para o conteúdo — estão grafados corretamente | obrigatório |
| RF-09 | O texto editorial da curadoria, que a página de projetos exibe como resumo de cada projeto, está grafado corretamente | obrigatório |
| RF-10 | A prosa dos documentos em Markdown do repositório — `README.md`, o que houver em `docs/`, e as especificações, planos, tarefas, checklists e análises em `specs/` — está grafada corretamente | obrigatório |
| RF-11 | Nenhuma correção altera o sentido, o tom ou a extensão da frase: removidos os diacríticos do texto novo, ele é idêntico ao anterior | obrigatório |
| RF-12 | Nada que dependa de codificação de caractere recebe acento: identificador, nome de arquivo, rota, `slug`, chave de dado e nome de branch, de alvo e de job permanecem exatamente como estão | obrigatório |
| RF-13 | Os cenários de aceite que citam literalmente um texto de tela continuam citando o texto que a página de fato exibe | obrigatório |
| RF-14 | O idioma declarado pelo documento continua sendo o português do Brasil | obrigatório |

## Requisitos não funcionais

| ID | Requisito | Critério mensurável |
|---|---|---|
| RNF-01 | A correção não degrada a acessibilidade medida | Nota de Acessibilidade do Lighthouse ≥ 90 em perfil móvel, nas cinco páginas públicas |
| RNF-02 | A correção não degrada o desempenho medido | Nota de Desempenho do Lighthouse ≥ 90 em perfil móvel, nas cinco páginas públicas |
| RNF-03 | A correção não introduz violação de acessibilidade | Zero violações críticas ou sérias de WCAG 2.1 AA na verificação automática |
| RNF-04 | O peso das páginas permanece dentro do teto já acordado | Peso total ≤ 180 kB por página pública |
| RNF-05 | Os arquivos permanecem legíveis por toda a cadeia | Codificação UTF-8 em 100% dos arquivos alterados, com zero sequências inválidas |
| RNF-06 | A cobertura de teste não regride | Cobertura de linhas ≥ 90% em cada arquivo alterado, e a cadeia `make validate` verde ao fim |

## Critérios de aceite

Escritos em DADO / QUANDO / ENTÃO / MAS. Cada critério vira um cenário em
`app/tests/bdd/` sem tradução no meio.

```gherkin
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
```

## Ambiguidades

Nenhuma. As três marcas abertas na primeira redação foram respondidas na clarificação e estão
registradas abaixo.

## Esclarecimentos

| # | Pergunta | Resposta | Data |
|---|---|---|---|
| 1 | Além do texto das cinco páginas, o que mais entra na correção? | Entra o resumo editorial da curadoria — o visitante o lê na página de projetos — e a prosa dos documentos em Markdown do repositório | 2026-09-02 |
| 2 | A feature entrega um portão automático contra a regressão, ou só a correção de agora? | Só a correção. Sem alvo novo no `Makefile` e sem passo novo na cadeia de validação | 2026-09-02 |
| 3 | Os arquivos de código entram — comentários, nomes de teste, mensagens ao operador, esteira e `Makefile`? | Não. A correção alcança **os documentos em Markdown e as telas**. Onde o acento pode quebrar por codificação de caractere, o texto fica sem acento; onde o português é lido por gente, é acentuado | 2026-09-02 |

## Métricas de sucesso

- **Zero** ocorrências de palavra sem o diacrítico exigido no texto que as cinco páginas
  públicas exibem — medidas sobre o HTML construído, e não sobre o código-fonte.
- **Zero** ocorrências na prosa dos documentos em Markdown do repositório, preservadas as
  citações do próprio defeito e tudo que está dentro de bloco de código.
- As notas de Acessibilidade e Desempenho do Lighthouse permanecem **iguais ou maiores** às
  medidas antes da correção, nas cinco páginas.
- `make validate` **verde**, com a suíte inteira passando — nenhuma asserção afrouxada para
  acomodar o texto novo.
