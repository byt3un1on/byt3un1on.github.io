# Checklist — Vitrine de projetos da Byte Union / Requisitos

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Completude

- [ ] Os 15 requisitos funcionais (`RF-01` a `RF-15`) têm ao menos um cenário em DADO/QUANDO/ENTÃO
- [ ] Os 10 requisitos não funcionais (`RNF-01` a `RNF-10`) têm número e unidade no critério
- [ ] A seção *Fora de escopo* está escrita e cobre o que você não quer nesta entrega
- [ ] A jornada completa do visitante prioritário — chegar, entender, percorrer, abrir o repositório, achar o contato — está coberta sem buraco entre um `RF` e o seguinte
- [ ] Não falta requisito para nada que a seção *Objetivo* promete
- [ ] `RF-01` diz o que a página inicial precisa comunicar, mas não fixa qual texto — a decisão editorial continua sua

## Clareza

- [ ] Nenhuma marca `[NECESSITA ESCLARECIMENTO]` restante
- [ ] Nenhum requisito admite duas leituras conflitantes
- [ ] Nenhum requisito descreve implementação em vez de comportamento observável
- [ ] "Sinal de atividade" em `RF-03` está claro o bastante para você saber o que espera ver num card
- [ ] "Resumo do que ele faz" em `RF-03` e `RF-05` tem extensão e tom que você consegue julgar como aceito ou recusado
- [ ] "Acima da dobra" em `RF-01` é critério que sobrevive à variação de altura de tela entre celular e monitor

## Consistência

- [ ] Nenhum requisito contradiz outro
- [ ] Nenhum requisito contradiz a constituição
- [ ] O vocabulário é estável: *projeto*, *repositório*, *curadoria* e *catálogo* significam a mesma coisa em todo o documento
- [ ] `RF-04` (inclusão explícita) e `RF-06` (exclusão automática) não se atropelam: está claro que `RF-06` é rede de segurança sobre `RF-04`, e não uma segunda porta de entrada
- [ ] As 12 linhas da tabela *Esclarecimentos* correspondem ao que você respondeu, e cada uma aponta para onde foi aplicada
- [ ] A decisão de não expor o método (esclarecimento 7) e a de manter `specs/` versionado nos repositórios não se contradizem na leitura de terceiro

## Testabilidade

- [ ] Todo cenário Gherkin pode virar teste executável sem reinterpretação
- [ ] Os cenários que citam repositórios reais — `shared-claude-plugin`, `niche-scout`, `documentation-site`, `templates-library`, os cinco `shortsmaker-*` — continuarão válidos se esses repositórios mudarem de estado, ou está aceito que o teste os simule
- [ ] Todo caminho de erro relevante tem cenário próprio: endereço inexistente (`RF-12`), restrição sem resultado (`RF-13`), falha de obtenção (`RF-14`), curadoria sem resumo (`RF-05`)
- [ ] Os blocos `Mas` dos cenários afirmam algo que de fato pode falhar, e não são só reforço retórico do `Então`

## Prioridade e valor

- [ ] `RF-11` (restrição por tecnologia) é o único marcado *desejável*, e você concorda que ele pode cair sem comprometer a entrega
- [ ] Nenhum requisito obrigatório existe apenas por simetria com outro
- [ ] As *Métricas de sucesso* medem o objetivo declarado, e não o esforço gasto
