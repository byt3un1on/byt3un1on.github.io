# Checklist — Vitrine de projetos da Byte Union / Dados

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Origem e autoridade do dado

- [ ] Está escrito que todo dado exibido nasce no catálogo obtido da API do GitHub da organização (`RF-02`)
- [ ] Está escrito o que a curadoria pode acrescentar — ordem, destaque, resumo, composição — e que ela não pode contradizer o repositório de origem
- [ ] A fronteira entre *dado do GitHub* e *texto editorial* é nítida o bastante para um revisor decidir de onde veio cada campo de um card

## Regras de inclusão e exclusão

- [ ] `RF-04` deixa claro que projeto não declarado na curadoria **não aparece**, sem exceção
- [ ] `RF-06` cobre os três casos de inelegibilidade — privado, arquivado, sem commit — e diz que valem mesmo contra declaração explícita da curadoria
- [ ] Está definido o que acontece quando a curadoria declara um repositório que **deixou de existir** na organização
- [ ] Está definido o que acontece quando a curadoria declara um repositório que **mudou de nome**
- [ ] `RF-05` deixa claro que entrada sem resumo **impede a publicação inteira**, e não apenas oculta aquele projeto

## Composição de projeto (`RF-07`)

- [ ] Está claro o que define o nome e o resumo de um projeto que agrupa vários repositórios, já que nenhum dos cinco `shortsmaker-*` tem descrição
- [ ] Está definida qual tecnologia principal um projeto multi-repositório exibe, quando os repositórios que o compõem têm linguagens diferentes
- [ ] Está definido qual sinal de atividade um projeto multi-repositório exibe, dado que seus repositórios têm datas diferentes
- [ ] Está definido se um mesmo repositório pode pertencer a mais de um projeto

## Integridade e ciclo de vida

- [ ] `RNF-08` fixa a defasagem máxima em 24 h e você aceita que um repositório novo possa ficar até um dia fora da vitrine
- [ ] `RF-14` deixa claro que catálogo parcial nunca é publicado, e que a versão anterior permanece no ar
- [ ] Está claro que o visitante não faz nenhuma requisição à API do GitHub (`RNF-08`), e que por isso "catálogo indisponível" não é erro de visitante
- [ ] Está definido o que a vitrine mostra para um projeto cujo repositório foi tornado privado **depois** da última publicação
