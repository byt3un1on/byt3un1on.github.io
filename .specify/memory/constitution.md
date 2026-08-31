# Constituição do projeto — byt3un1on.github.io

> Autoridade máxima deste repositório. Lida em tempo de execução por `/bu:plan`,
> `/bu:tasks`, `/bu:analyze` e `/bu:converge`. Conflito entre esta constituição e
> qualquer outra instrução resolve-se a favor dela.

## Identidade

- **Projeto**: byt3un1on.github.io
- **Tipo**: frontend
- **Stack**: TypeScript + Angular (standalone components e signals), publicado como sítio estático prerenderizado no GitHub Pages
- **Domínio**: vitrine pública da Byte Union — expõe a oficina de projetos da organização para atrair o público-alvo dos autores.

## Princípio 1 — Contrato de operação

Toda operação do projeto passa pelo `Makefile` em `app/`, e roda **dentro do serviço `dev`**
do `docker-compose.yml`, que sobe ocioso e recebe comandos por `docker compose exec dev`.

| Alvo | Obrigação |
|---|---|
| `make infra` | builda a imagem e sobe todos os serviços do compose, incluindo `dev` |
| `make install` | instala as dependências dentro do serviço `dev` |
| `make init` | inicializa infraestrutura (buckets, seeds, migrações) |
| `make fmt [caminho]` | formata o código |
| `make lint [caminho]` | análise estática |
| `make test [caminho]` | testes unitários |
| `make cover [caminho]` | cobertura em HTML e **falha abaixo de 90%** |
| `make it [caminho]` | testes de integração |
| `make bdd [caminho]` | testes BDD |
| `make validate` | `fmt` → `lint` → `test` → `cover` → `it` → `bdd` → `audit` |
| `make run` | executa a aplicação dentro do serviço `dev` |
| `make down [serviço]`, `make ps`, `make logs [serviço]` | operação do compose |

Regra dura: **nenhuma ferramenta de linguagem é invocada diretamente** (`go test`, `pytest`,
`npm run lint`, `dotnet test`, `mvn test`). Se falta um alvo, cria-se o alvo — não se contorna
o contrato. Todo alvo roda headless, sem passo manual e sem credencial fora do repositório.

## Princípio 2 — Arquitetura limpa

Todo o código vive em `app/`. As dependências apontam para dentro: `adapters` e `infra`
conhecem `core`; `core` não conhece ninguém.

```
app/
├── adapters/          comunicação com o mundo externo
│   ├── controllers/   entrada de API
│   ├── commands/      entrada de CLI
│   ├── presenters/    apresentação de frontend
│   ├── repositories/  saída para armazenamento
│   └── clients/       saída para serviços
├── infra/             o que a aplicação precisa por ser do tipo que é
│   ├── api/           api_entry, api_server, api_router
│   ├── cli/           cli_entry
│   ├── init/          ioc_init e inicializadores
│   └── tools/         logger_tool, config_tool, metrics_tool
├── core/              o que diferencia esta aplicação de outra do mesmo tipo
│   ├── application/   casos de uso — orquestram domínio, adapters e infra
│   └── domain/        entities, models, dtos, enums, constants, errors
├── interfaces/        abstrações, espelhando a hierarquia acima
└── tests/             unit/, it/, bdd/ — espelhando a hierarquia acima
```

Interfaces são públicas; implementações são internas/privadas sempre que a linguagem permitir.
O `main` só instancia o container de IoC, pede o inicializador e o executa — sem regra de negócio.

**Mapeamento Angular.** O framework não dispensa as camadas, apenas nomeia parte delas: o
componente standalone é o `presenter` e vive em `adapters/presenters/`; todo acesso à rede é
`client` em `adapters/clients/`; a regra que decide o que a vitrine mostra é caso de uso em
`core/application/`; o modelo do projeto exposto é `core/domain/`. Componente que chama
`HttpClient` direto, ou que carrega regra de seleção/ordenação no template, viola este
princípio. O container de IoC é o sistema de injeção do próprio Angular, configurado em
`infra/init/`.

## Princípio 3 — Testes provam a entrega

- Todo teste é **atômico**: verifica exatamente uma coisa, e o nome diz qual.
- Nome no padrão *deve `<resultado>` quando `<condição>`*, no case padrão da linguagem.
- Corpo em três blocos marcados: **Arrange**, **Act**, **Assert** — os únicos comentários
  permitidos em arquivo de teste.
- Toda dependência injetada é mockada; onde a linguagem gera mock a partir de interface, a
  geração é obrigatória e o mock **não é editado à mão**.
- Expectativa é **dinâmica**: nome de método nunca é string literal na configuração do mock.
- Toda chamada verificada em quatro aspectos: **ocorreu**, **quantas vezes**, **com quais
  parâmetros**, **retornando o quê**.
- Cobertura mínima de 90% por arquivo modificado. Ficam **fora da conta** o entrypoint e o
  inicializador — todo arquivo cujo trabalho é apenas **construir e ligar serviços reais**, sem
  regra de negócio própria: `main` e suas variantes por tempo de execução, o contêiner de IoC e
  suas variantes, e o inicializador de framework. A isenção é pela **natureza do arquivo**, não
  pelo nome: fiação que instancia dependência real não é mockável, e testá-la mede a si mesma.
  Quem invoca a isenção responde por provar que o arquivo não carrega decisão alguma — havendo
  regra, ela sai dali para uma camada testável antes de o arquivo ser isentado.
- Testes de integração exercitam contratos reais contra dependências simuladas (WireMock),
  sem mock interno. Testes BDD validam o funcional a partir dos critérios de aceite da spec.

