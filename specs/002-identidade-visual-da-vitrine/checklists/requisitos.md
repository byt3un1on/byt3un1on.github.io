# Checklist — Identidade visual da vitrine / Requisitos

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Completude

- [ ] Os 10 requisitos funcionais têm ao menos um critério de aceite em DADO/QUANDO/ENTÃO
- [ ] Os 9 requisitos não funcionais têm critério mensurável, com número e unidade
- [ ] O que está fora de escopo está escrito, e cobre o que a feature poderia invadir por descuido: texto exibido, ordem dos projetos, rotas e o canal pendente
- [ ] A decisão de não escrever cenário para `RNF-03` e `RNF-04` está justificada no documento, e não apenas omitida
- [ ] A linha de base de 66,32 kB está registrada, para o acréscimo de 60 kB ser verificável e não uma promessa

## Clareza

- [ ] Nenhuma marca `[NECESSITA ESCLARECIMENTO]` restante
- [ ] "Fundo escuro com texto claro" (`RF-01`) é verificável sem julgamento de gosto — a spec define a verificação por luminância relativa, não por adjetivo
- [ ] "Visualmente distinguível" em `RF-04` e `RF-05` está amarrado a critério objetivo, e não deixado à impressão do revisor
- [ ] "Aparência padrão do navegador" (`RF-10`) está definido de modo que dê para decidir se um elemento viola
- [ ] Nenhum requisito descreve implementação em vez de comportamento — em especial, nenhum nomeia fonte, cor ou unidade de CSS

## Consistência

- [ ] `RF-04` (destaque não altera posição nem tamanho) não contradiz o teste da 001 que garante que o destaque não reordena
- [ ] `RF-02` (conjunto finito de cores) e `RF-01` (fundo escuro) descrevem a mesma paleta, sem exigir cores que o outro proíbe
- [ ] `RNF-05` (acréscimo de 60 kB) e `RNF-06` (zero requisição externa) são satisfazíveis ao mesmo tempo, sabendo que a fonte é servida pelo próprio sítio e conta no peso
- [ ] Nenhum requisito contradiz a constituição, em especial os Princípios 7, 8 e 9
- [ ] Os requisitos da 002 não afrouxam nenhum limiar já conquistado pela 001

## Testabilidade

- [ ] Todo critério de aceite pode virar cenário executável sem reinterpretação
- [ ] Os cenários que medem estilo computado dizem **o que** comparar, e não apenas que "deve ser diferente"
- [ ] `RNF-09` (conteúdo preservado) tem fonte de verdade declarada contra a qual comparar
- [ ] Nenhum cenário depende de julgamento estético humano para passar ou falhar
