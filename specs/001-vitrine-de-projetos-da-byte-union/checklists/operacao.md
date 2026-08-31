# Checklist — Vitrine de projetos da Byte Union / Operação

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.
>
> **Revisado e aprovado pelo usuário em 2026-08-30.**

## Publicação

- [x] Está claro que a publicação é periódica e não manual, e que 24 h é o teto de defasagem (`RNF-08`)
- [x] `RF-14` define o comportamento em falha — abortar e preservar a versão anterior — e não apenas registrar o erro
- [x] Está definido **como você fica sabendo** que uma publicação foi abortada; sem isso, a vitrine congela em silêncio
- [x] Está definido se uma publicação abortada deve ser tentada de novo automaticamente, ou se espera intervenção
- [x] `RNF-10` fixa `byt3un1on.github.io` e exige ligações internas relativas, de modo que adotar domínio próprio depois não quebre endereço

## Contrato de operação

- [x] Os dois alvos novos do plano — `catalog` e `audit` — são reconhecidos como extensão do contrato, e você concorda em mantê-los
- [x] Está aceito que `make validate` passa a incluir `audit`, tornando a suíte mais lenta em troca de reprovar regressão de acessibilidade no ato
- [x] Está aceito que `make build` passa a depender de `make catalog`, e que por isso construir o sítio exige rede

## Segredos e exposição

- [x] Está claro que nenhum segredo pode entrar no artefato publicado, e que o artefato é público por construção
- [x] Você decidiu a pendência do Princípio 7: usar credencial de build que nunca entra no artefato, ou permanecer em acesso anônimo com o risco de limite por IP
- [x] Está claro que nenhum dado do visitante é coletado, e que as *Métricas de sucesso* não exigem instrumentação no sítio
- [x] Está definido que as ligações externas da vitrine — GitHub e Discord — apontam para destinos que você controla

## Manutenção

- [x] Está aceito que publicar um repositório novo na vitrine exige uma entrada de curadoria escrita à mão, e que sem ela o repositório não aparece
- [x] Está definido quem percebe, e como, que um repositório público ficou de fora da curadoria por esquecimento
- [x] Está aceito que o convite do Discord de `RF-10` é um endereço externo que pode expirar sem que nenhum teste detecte

## Pendências aceitas na aprovação — 2026-08-30

- **Publicação abortada não tem política de nova tentativa.** A spec define o aborto (`RF-14`) e
  o aviso (`RF-16`), mas não diz se o fluxo tenta de novo sozinho. Aprovado assim: sem nova
  tentativa automática, a próxima publicação agendada é a próxima chance, dentro das 24 h de
  `RNF-08`.
- **O endereço do grupo no Discord ainda não existe.** *(2026-08-31: modelado como canal
  `pending` em `app/core/domain/constants/organization_constants.ts`, com o motivo declarado.
  Não é renderizado enquanto estiver pendente, e o cenário de aceite de `RF-10` não passa até o
  convite existir — a falta é visível, não silenciosa.)* `RF-10` exige o canal, e a curadoria
  precisará de um convite sem prazo de validade antes da primeira publicação. Aprovado com a
  pendência registrada: sem o endereço, `RF-10` não fecha.
