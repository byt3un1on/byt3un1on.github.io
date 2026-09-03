# Plano de implementação — O Discord na vitrine

> Descreve **como**. Deriva da spec e da constituição; não introduz requisito novo.

## Decisões técnicas

| Decisão | Escolha | Alternativas descartadas | Por quê |
|---|---|---|---|
| Onde mora a descrição do servidor | Constante de domínio única, `community_space_constants.ts`, tipada por categoria e canal | Texto solto no gabarito do componente; arquivo JSON em `data/` | RF-12 exige lugar único. Constante tipada dá ao compilador o poder de recusar canal sem propósito ou sem tipo, o que JSON não dá. E, ao contrário do catálogo, esta lista **não** vem de fonte externa: é decisão editorial nossa, e decisão nossa mora no código |
| Como o convite entra na vitrine | Constante, referenciada tanto pelo rodapé quanto pela página | Repetir o endereço nos dois lugares; variável de ambiente lida no build | RF-08 proíbe endereço duplicado. Variável de ambiente resolveria duplicação, mas esconderia no ambiente uma decisão pública que deve ser revisável por Pull Request |
| Onde o convite inválido reprova | Caso de uso chamado pelo comando do `make catalog`, que já é o passo que aborta publicação por dado declarado inválido | Alvo novo no Makefile só para esta checagem; validar na carga do módulo; confiar apenas no teste unitário | RF-10 pede reprovação na construção. `catalog` já roda antes do build em todo fluxo e já significa "dado declarado está íntegro". Alvo novo obrigaria a alterar os cinco fluxos; validar na carga do módulo faz o erro estourar em qualquer importação, inclusive em teste que não trata disso |
| Como o visitante chega à página | Rota `/comunidade` em `SITE_ROUTES`, entrando sozinha na prerenderização por `staticRoutes()` | Rota declarada direto em `web_routes.ts`; página fora do roteador | Toda ligação interna nasce de `SITE_ROUTES` — é a regra já escrita no próprio arquivo. E é `staticRoutes()` que alimenta `data/prerender-routes.txt`, então RF-11 sai de graça |
| Canal de contato interno × externo | `ReadyContactChannel` ganha `target: 'interno' \| 'externo'`; o rodapé decide entre `routerLink` e `href` por esse campo | Duas listas separadas; string com prefixo `/` como sinal | RF-09 exige que o rodapé leve à página **e** o Discord apareça entre os contatos. Inferir pelo formato do endereço é adivinhação; o campo declara. `check_links.sh` distingue interno de externo por `rel="noopener"`, e o campo mantém essa distinção verdadeira |
| Formato das imagens | PNG capturado, redimensionado para largura máxima de 952px, sem conversão | WebP; AVIF | `cwebp` não existe na imagem do serviço `dev` nem na máquina, e acrescentar dependência para poupar bytes que já cabem no RNF-07 contraria o Princípio 4. As quatro capturas somam 308 KB contra o teto de 400 KB |
| Como o texto e a imagem se mantêm coerentes | O texto de cada canal vem da constante; a imagem é arquivo estático conferido por olho humano na revisão | Gerar a imagem a partir da constante; captura automatizada por rotina | RF-15 exige captura **real** — imagem gerada seria desenho, exatamente o que o requisito recusa. Automatizar a captura exigiria a esteira entrar no Discord com credencial, contra o Princípio 7 e declarado fora de escopo |

## Padrões de projeto aplicados

| Padrão | Onde | Problema que resolve | Custo aceito |
|---|---|---|---|
| Tipo somado (união discriminada) | `ContactChannel`, já existente, estendido com `target` | Canal pronto e canal pendente têm campos diferentes; o compilador impede oferecer ao visitante um canal sem endereço | Cada novo estado obriga a revisitar os pontos de decisão — que é o efeito desejado |
| Objeto de valor imutável | `COMMUNITY_SPACE` congelado | Descrição do servidor não pode ser alterada em tempo de execução por engano | Nenhum relevante nesta escala |
| Caso de uso (Clean Architecture) | `ValidateCommunityInviteUseCase`, `DescribeCommunitySpaceUseCase` | Regra — o que é convite válido, o que o visitante pode ver — fica fora do componente e do comando, e ganha teste próprio | Duas classes para pouca lógica; aceito porque é a regra que o Princípio 2 manda isolar |

