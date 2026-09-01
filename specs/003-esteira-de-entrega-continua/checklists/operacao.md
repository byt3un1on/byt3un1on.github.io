# Checklist — Esteira de entrega contínua / Operação

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Contrato de operação

- [ ] Os alvos novos (`pipeline`, `audit-only`, `bdd-only`) estão declarados no plano como extensão do contrato, e não como contorno dele
- [ ] Está afirmado que `audit` e `bdd` preservam comportamento externo idêntico ao delegarem a receita
- [ ] Está afirmado que `make validate` continua encadeando os mesmos sete alvos, na mesma ordem
- [ ] Nenhum requisito exige que um fluxo invoque ferramenta de linguagem direta — tudo passa por alvo do `Makefile`
- [ ] A montagem de `.github` no serviço `dev` está declarada como somente leitura, com o motivo escrito

## Ambiente e configuração

- [ ] As quatro variáveis novas estão nomeadas, com origem e propósito, e todas são lidas por um único ponto
- [ ] O valor padrão de cada variável ausente está escrito — em especial o de `ESTEIRA_MODO`
- [ ] Está escrito o que a esteira faz quando `GITHUB_STEP_SUMMARY` não existe, isto é, fora do executor do GitHub
- [ ] A mudança do modo de publicação do GitHub Pages está registrada como ato de configuração, com o risco de janela de indisponibilidade

## Reversibilidade e convivência

- [ ] A remoção de `publish.yml` está registrada junto com o que a substitui, e a necessidade que ela atendia (catálogo fresco em 24 h) continua atendida
- [ ] Está escrito o que acontece com uma cadeia em curso se alguém alterar o modo no meio dela
- [ ] A esteira é revertível por reversão de commit, sem migração de dado nem passo manual — ou o que exigir passo manual está nomeado
- [ ] Nenhum endereço público do sítio muda por causa desta feature

## Portões

- [ ] Todo portão da esteira é bloqueante, e isso está afirmado como requisito, não como intenção
- [ ] O limiar de cobertura (90%) e os limiares de auditoria (90 em quatro categorias) são os mesmos que o repositório já pratica — a esteira não os afrouxa nem os aperta
- [ ] Está escrito que reprovação em qualquer estágio impede publicação, e não apenas atrasa
