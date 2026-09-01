# Checklist — Esteira de entrega contínua / Segurança

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Credencial

- [ ] RF-20 exige que a credencial dedicada tenha **apenas as permissões necessárias**, e o documento não deixa a lista dessas permissões implícita
- [ ] Está escrito que a credencial é de build, vive no executor e nunca entra no artefato publicado — Princípio 7
- [ ] Está escrito o que a esteira faz quando a credencial está **ausente**: reprovar declarando a causa, e não seguir com a credencial padrão
- [ ] Está escrito o que a esteira faz quando a credencial está presente mas **sem permissão** para a operação — que é caso distinto do anterior
- [ ] A rotação ou expiração da credencial está considerada, ou declarada fora de escopo com consciência

## Autoridade e aprovação

- [ ] Está claro que a Pull Request de feature **nunca** é aprovada pela esteira, em nenhum modo — é o único portão humano garantido
- [ ] Está claro que a identidade que aprova automaticamente é distinta da que abriu a Pull Request, e por que isso é necessário
- [ ] Está escrito que a esteira não empurra direto para `develop` nem para `master`: toda integração passa por Pull Request
- [ ] O efeito de o modo automático existir sobre a proteção de branch está considerado — uma esteira que aprova a si mesma não deve conseguir contornar a proteção
- [ ] Está escrito quem pode mudar o modo de automático para manual, e se essa mudança é auditável

## Superfície publicada

- [ ] RNF-06 afirma zero segredos no artefato, e existe forma de verificar isso antes da publicação
- [ ] A esteira não publica a partir de fork nem aceita contribuição externa — está em *Fora de escopo* e é coerente com o resto
- [ ] Nenhum texto gerado pela esteira (corpo de Pull Request, release, resumo) pode conter valor de segredo
