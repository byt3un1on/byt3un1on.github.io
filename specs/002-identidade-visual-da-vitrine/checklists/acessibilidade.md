# Checklist — Identidade visual da vitrine / Acessibilidade

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Cobertura das exigências

- [ ] `RNF-01` cobre texto normal (4,5:1) e texto grande (3:1), e a spec diz o que conta como grande
- [ ] `RNF-02` cobre elemento não textual — indicação de foco e limite de controle — no mínimo de 3:1
- [ ] `RF-05` proíbe distinção apenas por cor, atendendo ao critério WCAG de não depender de cor sozinha
- [ ] `RF-04` proíbe distinção apenas por texto, de modo que quem enxerga e quem usa leitor de tela recebam a mesma informação
- [ ] `RF-07` exige foco visível em **todo** elemento interativo, sem exceção declarada

## Riscos que a mudança visual introduz

- [ ] A decisão de tema escuro único está avaliada quanto a quem tem sensibilidade a fundo escuro, e a escolha está registrada com o motivo
- [ ] A fonte embutida está avaliada quanto ao efeito em quem usa tamanho de fonte aumentado no sistema
- [ ] `RNF-08` (movimento reduzido) cobre animação **e** transição, e não apenas animação
- [ ] A escala tipográfica fluida não impede o zoom de 200% exigido por WCAG 1.4.4
- [ ] O uso de caixa alta no metadado está avaliado quanto à leitura por leitor de tela

## Verificação

- [ ] A verificação automática de acessibilidade é invocada por cenário, e não apenas implementada
- [ ] Nenhuma página pública é dispensada da verificação
- [ ] A spec deixa claro que verificação automática não substitui o teste por teclado, que tem cenário próprio
