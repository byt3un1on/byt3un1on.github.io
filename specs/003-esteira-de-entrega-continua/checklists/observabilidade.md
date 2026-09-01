# Checklist — Esteira de entrega contínua / Observabilidade

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## O diagrama conta a história

- [ ] RNF-01 fixa um número de caracteres, e ele foi conferido contra a interface real do GitHub Actions — não estimado
- [ ] RNF-02 fixa um número de passos por job, e o limite não obriga a esconder etapa que deveria aparecer
- [ ] Os nomes de job propostos no plano formam um vocabulário coerente entre os cinco fluxos — a mesma etapa não muda de nome de um fluxo para outro
- [ ] Está escrito que uma etapa só aparece no diagrama se for job, e é por isso que a granularidade foi escolhida assim
- [ ] Quem olha o diagrama consegue distinguir **falhou** de **não executou porque o anterior falhou**

## O resumo responde antes do log

- [ ] RF-12 e RNF-08 dizem o que o resumo contém, e o limite de três linhas se aplica à **causa**, não ao resumo inteiro
- [ ] Está escrito que o resumo nomeia a etapa reprovada, e não apenas que houve reprovação
- [ ] Cada causa classificável (permissão, credencial, conflito) tem cenário que verifica a mensagem, e não só o código de saída
- [ ] O caso de cobertura reprovada exige que o **número medido** apareça, não apenas que ficou abaixo
- [ ] O caso de formatação reprovada exige que os **arquivos** apareçam, não apenas que há arquivos fora de formato
- [ ] Está escrito que o modo em vigor (automático ou manual) aparece no resumo da execução

## Estado da esteira

- [ ] Quem acompanha consegue responder "em que estágio a mudança está" sem abrir job — e a spec diz por qual meio
- [ ] Está escrito o que se vê quando a cadeia está **parada esperando aprovação humana**, que não é falha nem sucesso
- [ ] RNF-07 fixa tempo máximo, e o veredito de tempo esgotado é distinguível de falha de verificação
- [ ] A publicação agendada (RF-18) obedece às mesmas regras de legibilidade, e não fica como exceção opaca
