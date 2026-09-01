# byt3un1on.github.io

> Identidade e princípios **deste** projeto. Este arquivo **é versionado** — é o que o time
> compartilha. Os princípios da organização ficam em `.specify/memory/constitution.md`, que o
> `/bu:constitution` gera a cada clone e o `.gitignore` mantém fora do git.

## Identidade

- **Projeto**: byt3un1on.github.io
- **Tipo**: frontend
- **Stack**: TypeScript + Angular (standalone components e signals), publicado como sítio estático prerenderizado no GitHub Pages
- **Domínio**: vitrine pública da Byte Union — expõe a oficina de projetos da organização para atrair o público-alvo dos autores.
- **Cobertura mínima acordada**: 90%

## Refinamentos dos princípios da organização

> Não são princípios novos: são o que os princípios da organização significam **neste**
> repositório. Vivem aqui porque a constituição em disco é regenerada do template e perderia
> este texto a cada clone.

### Princípio 1 — Contrato de operação

A cadeia de `make validate` deste projeto é `fmt` → `lint` → `test` → `cover` → `it` → `bdd` →
**`audit`**. A auditoria integra a cadeia porque o Princípio 9 a nomeia como a medição que
reprova o portão. Três alvos próprios se somam ao contrato da organização:

| Alvo | Obrigação |
|---|---|
| `make catalog` | monta o catálogo a partir da API do GitHub; falha se a curadoria for inválida |
| `make audit` | Lighthouse, `axe` e verificação de ligações sobre o `dist/browser` construído |
| `make report` | registra o desfecho da publicação abrindo ou encerrando a questão |

### Princípio 2 — Arquitetura limpa

**Mapeamento Angular.** O framework não dispensa as camadas, apenas nomeia parte delas: o
componente standalone é o `presenter` e vive em `adapters/presenters/`; todo acesso à rede é
`client` em `adapters/clients/`; a regra que decide o que a vitrine mostra é caso de uso em
`core/application/`; o modelo do projeto exposto é `core/domain/`. Componente que chama
`HttpClient` direto, ou que carrega regra de seleção/ordenação no template, viola este
princípio. O container de IoC é o sistema de injeção do próprio Angular, configurado em
`infra/init/`.

### Princípio 3 — Testes provam a entrega

A isenção de cobertura é **pela natureza do arquivo**, não pelo nome:

- Cobertura mínima de 90% por arquivo modificado. Ficam **fora da conta** o entrypoint e o
  inicializador — todo arquivo cujo trabalho é apenas **construir e ligar serviços reais**, sem
  regra de negócio própria: `main` e suas variantes por tempo de execução, o contêiner de IoC e
  suas variantes, e o inicializador de framework. A isenção é pela **natureza do arquivo**, não
  pelo nome: fiação que instancia dependência real não é mockável, e testá-la mede a si mesma.
  Quem invoca a isenção responde por provar que o arquivo não carrega decisão alguma — havendo
  regra, ela sai dali para uma camada testável antes de o arquivo ser isentado.

## Princípios específicos deste projeto

## Princípio 7 — Publicação estática

O artefato de deploy é HTML, CSS, JS e mídia estáticos, servidos pelo GitHub Pages. A **origem**
que o Pages serve — conteúdo de branch ou artefato produzido pela esteira de integração — é
decisão de operação, e não de princípio: o que este princípio exige é que o visitante receba o
conjunto de arquivos estáticos que foi construído e verificado, sem nada entre ele e o disco.

**Proibido**:

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

## Emendas

| Versão | Data | O que mudou |
|---|---|---|
| 1.0.0 | 2026-08-30 | Ratificação inicial: seis princípios da organização, cobertura em 90%, identidade do projeto (Angular + GitHub Pages) e três princípios específicos — publicação estática (7), catálogo derivado do GitHub (8) e acessibilidade/performance medidas (9). |
| 1.0.1 | 2026-08-30 | Redação. O Princípio 7 passa a distinguir credencial no artefato publicado (proibida) de credencial de build que nunca entra no artefato (permitida). O Princípio 1 acrescenta `audit` à cadeia do `make validate`. |
| 1.0.2 | 2026-08-31 | Redação. O Princípio 3 passa a definir a isenção de cobertura pela natureza do arquivo, em lugar da lista de dois nomes, e a exigir prova de que o arquivo não carrega decisão. |
| 1.0.3 | 2026-09-01 | Redação. O Princípio 7 deixa de prender a publicação à branch `master`; a origem que o Pages serve vira decisão de operação, e o princípio passa a exigir o que protege — artefato estático construído e verificado, sem runtime entre o visitante e o disco. Motivada pelo bloqueador B1 da análise da feature 003. |
| — | 2026-09-01 | Criação deste arquivo. Até aqui os princípios 7, 8 e 9 e os refinamentos acima viviam apenas na constituição em disco, que o `.gitignore` mantém fora do git — e por isso não sobreviviam a um clone. |
