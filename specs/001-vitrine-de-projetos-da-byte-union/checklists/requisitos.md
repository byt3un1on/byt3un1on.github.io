# Checklist — Vitrine de projetos da Byte Union / Requisitos

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.
>
> **Revisado e aprovado pelo usuário em 2026-08-30.**

## Completude

- [x] Os 15 requisitos funcionais (`RF-01` a `RF-15`) têm ao menos um cenário em DADO/QUANDO/ENTÃO
- [x] Os 10 requisitos não funcionais (`RNF-01` a `RNF-10`) têm número e unidade no critério
- [x] A seção *Fora de escopo* está escrita e cobre o que você não quer nesta entrega
- [x] A jornada completa do visitante prioritário — chegar, entender, percorrer, abrir o repositório, achar o contato — está coberta sem buraco entre um `RF` e o seguinte
- [x] Não falta requisito para nada que a seção *Objetivo* promete
- [x] `RF-01` diz o que a página inicial precisa comunicar, mas não fixa qual texto — a decisão editorial continua sua

## Clareza

- [x] Nenhuma marca `[NECESSITA ESCLARECIMENTO]` restante
- [x] Nenhum requisito admite duas leituras conflitantes
- [x] Nenhum requisito descreve implementação em vez de comportamento observável
- [x] "Sinal de atividade" em `RF-03` está claro o bastante para você saber o que espera ver num card
- [x] "Resumo do que ele faz" em `RF-03` e `RF-05` tem extensão e tom que você consegue julgar como aceito ou recusado
- [x] "Acima da dobra" em `RF-01` é critério que sobrevive à variação de altura de tela entre celular e monitor

## Consistência

- [x] Nenhum requisito contradiz outro
- [x] Nenhum requisito contradiz a constituição
- [x] O vocabulário é estável: *projeto*, *repositório*, *curadoria* e *catálogo* significam a mesma coisa em todo o documento
- [x] `RF-04` (inclusão explícita) e `RF-06` (exclusão automática) não se atropelam: está claro que `RF-06` é rede de segurança sobre `RF-04`, e não uma segunda porta de entrada
- [x] As 12 linhas da tabela *Esclarecimentos* correspondem ao que você respondeu, e cada uma aponta para onde foi aplicada
- [x] A decisão de não expor o método (esclarecimento 7) e a de manter `specs/` versionado nos repositórios não se contradizem na leitura de terceiro

## Testabilidade

- [x] Todo cenário Gherkin pode virar teste executável sem reinterpretação
- [x] Os cenários que citam repositórios reais — `shared-claude-plugin`, `niche-scout`, `documentation-site`, `templates-library`, os cinco `shortsmaker-*` — continuarão válidos se esses repositórios mudarem de estado, ou está aceito que o teste os simule
- [x] Todo caminho de erro relevante tem cenário próprio: endereço inexistente (`RF-12`), restrição sem resultado (`RF-13`), falha de obtenção (`RF-14`), curadoria sem resumo (`RF-05`)
- [x] Os blocos `Mas` dos cenários afirmam algo que de fato pode falhar, e não são só reforço retórico do `Então`

## Prioridade e valor

- [x] `RF-11` (restrição por tecnologia) é o único marcado *desejável*, e você concorda que ele pode cair sem comprometer a entrega
- [x] Nenhum requisito obrigatório existe apenas por simetria com outro
- [x] As *Métricas de sucesso* medem o objetivo declarado, e não o esforço gasto

## Pendência aceita na aprovação — 2026-08-30

- **"Acima da dobra" em `RF-01` não tem definição mensurável.** A spec não fixa altura de
  referência, e o critério varia entre celular e monitor. Aprovado assim: a verificação fica a
  cargo do cenário BDD e do julgamento visual, não de um número. Se virar disputa na
  convergência, é aqui que se resolve.
