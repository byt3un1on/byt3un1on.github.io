# Checklist — O Discord na vitrine / Acessibilidade

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Conteúdo não textual

- [ ] RF-17 exige texto alternativo em toda imagem, e diz o que ele deve descrever
- [ ] RF-17 impede que a legenda visível repita o texto alternativo — são leitores diferentes
- [ ] RF-19 garante que nenhuma informação existe somente na imagem (WCAG 1.1.1)
- [ ] A spec não pede imagem de texto: as capturas ilustram, e o texto correspondente está na página

## Navegação e estrutura

- [ ] RF-09 declara duas vias de chegada, e ambas são navegáveis por teclado
- [ ] A spec não introduz elemento que dependa de passar o ponteiro para revelar informação
- [ ] O idioma declarado da página é português do Brasil (RNF-03), inclusive nas capturas (RF-20)

## Medição

- [ ] RNF-01 fixa `axe` sem violação A ou AA, e Lighthouse Acessibilidade ≥ 90
- [ ] RNF-08 trata deslocamento de layout causado por imagem, com meta de zero
- [ ] RNF-09 exige legibilidade na largura de um telefone, sem ampliação
- [ ] A medição acontece sobre o artefato construído, e não sobre o código-fonte
