# Checklist — O Discord na vitrine / Operação

> Avalia a **qualidade da especificação**, não do código. `[x]` significa "requisito
> aprovado por revisor humano". O agente não se autoaprova.

## Portão de publicação

- [ ] RF-10 diz o que torna o convite inválido: ausente, vazio, ou fora do formato de convite do Discord
- [ ] A reprovação nomeia o valor recebido e o formato esperado, e não falha com erro genérico
- [ ] RNF-04 põe a página nova sob a verificação de ligações que já existe
- [ ] Nenhum requisito exige rede em tempo de construção para ser satisfeito

## Manutenção ao longo do tempo

- [ ] RF-12 garante que corrigir a descrição de um canal é uma edição só
- [ ] A spec declara que atualizar captura é ato humano, e diz por que não é automatizado
- [ ] Está claro o que acontece quando um canal descrito deixa de existir no servidor
- [ ] A ampliação do que `make catalog` verifica está declarada, e não escondida no código
