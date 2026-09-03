# language: pt
Funcionalidade: Qualidade preservada pela mudança visual
  Para que a identidade não seja comprada com regressão
  Como responsável pela qualidade da entrega
  Quero que os limiares conquistados continuem medidos e verdes

  @navegador
  Cenário: RNF-01 e RNF-02 — contraste de texto e de elemento
    Dado que o sítio foi construído para publicação
    Quando a verificação automática de acessibilidade é executada
    Então nenhuma violação de contraste é encontrada
    Mas nenhuma página pública é dispensada da verificação

  @processo
  Cenário: RNF-05 — o peso da entrega permanece dentro do orçamento
    Dado que o sítio foi construído para publicação
    Quando o peso da entrega inicial é medido
    Então o peso total de nenhuma página pública excede 180 kB
    Mas ele permanece abaixo do teto de 300 kB

  @navegador
  Cenário: RNF-06 — o artefato não depende de domínio externo
    Dado que eu abro qualquer página pública do sítio
    Quando a página termina de carregar
    Então nenhuma requisição foi feita a domínio externo ao sítio
    Mas todos os recursos de que a página precisa foram servidos

  @navegador
  Cenário: RNF-08 — movimento reduzido é respeitado
    Dado que o meu sistema sinaliza preferência por movimento reduzido
    Quando eu abro qualquer página pública do sítio
    Então nenhuma animação ou transição de duração perceptível é executada
    Mas o conteúdo continua chegando completo

  @navegador
  Cenário: RNF-09 — a mudança visual não alterou o conteúdo
    Dado que o catálogo declara os projetos publicados
    Quando eu percorro o catálogo e as páginas de projeto
    Então cada nome, resumo, tecnologia e data exibido é idêntico ao do catálogo
    Mas nenhum texto de projeto passou a ser escrito em código de apresentação
