# Checklist — Vitrine de projetos da Byte Union / Operação

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Publicação

- [ ] Está claro que a publicação é periódica e não manual, e que 24 h é o teto de defasagem (`RNF-08`)
- [ ] `RF-14` define o comportamento em falha — abortar e preservar a versão anterior — e não apenas registrar o erro
- [ ] Está definido **como você fica sabendo** que uma publicação foi abortada; sem isso, a vitrine congela em silêncio
- [ ] Está definido se uma publicação abortada deve ser tentada de novo automaticamente, ou se espera intervenção
- [ ] `RNF-10` fixa `byt3un1on.github.io` e exige ligações internas relativas, de modo que adotar domínio próprio depois não quebre endereço

## Contrato de operação

- [ ] Os dois alvos novos do plano — `catalog` e `audit` — são reconhecidos como extensão do contrato, e você concorda em mantê-los
- [ ] Está aceito que `make validate` passa a incluir `audit`, tornando a suíte mais lenta em troca de reprovar regressão de acessibilidade no ato
- [ ] Está aceito que `make build` passa a depender de `make catalog`, e que por isso construir o sítio exige rede

## Segredos e exposição

- [ ] Está claro que nenhum segredo pode entrar no artefato publicado, e que o artefato é público por construção
- [ ] Você decidiu a pendência do Princípio 7: usar credencial de build que nunca entra no artefato, ou permanecer em acesso anônimo com o risco de limite por IP
- [ ] Está claro que nenhum dado do visitante é coletado, e que as *Métricas de sucesso* não exigem instrumentação no sítio
- [ ] Está definido que as ligações externas da vitrine — GitHub e Discord — apontam para destinos que você controla

## Manutenção

- [ ] Está aceito que publicar um repositório novo na vitrine exige uma entrada de curadoria escrita à mão, e que sem ela o repositório não aparece
- [ ] Está definido quem percebe, e como, que um repositório público ficou de fora da curadoria por esquecimento
- [ ] Está aceito que o convite do Discord de `RF-10` é um endereço externo que pode expirar sem que nenhum teste detecte
