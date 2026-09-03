# language: pt
Funcionalidade: O Discord na vitrine
  Para que quem chega pelo sítio consiga falar com quem escreveu o código
  Como visitante que nunca entrou no servidor
  Quero entender o espaço antes de entrar nele

  @comunidade
  Cenário: RF-01 e RF-08 — o canal de conversa deixa de faltar
    Dado que o servidor da Byte Union existe e tem convite permanente
    Quando eu abro qualquer página do sítio
    Então o Discord aparece entre os canais de contato oferecidos
    Mas nenhum canal declarado como pendente é oferecido ao visitante

  @comunidade
  Cenário: RF-02 e RF-10 — convite inválido reprova a publicação
    Dado que o endereço do Discord está ausente, vazio ou não é um convite do Discord
    Quando a vitrine é construída
    Então a construção reprova nomeando o endereço recebido e o formato esperado
    Mas nenhum sítio com ligação inválida é publicado

  @comunidade @navegador
  Cenário: RF-03 e RF-09 — a explicação está a um clique de qualquer página
    Dado que eu estou na página inicial do sítio
    Quando eu procuro como falar com os autores
    Então eu chego à página "/comunidade" pelo menu principal
    E eu chego à mesma página pelos canais de contato do rodapé
    Mas eu não sou levado direto para fora do sítio sem entender onde estou entrando

  @comunidade @navegador
  Cenário: RF-04 e RF-13 — a página descreve o servidor canal a canal
    Dado que eu nunca entrei no servidor
    Quando eu leio a página da comunidade
    Então cada canal público aparece pelo nome, com uma linha dizendo a que serve
    Mas as salas de voz não ficam de fora da descrição

  @comunidade @navegador
  Cenário: RF-05 — onde eu posso falar fica explícito
    Dado que eu quero escrever algo
    Quando eu leio a página da comunidade
    Então eu sei quais canais são somente leitura e por quê
    Mas eu não descubro isso só ao tentar escrever e ser impedido

  @comunidade @navegador
  Cenário: RF-06 — o que é do GitHub vai para o GitHub
    Dado que eu quero propor uma mudança de código
    Quando eu leio a página da comunidade
    Então ela me dirige ao GitHub para proposta, defeito e discussão de código
    Mas ela não me convida a abrir esse assunto no Discord

  @comunidade @navegador
  Cenário: RF-07 e RF-14 — o espaço fechado é citado sem ser exposto
    Dado que eu sou visitante e não faço parte da Byte Union
    Quando eu leio a página da comunidade
    Então eu entendo que existe uma área de trabalho fechada dos colaboradores
    Mas eu não leio o nome nem o conteúdo dos canais dessa área

  @comunidade
  Cenário: RF-11 — a página é arquivo estático como as demais
    Dado que a vitrine foi construída
    Quando a página da comunidade é servida ao visitante
    Então ela chega pronta no arquivo publicado
    Mas nenhuma parte do texto depende de dado buscado na visita

  @comunidade @navegador
  Cenário: RF-15 — cada trecho tem sua ilustração
    Dado que eu leio a página da comunidade
    Quando eu percorro a explicação da estrutura, dos canais e do fórum
    Então cada um desses trechos tem uma captura do servidor ao lado
    Mas nenhuma dessas imagens vem de servidor de terceiro

  @comunidade
  Cenário: RF-16 — a captura não expõe o que é fechado
    Dado que existe uma área de trabalho fechada
    Quando as capturas publicadas são conferidas
    Então nenhum canal da área fechada é nomeado no que a vitrine publica
    Mas a existência da área fechada continua dita no texto

  @comunidade @navegador
  Cenário: RF-17 e RF-19 — quem não vê a imagem não perde informação
    Dado que eu uso leitor de tela
    Quando eu percorro a página da comunidade
    Então cada imagem me diz o que mostra, e a legenda acrescenta em vez de repetir
    Mas nenhuma informação existe somente dentro da imagem

  @comunidade
  Cenário: RF-18 e RNF-07 — imagem é arquivo nosso, e leve
    Dado que a vitrine construída inclui as capturas
    Quando o peso das imagens da página é medido
    Então a soma delas não passa de 50 KB e nenhuma passa de 25 KB
    Mas toda imagem é servida do próprio sítio
