# Checklist — Esteira de entrega contínua / Requisitos

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Completude

- [ ] Os vinte requisitos funcionais (RF-01 a RF-20) têm ao menos um critério de aceite em DADO/QUANDO/ENTÃO
- [ ] Os oito requisitos não funcionais têm número e unidade — nenhum depende de adjetivo
- [ ] Os quatro estágios da esteira estão descritos: validação, promoção a develop, promoção a release, publicação em master
- [ ] O que a esteira faz quando **não há versão anterior alguma** está resolvido — hoje o repositório tem zero tags e zero releases
- [ ] O que acontece quando o push é feito em branch que **não** casa com `feature/**` está escrito, ou está deliberadamente fora de escopo
- [ ] A seção *Fora de escopo* nomeia a emissão da credencial dedicada como ato do proprietário, e não da feature

## Clareza

- [ ] Nenhuma marca `[NECESSITA ESCLARECIMENTO]` restante
- [ ] RF-09 não admite duas leituras sobre quem vence: a configuração do repositório ou a marcação na Pull Request
- [ ] RF-13 ("interromper a cadeia") e RF-05 ("não abrir nem avançar") não se sobrepõem a ponto de um tornar o outro supérfluo
- [ ] "Proprietário declarado" (RF-19) tem sentido único em todo o documento — não alterna com "owner", "colaborador" e "aprovador"
- [ ] Nenhum requisito nomeia ferramenta, ação de terceiro ou arquivo de fluxo: o *como* ficou no plano

## Consistência

- [ ] RF-14 (publicar o artefato verificado) não contradiz o Princípio 7 da constituição, que fala em servir a partir de `master`
- [ ] RNF-05 descreve a cadeia de dependência que o contrato de operação de fato tem — construção, depois auditoria, depois comportamento
- [ ] A correção registrada em *Correções posteriores ao esclarecimento* está refletida no requisito **e** no cenário, sem sobra da redação antiga
- [ ] RF-18 (publicação agendada permanece) não conflita com RF-08 (publicação por promoção): as duas publicam, e o documento diz por que ambas existem
- [ ] O vocabulário de estágio é o mesmo em requisito, cenário e métrica — "validação", "promoção", "publicação"

## Testabilidade

- [ ] Todo critério de aceite pode virar cenário executável sem reinterpretação de quem implementa
- [ ] Os cenários que afirmam sobre **forma** da esteira (RNF-01, RNF-02, RNF-05) são verificáveis lendo a definição, sem executar uma entrega inteira
- [ ] Os cenários que afirmam sobre **decisão** (RF-09, RF-10, RF-12, RF-15) são verificáveis sem depender do GitHub estar no ar
- [ ] Os três cenários de RF-10 cobrem os três incrementos — *major*, *minor* e *patch* — e nenhum depende de estado externo
- [ ] Todo caminho de erro relevante tem cenário próprio: cobertura baixa, formatação pendente, conflito de integração, credencial ausente, tempo esgotado
- [ ] Existe cenário para o caso de **push seguinte** na mesma branch, e ele afirma sobre não duplicar a Pull Request
