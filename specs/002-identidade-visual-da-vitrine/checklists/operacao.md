# Checklist — Identidade visual da vitrine / Operação

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Contrato de operação

- [ ] A feature não exige alvo novo no `Makefile`, e isso está afirmado no plano em vez de suposto
- [ ] A dependência nova da fonte está declarada, com versão fixada e licença registrada
- [ ] A consequência de `make install` passar a ser obrigatório está registrada, com a falha esperada de quem esquecer
- [ ] O aperto do limiar de peso no alvo `audit` está registrado como mudança de portão, e não escondido

## Publicação

- [ ] A fonte é servida pelo próprio artefato estático, sem runtime e sem domínio externo — Princípio 7
- [ ] A licença OFL-1.1 da fonte é preservada como o upstream a distribui
- [ ] Nada nesta feature altera o processo de montagem do catálogo nem o formato da curadoria

## Reversibilidade

- [ ] A mudança é revertível por reversão de commit, sem migração de dado nem passo manual
- [ ] Nenhum endereço público muda, de modo que nenhuma ligação externa existente quebra
