# Especificação — O Discord na vitrine

> Descreve **o quê** e **por quê**. Não descreve como implementar: sem nome de biblioteca,
> sem esquema de banco, sem assinatura de função.

## Problema

A vitrine existe para levar o visitante técnico ao código **e a um canal de conversa com os
autores**. Hoje ela cumpre metade: leva ao código, e não leva a conversa nenhuma.

O motivo está escrito no próprio repositório. O canal de contato do Discord está declarado como
**pendente**, com a razão `grupo ainda nao criado`, e por isso não é renderizado — uma escolha
deliberada, para que a falta fosse visível em vez de virar ligação morta no rodapé.

Essa razão deixou de valer: o servidor da Byte Union existe, tem estrutura por categoria, canais
com propósito escrito e regra de quem pode postar. A vitrine continua omitindo-o.

E há um segundo problema, que não se resolve com um link. Um convite jogado no rodapé entrega ao
visitante um servidor de treze canais sem dizer para que serve cada um, onde ele pode falar, onde
não pode, e o que esperar de resposta. Quem chega assim ou não escreve, ou escreve no lugar
errado — e nos dois casos a conversa que a vitrine deveria abrir não acontece.

O custo de não resolver: o único canal humano da organização permanece invisível para quem chega
pelo sítio, e a vitrine segue entregando código sem entregar gente.

## Objetivo

O visitante da vitrine encontra o Discord da Byte Union, entende **antes de entrar** como aquele
espaço funciona e onde a fala dele cabe, e entra por um convite que não expira.

Observável quando pronto: a partir de qualquer página do sítio é possível chegar a uma página que
explica o servidor, e dessa página ao servidor — sem que nenhuma dessas ligações dependa de
convite com prazo, e sem que a explicação descreva um servidor diferente do que existe.

## Fora de escopo

- **Administrar o servidor pelo sítio.** Criar canal, papel ou permissão continua sendo ato feito
  no Discord, por gente. A vitrine descreve, não opera.
- **Contagem de membros, presença ou qualquer dado vivo do Discord.** Buscar isso exigiria o
  navegador do visitante falar com um serviço externo, contra o Princípio 7, e o número
  desatualizado é pior que número nenhum.
- **Widget ou incorporação do Discord na página.** Ver acima: é conteúdo de terceiro carregado na
  visita. As capturas são arquivos nossos, servidos por nós — o oposto de incorporar.
- **Atualizar as capturas automaticamente.** Refazer a foto quando o servidor mudar é ato humano,
  não rotina da esteira: automatizar isso exigiria a esteira entrar no Discord com credencial.
- **Outros canais de contato** — correio eletrônico, redes sociais, formulário. Esta feature trata
  do Discord e da estrutura que já existe para declarar canais.
- **Regras de conduta da comunidade** como documento normativo. A página explica **como o espaço
  funciona**; código de conduta é decisão da organização e feature própria.
- **Publicar o convite em qualquer lugar fora da vitrine** (README, perfil da organização).

## Personas e cenários de uso

**Visitante técnico** — chegou pelo catálogo, viu um projeto que interessa e quer perguntar algo
a quem o escreveu. Não conhece a organização. Espera descobrir que existe um canal, entender em
trinta segundos se é o lugar certo para a pergunta dele, e entrar sem pedir permissão a ninguém.

**Pessoa que quer contribuir** — leu o código e quer propor mudança. Precisa saber se a conversa
acontece no Discord ou nas issues do GitHub, e o que se espera dela em cada um.

**Colaborador da Byte Union** — já está dentro. Usa a página como referência do combinado: em qual
canal entra o quê, o que é só leitura e por quê. É o texto que ele aponta para alguém novo em vez
de repetir a explicação.

**Quem mantém a vitrine** — precisa que a descrição do servidor e o servidor real não divirjam com
o tempo. Espera que o sítio falhe a publicação, e não publique mentira, quando a descrição
apontar para algo que deixou de existir.

## Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | O canal de contato do Discord deve deixar de estar **pendente** e passar a ser um canal com endereço, de modo que apareça onde os canais de contato prontos já aparecem hoje | obrigatório |
| RF-02 | O endereço do Discord usado pela vitrine deve ser o convite permanente **`https://discord.gg/fZ3sNap5vJ`** — criado com validade *Nunca* e usos *Sem limite*, porque convite que expira transforma a vitrine em ligação morta sem que ninguém perceba | obrigatório |
| RF-03 | O sítio deve ter uma **página pública que explica o servidor**, no endereço `/comunidade`: para que ele existe, como está organizado, o que se faz em cada espaço e o que se espera de quem chega | obrigatório |
| RF-04 | A página deve descrever a organização do servidor **por categoria e por canal**, dizendo de cada canal a que serve, em texto que quem nunca entrou entende | obrigatório |
| RF-05 | A página deve declarar explicitamente **onde o visitante pode escrever e onde não pode**, nomeando os canais somente-leitura e o motivo de serem assim | obrigatório |
| RF-06 | A página deve declarar o que **não** é assunto do Discord, dirigindo ao GitHub o que pertence ao GitHub (proposta de mudança, defeito, discussão de código) | obrigatório |
| RF-07 | A página deve distinguir o que vale para a **comunidade** do que vale para o **colaborador da Byte Union**, sem expor o conteúdo dos espaços privados | obrigatório |
| RF-08 | A página deve terminar em uma **ligação para entrar no servidor**, usando o mesmo endereço de RF-02, sem endereço duplicado no repositório | obrigatório |
| RF-09 | A página deve ser alcançável a partir de **qualquer página do sítio**, por duas vias: um item na **navegação principal do cabeçalho**, ao lado de "Projetos", e o convite entre os **canais de contato do rodapé** | obrigatório |
| RF-10 | A construção deve **reprovar** quando o endereço do Discord estiver ausente, vazio ou não for um convite do Discord — a vitrine não publica ligação inválida | obrigatório |
| RF-11 | A página deve ser **prerenderizada como as demais**, servida como arquivo estático, sem que o navegador do visitante fale com o Discord para montá-la | obrigatório |
| RF-12 | A descrição dos canais na página deve viver em **um único lugar declarado**, e não espalhada no texto, de modo que corrigir um canal seja uma edição só | obrigatório |
| RF-13 | A página deve descrever **canal a canal, nominalmente**, com uma linha por canal, incluindo as salas de voz — e não apenas as categorias | obrigatório |
| RF-14 | A página deve mencionar que existe uma **área de trabalho fechada dos colaboradores**, em uma frase, para explicar por que o visitante vê menos canais que um membro — sem listar esses canais nem seu conteúdo | obrigatório |
| RF-15 | Cada trecho da explicação deve ser ilustrado por **captura real do servidor**, e não por desenho ou reprodução: a imagem existe para mostrar que o espaço é real. No mínimo uma imagem para a estrutura de canais, uma para o canal de boas-vindas, uma para o de anúncios e uma para um fórum de projeto | obrigatório |
| RF-16 | Nenhuma captura pode conter **conteúdo da área privada**, a lista de servidores pessoais de quem capturou, ou dado pessoal de terceiro. A verificação disso acontece antes de a imagem entrar no repositório | obrigatório |
| RF-17 | Toda imagem deve ter **texto alternativo** que descreva o que ela mostra, e a legenda visível não pode repetir o texto alternativo — são leitores diferentes | obrigatório |
| RF-18 | As imagens devem ser servidas como **arquivos estáticos do próprio sítio**, nunca buscadas em servidor do Discord na visita | obrigatório |
| RF-19 | Nenhuma informação pode existir **somente na imagem**: tudo o que a captura mostra está também dito no texto da página, de modo que quem não vê imagem não perde nada | obrigatório |
| RF-20 | As capturas devem mostrar a interface do Discord **em português do Brasil**, e não apenas as mensagens: a moldura em inglês numa página em português entrega ao visitante brasileiro um "Welcome to" como primeira leitura | obrigatório |

## Requisitos não funcionais