**Considerados e recusados:**

- **Strategy** para variar a renderização por tipo de canal (texto, voz, fórum): há três tipos, todos renderizados igual, com ícone diferente. Padrão sem variação de comportamento é cerimônia.
- **Repository** para a descrição do servidor: não há fonte de dados. Constante não precisa de repositório — precisaria se um dia viesse da API do Discord, e nesse dia o repositório entra.
- **Facade** sobre os dois casos de uso: dois é pouco para justificar fachada, e o container de injeção já resolve o acesso.

## Arquivos a criar ou alterar

| Camada | Arquivo | Ação | Teste espelhado |
|---|---|---|---|
| core/domain | `app/core/domain/models/community_channel_model.ts` | criar | `app/tests/unit/core/domain/models/community_channel_model.test.ts` |
| core/domain | `app/core/domain/constants/community_space_constants.ts` | criar | `app/tests/unit/core/domain/constants/community_space_constants.test.ts` |
| core/domain | `app/core/domain/errors/community_invite_error.ts` | criar | `app/tests/unit/core/domain/errors/community_invite_error.test.ts` |
| core/domain | `app/core/domain/constants/organization_constants.ts` | alterar | `app/tests/unit/core/domain/constants/organization_constants.test.ts` |
| core/domain | `app/core/domain/constants/site_routes_constants.ts` | alterar | `app/tests/unit/core/domain/constants/site_routes_constants.test.ts` |
| core/application | `app/core/application/community/validate_community_invite_use_case.ts` | criar | `app/tests/unit/core/application/community/validate_community_invite_use_case.test.ts` |
| core/application | `app/core/application/community/describe_community_space_use_case.ts` | criar | `app/tests/unit/core/application/community/describe_community_space_use_case.test.ts` |
| interfaces | `app/interfaces/core/application/community/i_validate_community_invite_use_case.ts` | criar | — |
| interfaces | `app/interfaces/core/application/community/i_describe_community_space_use_case.ts` | criar | — |
| adapters | `app/adapters/presenters/community/community-page.component.ts` | criar | `app/tests/unit/adapters/presenters/community/community-page.component.test.ts` |
| adapters | `app/adapters/presenters/layout/site-header.component.ts` | alterar | `app/tests/unit/adapters/presenters/layout/site-header.component.test.ts` |
| adapters | `app/adapters/presenters/layout/site-footer.component.ts` | alterar | `app/tests/unit/adapters/presenters/layout/site-footer.component.test.ts` |
| adapters | `app/adapters/commands/generate_catalog_command.ts` | alterar | `app/tests/unit/adapters/commands/generate_catalog_command.test.ts` |
| infra | `app/infra/init/web_routes.ts` | alterar | `app/tests/unit/infra/init/web_routes.test.ts` |
| infra | `app/infra/init/ioc_init.ts` | alterar | — (isento de cobertura: constrói serviços reais) |
| estático | `app/public/imagens/comunidade/estrutura.png` | criar | — |
| estático | `app/public/imagens/comunidade/canal-boas-vindas.png` | criar | — |
| estático | `app/public/imagens/comunidade/canal-anuncios.png` | criar | — |
| estático | `app/public/imagens/comunidade/canal-forum.png` | criar | — |
| config | `app/angular.json` | alterar | — |
| bdd | `app/tests/bdd/features/discord_na_vitrine.feature` | criar | — |
| bdd | `app/tests/bdd/steps/community/community_steps.ts` | criar | — |

## Contrato entre camadas

```
web_routes  ──►  CommunityPageComponent  ──►  IDescribeCommunitySpaceUseCase  ──►  COMMUNITY_SPACE
                        │                                                          (constante)
                        └──► SITE_ROUTES / CONTACT_CHANNELS  (endereços e convite)

GenerateCatalogCommand ──►  IValidateCommunityInviteUseCase  ──►  lança CommunityInviteError
        │                                                          (endereço ausente, vazio
        └──► código de saída 1, publicação abortada                 ou fora de discord.gg)
```

- O componente **não** conhece a constante: recebe do caso de uso a lista já filtrada, com a
  categoria fechada reduzida a nome (RF-07 e RF-14). Assim o segredo do que é privado é regra de
  domínio, e não disciplina de gabarito.
