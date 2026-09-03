# Checklist — Português correto na vitrine / Requisitos

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Completude

- [ ] Os quatorze requisitos funcionais (RF-01 a RF-14) têm ao menos um critério de aceite em DADO/QUANDO/ENTÃO, ou estão declaradamente cobertos por outro requisito
- [ ] Os seis requisitos não funcionais (RNF-01 a RNF-06) têm número e unidade — nota, percentual, quilobyte
- [ ] As cinco páginas públicas estão nomeadas uma a uma nos requisitos, e nenhuma ficou de fora
- [ ] A seção Fora de escopo diz o que **não** é corrigido, e a razão de cada exclusão
- [ ] O esclarecimento 3 — código fica de fora, Markdown e telas entram — está refletido em Fora de escopo e nos requisitos, sem sobra

## Clareza

- [ ] Nenhuma marca `[NECESSITA ESCLARECIMENTO]` restante
- [ ] RF-12 deixa claro o que é "depende de codificação de caractere", com exemplos suficientes para decidir um caso novo sem perguntar
- [ ] A fronteira entre "texto de tela" e "arquivo de código" é decidível para um arquivo `.ts` que contém as duas coisas
- [ ] Nenhum requisito descreve implementação em vez de comportamento

## Consistência

- [ ] RF-10 (corrigir Markdown) não contradiz Fora de escopo, que exclui a constituição e o histórico já gravado
- [ ] RF-12 (não acentuar o que quebra) não contradiz RF-01 a RF-10 em nenhum caso concreto
- [ ] Nenhum requisito contradiz o Princípio 6 da constituição
- [ ] O documento usa um único termo para cada coisa: "diacrítico", "texto de tela", "prosa"

## Testabilidade

- [ ] Todo critério de aceite pode virar cenário executável sem reinterpretação
- [ ] O critério de RF-11 — remover os diacríticos e comparar — é executável com o dado que a spec fornece
- [ ] As métricas de sucesso são medíveis sobre o artefato construído, e não sobre intenção
