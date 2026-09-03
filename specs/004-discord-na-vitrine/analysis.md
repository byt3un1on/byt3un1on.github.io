# Análise — O Discord na vitrine

> Etapa somente leitura. Não corrige: aponta e devolve à etapa dona.

## Rodada 1 — 2026-09-02

### Bloqueadores

Nenhum.

### Avisos

| # | Achado | Onde | Dona | Por que não bloqueia |
|---|---|---|---|---|
| A1 | Dois cenários dizem quase a mesma coisa: *"RF-07 — o espaço privado é citado sem ser exposto"* e *"RF-14 — a área fechada é citada, e só"*. Ambos afirmam que a existência aparece e o conteúdo não | `spec.md`, seção Critérios de aceite | specify | A redundância não gera código errado, só cenário repetido. `tasks.md` já os cobre numa tarefa só (T041), e a implementação pode fundi-los num cenário com os dois identificadores no título |
| A2 | RF-20 (capturas com a interface em português) não tem cenário automatizável: nenhum teste lê texto dentro de imagem | `spec.md` RF-20, `tasks.md` T023 | specify | A verificação é humana por natureza, e está declarada como tarefa explícita em vez de subentendida. Automatizá-la exigiria reconhecimento óptico de caracteres — dependência nova para verificar quatro arquivos |
| A3 | RF-16 é verificado por revisão humana (T018, T023) e afirmado por cenário (T045) que só consegue medir o que está declarado, não o conteúdo do pixel | `spec.md` RF-16 | specify | Mesmo caso de A2. O cenário afirma sobre o procedimento e sobre o texto da página; o pixel é conferido por gente, e o plano registra isso como risco com mitigação |
| A4 | O convite revogado no Discord não é detectado pela construção | `plan.md`, seção Riscos | plan | Já registrado como risco aceito, com a razão: seguir ligação externa em tempo de build introduz dependência de rede, contra a construção determinística |

### Confrontos verificados

| Confronto | Resultado |
|---|---|
| spec × constituição | Sem violação. RF-18 e RF-11 reforçam o Princípio 7; o convite publicado não é segredo — é endereço feito para ser público, e o Princípio 7 proíbe credencial, não endereço |
| plan × spec | Os vinte RF e os nove RNF aparecem em ao menos um arquivo do plano. Nenhum arquivo do plano existe sem requisito que o justifique |
| plan × constituição | Nenhum caminho fora de `app/`. `core` não importa `adapters` nem `infra`. Toda dependência injetada tem interface em `interfaces/`. `ioc_init.ts` segue isento de cobertura, como já era |
| tasks × plan | Os dezenove arquivos do plano têm tarefa. Nenhuma tarefa cria arquivo que o plano não previu |
| tasks × tasks | Nenhuma `[P]` da mesma fase compartilha arquivo. T005/T006 dependem de T002 e por isso não são `[P]`. As quatro capturas são arquivos distintos |
| tasks × spec | Os quinze cenários da spec têm tarefa (T035 a T048, com T041 cobrindo os dois cenários redundantes de A1) |

### Veredito

`ok` — implementar. Os quatro avisos são de redação e de limite do que máquina verifica; nenhum
impede começar, e A1 pode ser resolvido no ato de escrever o arquivo de cenários.
