# Checklist — O Discord na vitrine / Requisitos

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Completude

- [ ] Os vinte requisitos funcionais (RF-01 a RF-20) têm ao menos um critério de aceite em DADO/QUANDO/ENTÃO
- [ ] Os nove requisitos não funcionais têm número e unidade — nenhum depende de adjetivo
- [ ] A seção Fora de escopo nomeia o que não será feito, inclusive o que foi cogitado e recusado
- [ ] Cada persona da spec tem ao menos um requisito que atende à expectativa declarada dela

## Clareza

- [ ] RF-04 e RF-13 não se contradizem: um pede descrição por categoria e canal, o outro fixa a granularidade nominal
- [ ] RF-07 e RF-14 dizem a mesma coisa sobre a área fechada sem se sobrepor — um trata da distinção comunidade/colaborador, o outro da menção
- [ ] "Convite permanente" está definido pelo que o torna permanente (validade e limite de usos), e não só pelo adjetivo
- [ ] Quem lê RF-19 entende que a imagem ilustra, e nunca informa sozinha

## Consistência

- [ ] RNF-03 (tudo em português) e RF-20 (moldura das capturas em português) não deixam brecha para texto em inglês na página
- [ ] RF-08 (sem endereço duplicado) é compatível com RF-01 e RF-09, que exigem o Discord no rodapé e a página no cabeçalho
- [ ] RNF-05 (endereço estável) foi confrontado com a escolha de `/comunidade`, e não com `/discord`
- [ ] Nenhum requisito contradiz o Princípio 7 da constituição pedindo dado buscado na visita

## Testabilidade

- [ ] Todo critério de aceite pode ser verificado sem interpretar intenção — nenhum depende de "bonito" ou "claro"
- [ ] O critério de RF-16 é verificável por alguém que não capturou as imagens
- [ ] RNF-06 (duas linhas por canal, dois minutos de leitura) é medível no texto entregue
- [ ] RNF-07 (400 KB no total, 150 KB por imagem) é medível sobre o artefato construído
