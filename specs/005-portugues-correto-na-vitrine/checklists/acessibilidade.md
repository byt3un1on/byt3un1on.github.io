# Checklist — Português correto na vitrine / Acessibilidade

> A justificativa mais forte da feature é o leitor de tela. Esta dimensão confere que a spec
> cobre o que só é percebido por quem depende dele.

## Cobertura do texto não visual

- [ ] A descrição alternativa de imagem está no escopo, com requisito próprio
- [ ] O rótulo acessível de lista e de navegação (`aria-label`) está no escopo
- [ ] A legenda de grupo de controles está no escopo
- [ ] A ligação de pular para o conteúdo está no escopo
- [ ] A região que anuncia o resultado do catálogo ao leitor de tela está coberta por algum requisito

## Medição

- [ ] A spec exige nota de Acessibilidade ≥ 90, nas cinco páginas, em perfil móvel
- [ ] A spec exige zero violações críticas ou sérias de WCAG 2.1 AA
- [ ] A spec exige que o idioma declarado continue `pt-BR`, que é o que faz o sintetizador escolher a voz certa

## Não regressão

- [ ] A spec exige que as notas fiquem iguais ou maiores às medidas antes da correção
- [ ] Nenhum requisito autoriza afrouxar limiar para acomodar o texto novo