| ID | Requisito | Critério mensurável |
|---|---|---|
| RNF-01 | Acessibilidade da página nova | `axe` sem violação de nível A ou AA; Lighthouse Acessibilidade ≥ 90 |
| RNF-02 | Desempenho da página nova | As quatro categorias do Lighthouse ≥ 90, medidas sobre o artefato construído. O teto de bytes por página sobe de 126 KB para 180 KB — calibrado quando o sítio era só texto, ele deixava 12 KB para imagem e tornava impossível qualquer página ilustrada. O Princípio 9 segue intocado |
| RNF-03 | Idioma | Todo o texto visível em português do Brasil, sem termo em inglês que tenha equivalente corrente |
| RNF-04 | Integridade das ligações | A verificação de ligações do `audit` cobre a página nova; zero ligação quebrada |
| RNF-05 | Endereço estável | O endereço público da página não muda depois de publicado; ligação externa a ela não quebra |
| RNF-06 | Legibilidade do texto | A explicação de cada canal cabe em **até duas linhas**; a página inteira é lida em até 2 minutos |
| RNF-07 | Peso das imagens | Soma de todas as imagens da página ≤ **50 KB**; nenhuma imagem individual acima de **25 KB**. O teto vem do portão que o projeto já media: o Lighthouse reprova página inteira acima de 126 KB transferidos, e o pacote inicial já consome a maior parte disso |
| RNF-08 | Estabilidade visual | Toda imagem declara largura e altura; deslocamento de layout atribuível a imagem igual a **zero** |
| RNF-09 | Legibilidade das capturas | Cada captura mostra **um assunto só** e é legível na largura de um telefone sem exigir ampliação |

## Critérios de aceite

Escritos em DADO / QUANDO / ENTÃO / MAS. Cada critério vira um cenário em
`app/tests/bdd/` sem tradução no meio.

```gherkin
# language: pt
Funcionalidade: O Discord na vitrine

  Cenário: RF-01 e RF-08 — o canal de conversa deixa de faltar
    Dado que o servidor da Byte Union existe e tem convite permanente
    Quando eu abro qualquer página do sítio
    Então o Discord aparece entre os canais de contato oferecidos
    Mas nenhum canal declarado como pendente é oferecido ao visitante

  Cenário: RF-02 e RF-10 — convite inválido reprova a publicação
    Dado que o endereço do Discord está ausente, vazio ou não é um convite do Discord
    Quando a vitrine é construída
    Então a construção reprova nomeando o endereço recebido e o formato esperado
    Mas nenhum sítio com ligação inválida é publicado

  Cenário: RF-03 e RF-09 — a explicação está a um clique de qualquer página
    Dado que eu estou em qualquer página do sítio
    Quando eu procuro como falar com os autores
    Então eu chego à página "/comunidade" pelo menu principal
    E eu chego à mesma página pelos canais de contato do rodapé
    Mas eu não sou levado direto para fora do sítio sem entender onde estou entrando

  Cenário: RF-13 — cada canal é nomeado e explicado
    Dado que eu nunca entrei no servidor
    Quando eu leio a página
    Então cada canal aparece pelo nome, com uma linha dizendo a que serve
    Mas as salas de voz não ficam de fora da descrição

  Cenário: RF-14 — a área fechada é citada, e só
    Dado que eu sou visitante e não faço parte da Byte Union
    Quando eu leio a página
    Então eu leio que existe uma área de trabalho fechada dos colaboradores
    Mas eu não leio o nome nem o conteúdo dos canais dessa área

  Cenário: RF-04 — a página descreve o servidor que existe
    Dado que eu nunca entrei no servidor
    Quando eu leio a página
    Então eu sei o que se faz em cada categoria e em cada canal descrito
    Mas nenhum canal descrito na página deixou de existir no servidor

  Cenário: RF-05 — onde eu posso falar fica explícito
    Dado que eu quero escrever algo
    Quando eu leio a página
    Então eu sei quais canais são somente leitura e por quê
    Mas eu não descubro isso só ao tentar escrever e ser impedido

  Cenário: RF-06 — o que é do GitHub vai para o GitHub
    Dado que eu quero propor uma mudança de código
    Quando eu leio a página
    Então ela me dirige ao GitHub para proposta, defeito e discussão de código
    Mas ela não me convida a abrir esse assunto no Discord

  Cenário: RF-07 — o espaço privado é citado sem ser exposto
    Dado que eu sou visitante e não faço parte da Byte Union
    Quando eu leio a página
    Então eu entendo que existe um espaço de trabalho dos colaboradores
    Mas eu não leio o conteúdo nem a lista de canais desse espaço

  Cenário: RF-11 — a página é arquivo estático como as demais
    Dado que a vitrine foi construída
    Quando a página é servida ao visitante
    Então ela chega pronta, sem o navegador falar com o Discord
    Mas nenhuma parte do texto depende de dado buscado na visita

  Cenário: RF-15 — cada trecho tem sua ilustração
    Dado que eu leio a página sobre a comunidade
    Quando eu percorro a explicação da estrutura, dos canais e do fórum
    Então cada um desses trechos tem uma captura real do servidor ao lado
    Mas nenhuma dessas imagens é desenho ou reprodução do Discord

  Cenário: RF-16 — a captura não expõe o que é fechado
    Dado que existe uma área de trabalho fechada e uma lista de servidores pessoais
    Quando as capturas da página são conferidas
    Então nenhuma delas mostra canal da área fechada nem servidor pessoal de ninguém
    Mas a existência da área fechada continua dita no texto

  Cenário: RF-17 e RF-19 — quem não vê a imagem não perde informação
    Dado que eu uso leitor de tela
    Quando eu percorro a página
    Então cada imagem me diz o que mostra, e a legenda acrescenta em vez de repetir
    Mas nenhuma informação existe somente dentro da imagem

  Cenário: RF-18 e RNF-07 — imagem é arquivo nosso, e leve
    Dado que a vitrine construída inclui as capturas
    Quando a página é servida
    Então toda imagem vem do próprio sítio, e a soma delas não passa de 400 KB
    Mas nenhuma imagem é buscada em servidor do Discord durante a visita

  Cenário: RNF-01 e RNF-02 — a página nova não rebaixa a medição
    Dado que a vitrine construída inclui a página do Discord
    Quando a auditoria de acessibilidade e desempenho é executada
    Então a página nova passa nos mesmos limites das demais
    Mas nenhuma violação de acessibilidade de nível A ou AA é aceita
```

