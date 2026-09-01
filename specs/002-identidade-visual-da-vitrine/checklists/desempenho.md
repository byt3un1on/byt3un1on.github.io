# Checklist — Identidade visual da vitrine / Desempenho

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Orçamento

- [ ] O acréscimo de 60 kB do `RNF-05` está justificado, e o revisor concorda que a fonte embutida vale esse custo
- [ ] O total resultante (~126 kB) tem folga suficiente contra o teto herdado de 300 kB para crescimento futuro
- [ ] O orçamento conta a fonte, que é mídia acima da dobra, e não apenas o pacote inicial de código
- [ ] A medição do peso é feita por ferramenta que já reprova o portão, e não por script novo a manter

## Risco de regressão

- [ ] O risco de deslocamento de layout pela troca de fonte está identificado, com mitigação declarada
- [ ] O limiar de CLS ≤ 0,1 herdado da 001 continua valendo e continua medido
- [ ] O limiar de LCP ≤ 2,5 s herdado da 001 continua valendo e continua medido
- [ ] A nota de Performance ≥ 90 continua exigida em toda página pública, em perfil móvel
- [ ] `RNF-06` garante que nenhum recurso vem de domínio externo, eliminando latência de terceiro
