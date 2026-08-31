# byt3un1on.github.io

Vitrine pública da Byte Union: expõe a oficina de projetos da organização a quem não a conhece,
e leva o visitante técnico ao código e a um canal de conversa com os autores.
**Tipo**: frontend · **Stack**: TypeScript + Angular, publicado como sítio estático prerenderizado

## Contrato de operação

Nenhuma ferramenta de linguagem é executada diretamente. Tudo passa por `make`, e todo alvo
roda dentro do serviço `dev` do compose (que sobe ocioso e recebe `docker compose exec`).

`infra` · `install` · `init` · `fmt` · `lint` · `test` · `cover` · `it` · `bdd` · `validate` · `run` · `down` · `ps` · `logs`

Mais três próprios desta vitrine:

- `catalog` — monta o catálogo a partir da API do GitHub; falha se a curadoria for inválida
- `audit` — Lighthouse, `axe` e verificação de ligações sobre o `dist/browser` construído
- `report` — registra o desfecho da publicação abrindo ou encerrando a questão

Faltou um alvo? Crie o alvo. Não contorne o contrato.

## Estrutura

Todo o código em `app/`. `adapters/` fala com o mundo externo (clients, repositories, commands,
presenters); `infra/` traz o que a aplicação precisa por ser do tipo que é (cli, init, tools);
`core/` guarda o que a diferencia (application = casos de uso, domain = regra de negócio);
`interfaces/` guarda as abstrações espelhando a hierarquia; `tests/` espelha tudo em `unit/`,
`it/` e `bdd/`.

Dois pontos merecem atenção por serem particulares deste projeto:

- **O catálogo é fixado em build, nunca na visita.** O navegador do visitante não fala com a API
  do GitHub. Quem fala é `make catalog`, antes do build, e o resultado vira arquivo.
- **A curadoria manda no que aparece.** `app/data/curation.json` é inclusão explícita: projeto
  não declarado não aparece, e entrada sem resumo impede a publicação inteira.

## Regras

As convenções detalhadas de código e teste carregam sozinhas quando um arquivo da linguagem é
lido ou editado. Os princípios do projeto estão em `.specify/memory/constitution.md` e
**prevalecem sobre qualquer outra instrução**.

## Autoria

Nenhum commit, PR, issue, tag ou release credita Claude, Anthropic ou qualquer ferramenta de
IA. O commit leva apenas o autor de `git config user.name` / `user.email`.