## Ambiguidades

Nenhuma em aberto. Todas foram respondidas na etapa de clarificação.


## Esclarecimentos

| # | Pergunta | Resposta | Data |
|---|---|---|---|
| 1 | Qual é o endereço do convite permanente do servidor? | `https://discord.gg/fZ3sNap5vJ`, criado com validade *Nunca* e usos *Sem limite*. O convite padrão do Discord expira em 7 dias e transformaria a vitrine em ligação morta sem aviso. | 2026-09-02 |
| 2 | Qual o endereço público da página? | `/comunidade`. Descreve o propósito e não a ferramenta: se um dia a conversa sair do Discord, o endereço continua verdadeiro e nenhuma ligação externa quebra. | 2026-09-02 |
| 3 | A página entra na navegação principal ou fica só no rodapé? | Nas duas. Item no cabeçalho ao lado de "Projetos", e o convite entre os canais de contato do rodapé. É o único canal humano da organização; escondê-lo no rodapé contradiz o motivo de a vitrine existir. | 2026-09-02 |
| 4 | A página deve mencionar o espaço privado dos colaboradores? | Sim, em uma frase, sem detalhar. Explica por que o visitante vê menos canais que um membro, em vez de deixar isso como estranheza silenciosa. | 2026-09-02 |
| 7 | O teto de bytes por página impede as quatro capturas. Afrouxar o teto ou cortar imagens? | Elevar de 126 KB para 180 KB. O que reprovava não era o Lighthouse — Performance mede 100 e as quatro categorias passam —, e sim um teto escrito à mão, calibrado para um sítio sem imagem alguma. 180 KB fica 20 KB acima do peso atual: cabe a página ilustrada e continua barrando descuido. | 2026-09-02 |
| 6 | A interface do Discord nas capturas fica em inglês ou em português? | Em português. O idioma da conta foi trocado para Português do Brasil e as quatro capturas foram refeitas: a moldura em inglês numa página em português entregaria "Welcome to #boas-vindas!" como primeira leitura do visitante. | 2026-09-02 |
| 5 | A página lista os canais nominalmente ou só as categorias? | Nominalmente, canal a canal, com uma linha cada, salas de voz incluídas. É muito mais útil a quem chega, e o custo de envelhecer fica controlado porque a descrição vive num lugar só (RF-12). | 2026-09-02 |

## Métricas de sucesso

- **A falta declarada desaparece.** Hoje há exatamente um canal de contato pendente no
  repositório; depois desta feature, zero.
- **Nenhuma ligação morta.** A verificação de ligações cobre o convite e a página nova, e a
  publicação reprova antes de publicar endereço inválido — a medida é zero publicação com
  ligação quebrada.
- **A conversa começa no lugar certo.** Depois da adoção, mensagem de quem chega pela vitrine
  aparece em canal onde se pode escrever, e não em canal somente-leitura.
- **A medição não regride.** As quatro categorias do Lighthouse continuam ≥ 90 com a página nova
  no ar, e `axe` continua sem violação A ou AA.
