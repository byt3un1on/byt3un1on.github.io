# Checklist — Vitrine de projetos da Byte Union / Acessibilidade

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.
>
> **Revisado e aprovado pelo usuário em 2026-08-30.**

## Limiar declarado

- [x] `RNF-02` fixa **0** violação crítica ou séria de WCAG 2.1 AA, e você aceita esse limiar como bloqueante
- [x] `RNF-02` exige **100%** dos elementos interativos operáveis por teclado, sem exceção reservada
- [x] `RNF-09` fixa contraste de 4,5:1 e 3:1, e vale para o sítio inteiro, não só para o texto corrido
- [x] `RNF-01` inclui Acessibilidade entre as quatro categorias que não podem cair abaixo de 90

## Cobertura do que é verificado

- [x] Está claro que a verificação automática não é suficiente por si só, e que teclado e leitor de tela aparecem como exigência própria em `RNF-02`
- [x] O cenário *operação apenas por teclado* exige foco visível, e não só alcançável
- [x] O cenário *operação apenas por teclado* proíbe armadilha de foco
- [x] Está definido o comportamento acessível da restrição por tecnologia (`RF-11`): como o visitante de leitor de tela sabe que o resultado mudou
- [x] Está definido que o estado vazio de `RF-13` é anunciado, e não apenas desenhado

## Conteúdo e semântica

- [x] `RNF-07` fixa um idioma único, o que permite declarar o idioma da página sem ambiguidade
- [x] Está claro que ligação para repositório e ligação para endereço publicado (`RF-09`) precisam ser distinguíveis por quem lê só o nome acessível, fora do contexto visual
- [x] Está definido se as páginas de projeto exigem alguma imagem, e portanto se há texto alternativo a especificar
- [x] A página de erro (`RF-12`) tem exigência de ser navegável, e não apenas de existir

## Pendência aceita na aprovação — 2026-08-30

- **A spec não diz se as páginas de projeto exibem imagem.** Sem isso, não há texto alternativo
  especificado. Aprovado assim: se a implementação introduzir imagem, o texto alternativo passa
  a ser exigência de `RNF-02` e o `axe` reprova a ausência — o portão pega, mesmo sem requisito
  escrito.