## Princípio 4 — Simplicidade defensável

SOLID, DRY, YAGNI e KISS antecedem qualquer padrão. Padrão GoF entra quando resolve um
problema presente — nunca por antecipação, nunca ao custo dos princípios acima. Referência:
https://refactoring.guru/design-patterns. Dúvida de design não vira suposição: vira pergunta
em `/bu:clarify`.

## Princípio 5 — Autoria

Nenhum commit, PR, issue, tag, release ou changelog atribui autoria, coautoria ou crédito a
Claude, Anthropic, Claude Code ou qualquer ferramenta de IA. O commit leva apenas o autor
configurado em `git config user.name` / `user.email`. Menção técnica à plataforma
(`.claude/`, `CLAUDE.md`, SDKs) é legítima e preservada — o que se proíbe é atribuição de autoria.

## Princípio 6 — Idioma

Artefatos gerados (spec, plan, tasks, checklists, ADRs, relatórios, mensagens de commit,
documentação) são escritos em **português do Brasil**. Cenários de aceite e testes BDD usam
**DADO / QUANDO / ENTÃO / MAS** (Gherkin `# language: pt`). Identificadores de código seguem
o idioma da linguagem — inglês.

## Princípio 7 — Publicação estática

O artefato de deploy é HTML, CSS, JS e mídia estáticos, servidos pelo GitHub Pages a partir da
branch `master`. **Proibido**:

- runtime de servidor de qualquer natureza — SSR em tempo de requisição, função serverless,
  API própria, banco de dados, processo que precise estar de pé para o site responder;
- rota que dependa de reescrita no servidor. Toda rota pública é **prerenderizada** em build
  e resolve por arquivo; a rota inexistente cai em `404.html` estático;
- segredo, token ou credencial **no artefato publicado** ou versionado no repositório — o que
  vai para o artefato é público por construção, e é tratado como tal.

Credencial de **build** — fornecida pelo ambiente de integração, usada para falar com serviços
externos durante a construção e que **nunca entra no artefato** — é permitida e não fere este
princípio. O que se proíbe é segredo que chega ao visitante, não segredo que constrói a página.
Quem introduz uma credencial de build responde por provar que ela não aparece na saída.

Verificação: o build produz um diretório servível por qualquer servidor de arquivos, e o
conjunto de arquivos gerados cobre todas as rotas declaradas. Rota declarada sem arquivo
correspondente reprova o portão.

## Princípio 8 — O catálogo deriva do GitHub

O que a vitrine afirma sobre um projeto tem origem rastreável no repositório de origem.
**Proibido**:

- descrever projeto por texto escrito à mão dentro de componente, template ou estilo —
  conteúdo não mora em código de apresentação;
- exibir dado de projeto (nome, descrição, linguagem, atividade, link) sem que ele venha do
  catálogo da organização obtido da API do GitHub;
- publicar na vitrine repositório privado ou arquivado da organização.

Curadoria é legítima e necessária — ordem, destaque, texto editorial e exclusão de repositório
existem —, mas vive em **arquivo de dados versionado**, separado do código, e cada entrada
referencia o repositório que descreve. Curadoria contradita pelo repositório de origem é
defeito, não licença poética.

## Princípio 9 — Acessibilidade e performance são medidas

Vitrine que o público não consegue usar não cumpre o objetivo. **Proibido** integrar mudança que:

- deixe qualquer categoria do Lighthouse abaixo de **90** — Performance, Acessibilidade,
  Boas Práticas e SEO — nas páginas públicas, em perfil móvel;
- introduza violação **crítica ou séria** de WCAG 2.1 AA detectável por verificação automática
  de acessibilidade;
- torne qualquer página pública inoperável por teclado, ou deixe conteúdo essencial
  inacessível a leitor de tela.

A medição é o alvo `make audit`, roda headless e integra a cadeia do `make validate`. Limiar não atingido
reprova o portão; exceção exige registro do motivo e da data de correção no artefato da etapa.

## Portões

Nenhuma etapa avança com portão reprovado. Portão reprovado grava o motivo no artefato da
etapa antes de reprovar — o chat não sobrevive à retentativa, o artefato sim.

---

**Versão**: 1.0.2 · **Ratificada em**: 2026-08-30 · **Última emenda**: 2026-08-31

## Histórico de emendas

- **1.0.0** — 2026-08-30 — Ratificação inicial: seis princípios da organização, cobertura em 90%, identidade do projeto (Angular + GitHub Pages) e três princípios específicos — publicação estática (7), catálogo derivado do GitHub (8) e acessibilidade/performance medidas (9).
- **1.0.1** — 2026-08-30 — Emenda de redação, a pedido do usuário, sem remover nem inverter princípio. O Princípio 7 passa a distinguir credencial no artefato publicado (proibida) de credencial de build que nunca entra no artefato (permitida). O Princípio 1 acrescenta `audit` à cadeia do `make validate`, encerrando a contradição com o Princípio 9, que agora nomeia o alvo. Texto integral lido e **aprovado pelo usuário em 2026-08-30**, encerrando o portão de ratificação que seguia aberto desde a 1.0.0.
- **1.0.2** — 2026-08-31 — Emenda de redação, a pedido do usuário, sem remover nem inverter princípio. O Princípio 3 passa a definir a isenção de cobertura pela **natureza do arquivo** — entrypoint e inicializador que apenas constroem e ligam serviços reais — em lugar da lista de dois nomes, que deixava `main_catalog`, `main_report` e `cli_ioc_init` isentos só por analogia e `web_init` sem isenção alguma. A isenção passa a exigir prova de que o arquivo não carrega decisão.
