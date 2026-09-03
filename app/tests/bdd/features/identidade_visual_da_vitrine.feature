# language: pt
Funcionalidade: Paleta e enquadramento da vitrine
  Para que a vitrine seja reconhecível como da Byte Union
  Como visitante que chega pela primeira vez
  Quero encontrar uma página que foi desenhada, e não uma página sem estilo

  @navegador
  Cenário: RF-01 — fundo escuro com texto claro
    Dado que eu abro qualquer página pública do sítio
    Quando a página termina de carregar
    Então o fundo é mais escuro que o texto que ele carrega
    Mas nenhuma página pública é servida com fundo claro

  @navegador
  Cenário: RF-02 — nenhuma cor fora do conjunto declarado
    Dado que o sítio declara um conjunto finito de cores
    Quando eu percorro todas as páginas públicas
    Então toda cor de texto, de fundo e de limite pertence a esse conjunto
    Mas nenhuma página introduz cor avulsa

  @navegador
  Cenário: RF-08 — o enquadramento é o mesmo em toda página
    Dado que eu percorro todas as páginas públicas do sítio
    Quando eu comparo o cabeçalho, o rodapé e o fundo de cada uma
    Então eles são idênticos entre todas as páginas
    Mas nenhuma página pública aparece com enquadramento próprio

  @navegador
  Cenário: RF-09 — a identidade não depende de imagem
    Dado que eu percorro todas as páginas públicas do sítio
    Quando a página termina de carregar
    Então nenhuma imagem decorativa, ilustração ou ícone é carregada como recurso
    Mas o sítio continua tendo aparência própria