- O erro é tratado onde vira decisão: `CommunityInviteError` sobe até o comando, que o converte em
  código de saída — mesmo caminho que `CurationValidationError` já percorre.
- Nenhuma camada de `core` importa Angular, e nenhuma importa `adapters` ou `infra`.

## Dependências externas

| Dependência | Versão | Justificativa | Simulada nos testes por |
|---|---|---|---|
| — | — | Nenhuma dependência nova. As imagens são arquivos estáticos e a página usa apenas o que o Angular já traz | — |

## Impacto no contrato de operação

- **`make catalog` amplia o que verifica.** Hoje reprova por curadoria inválida; passa a reprovar
  também por convite de comunidade inválido. A frase que descreve o alvo em `CLAUDE.md` muda de
  "falha se a curadoria for inválida" para "falha se a curadoria ou o convite da comunidade forem
  inválidos". O alvo, os fluxos e a ordem de execução seguem iguais.
- **`app/public/` passa a existir**, declarada em `angular.json` como origem de arquivos estáticos.
  É a primeira pasta de mídia do projeto.
- **`make audit` cobre a página nova sem alteração**: `check_links.sh` varre todo HTML de
  `dist/browser`, e o Lighthouse recebe as rotas de `data/prerender-routes.txt`, que passa a
  incluir `/comunidade` por consequência de `staticRoutes()`.
- Nenhum alvo novo, nenhum serviço novo no compose, nenhuma variável de ambiente nova.

## Riscos

| Risco | Probabilidade | Mitigação |
|---|---|---|
| A captura envelhece: canal renomeado, e a foto passa a mostrar coisa que não existe | alta, no prazo de meses | O texto vem da constante e é conferido por cenário; a imagem é ilustração, e RF-19 garante que nada existe só nela. Divergência entre foto e texto vira defeito visível na revisão, não erro silencioso no ar |
| As quatro imagens empurram o Lighthouse de Desempenho abaixo de 90 | média | Largura fixa de 952px, dimensões declaradas (RNF-08) e carregamento adiado fora da primeira dobra. O portão da auditoria mede antes de publicar, e reprova antes de o visitante ver |
| Captura futura vazar canal privado ou servidor pessoal | média, por descuido humano | Procedimento escrito na tarefa: recolher `OFICINA`, conferir a barra lateral, recortar fora a coluna de servidores. Cenário de RF-16 afirma sobre o resultado, mas quem garante é a revisão — e isso está dito, não subentendido |
| Convite revogado no Discord sem ninguém mexer no repositório | baixa | O convite é permanente por configuração. Revogação continua invisível para a construção: `check_links.sh` não segue ligação externa, e seguir passaria a depender de rede em tempo de build. Risco aceito e registrado |

## Conformidade com a constituição

| Princípio | Como este plano o respeita |
|---|---|
| Contrato de operação | Nenhuma ferramenta chamada fora do `make`; a ampliação do `catalog` está declarada acima, e não contornada |
| Arquitetura limpa | Regra em `core` (constante, modelo, dois casos de uso); Angular só em `adapters`; `core` não importa `adapters` nem `infra`; toda injeção passa por interface em `interfaces/` |
| Testes provam a entrega | Todo arquivo de produção tem teste espelhado na tabela; cada critério de aceite da spec vira cenário em `app/tests/bdd/`; cobertura mínima de 90% por arquivo alterado |
| Simplicidade defensável | Nenhuma dependência nova, nenhum alvo novo, nenhum padrão sem problema presente — os três recusados estão registrados com o motivo |
| Autoria | Nenhum artefato desta feature credita ferramenta de IA |
| Idioma | Página, constante, cenários e capturas em português do Brasil (RNF-03 e RF-20) |
| Publicação estática | A página é prerenderizada por `staticRoutes()`; as imagens são arquivos nossos; o navegador do visitante não fala com o Discord (RF-11 e RF-18) |
| O catálogo deriva do GitHub | Intocado. A descrição da comunidade é editorial e não passa pelo catálogo |
| Acessibilidade e performance são medidas | RNF-01, RNF-02, RNF-07 e RNF-08 são medidos por `make audit` sobre o artefato construído, e o portão bloqueia a publicação |
