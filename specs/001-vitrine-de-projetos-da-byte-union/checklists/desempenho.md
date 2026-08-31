# Checklist — Vitrine de projetos da Byte Union / Desempenho

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Limiares

- [ ] `RNF-03` fixa LCP ≤ 2,5 s e CLS ≤ 0,1, e você aceita perfil móvel com 4G simulada como a condição de medição
- [ ] `RNF-04` fixa ≤ 300 KB comprimidos para a primeira renderização, e a exclusão de "mídia abaixo da dobra" está clara o bastante para não virar escapatória
- [ ] `RNF-01` exige ≥ 90 em Performance, e você aceita que uma queda para 89 reprova a entrega
- [ ] Os limiares valem para **toda** página pública, e não apenas para a inicial

## Condições de medição

- [ ] Está definido em que estado o sítio é medido — construído para publicação, e não em modo de desenvolvimento
- [ ] Está claro que a medição roda sem intervenção manual, como exige o contrato de operação
- [ ] Está definido se a medição ocorre a cada mudança ou apenas antes de publicar, e você aceita o custo dessa frequência

## Consequências de desenho

- [ ] `RNF-08` exigir **0** requisição à API do GitHub pelo navegador é reconhecido como o que sustenta `RNF-03` — e você aceita a defasagem de até 24 h que isso implica
- [ ] `RNF-05` exigir ausência de rolagem horizontal a 320 px é compatível com a densidade de informação que você espera de um card de projeto
- [ ] Está aceito que o orçamento de 300 KB restringe fontes, imagens e qualquer recurso decorativo da página inicial
- [ ] Nenhum requisito de desempenho entra em conflito com `RNF-02`: nada será cortado da acessibilidade para ganhar nota
