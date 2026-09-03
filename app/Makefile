# Contrato de operacao da vitrine. Nenhuma ferramenta de linguagem e invocada
# fora daqui, e todo alvo roda dentro do servico `dev` do compose.

.PHONY: infra init install build run test cover it bdd lint fmt validate \
        down ps logs catalog audit report pipeline audit-only bdd-only

COMPOSE := docker compose
# A credencial de build e repassada por exec, e nao so na criacao do container:
# sem isso, quem exporta GITHUB_TOKEN depois de `make infra` cai no limite
# anonimo de 60 requisicoes por hora e a publicacao aborta.
# `gh` guarda a credencial em GH_TOKEN; a aplicacao le GITHUB_TOKEN
# (config_tool.ts). Sem esta ponte, a maquina tem token, o build nao recebe
# nenhum, e o catalogo cai no limite anonimo de 60 requisicoes por hora.
GITHUB_TOKEN ?= $(GH_TOKEN)
export GITHUB_TOKEN
DEV     := $(COMPOSE) exec -T -e GITHUB_TOKEN dev
# A esteira passa dado por ambiente, e nao por argumento: `make` quebra o
# argumento em espacos, e "Análise estática=success" viraria dois alvos.
# `GIT_DIR` aponta so o CLI da esteira para a historia montada em /gitdir — o
# `.git` mora na raiz do repositorio, um nivel acima de `app/`, e sem ele o
# calculo da versao nao enxerga etiqueta alguma. Fica aqui, e nao no compose,
# de proposito: definido para o servico inteiro, sequestraria tambem o `git`
# dos testes de integracao, que criam repositorios temporarios.
ESTEIRA := $(COMPOSE) exec -T -e GIT_DIR=/gitdir -e ESTEIRA_MODO -e ESTEIRA_MODO_ROTULO \
           -e ESTEIRA_RESULTADOS -e ESTEIRA_JOB -e ESTEIRA_STATUS \
           -e ESTEIRA_DETALHE -e ESTEIRA_RESUMO dev
# Expansao adiada com '=': com ':=' o $@ estaria vazio e o proprio alvo
# entraria no argumento (make fmt viraria 'prettier --write fmt').
ARG      = $(filter-out $@,$(MAKECMDGOALS))
DIST    := dist/browser
# O Node faz apagamento de tipos, nao transformacao: sem esta flag ele recusa
# propriedade de parametro no construtor, que e como a injecao e escrita aqui.
NODETS  := node --experimental-transform-types

infra:
	$(COMPOSE) build
	$(COMPOSE) up -d
	@$(MAKE) --no-print-directory install

init:
	$(DEV) mkdir -p data coverage
	# Catalogo vazio para o build resolver o import antes do primeiro make catalog.
	$(DEV) sh -c '[ -f data/catalog.generated.json ] || echo "{\"generatedAt\":\"1970-01-01T00:00:00.000Z\",\"projects\":[]}" > data/catalog.generated.json'
	$(DEV) sh -c '[ -f data/prerender-routes.txt ] || printf "/\n/projetos\n/404\n" > data/prerender-routes.txt'
	@echo "infraestrutura inicializada"

install:
	$(DEV) npm install --no-audit --no-fund

catalog:
	$(DEV) $(NODETS) main_catalog.ts

build: catalog
	$(DEV) npx ng build

run:
	$(DEV) npx ng serve

test:
	$(DEV) npx ng test $(if $(ARG),--include=tests/unit/$(ARG)/**/*.test.ts,)

cover:
	$(DEV) npx ng test --coverage $(if $(ARG),--include=tests/unit/$(ARG)/**/*.test.ts,)

it:
	$(COMPOSE) up -d wiremock
	# --no-file-parallelism: o WireMock e uma instancia so, e arquivos em
	# paralelo resetariam os stubs uns dos outros.
	$(DEV) npx vitest run tests/it/$(ARG) --coverage.enabled=false --no-file-parallelism

# Depende de audit porque o cenario de RNF-01 e RNF-03 afirma sobre o relatorio
# do Lighthouse que o audit produz. A dependencia e de dado, nao de gosto.
bdd: build audit-only
	@$(MAKE) --no-print-directory bdd-only

# Mesma receita de `bdd`, sem reconstruir nem reauditar: na esteira, construcao
# e auditoria ja rodaram em jobs proprios e o artefato chega baixado.
bdd-only:
	$(COMPOSE) up -d wiremock
	# Servidor de arquivos puro sobre o dist: se o sitio funciona aqui, funciona
	# no Pages, e o Principio 7 fica provado pela propria suite.
	$(DEV) sh -c 'sh scripts/serve_dist.sh --wait \
	  && NODE_OPTIONS=--experimental-transform-types npx cucumber-js $(if $(ARG),tests/bdd/features/$(ARG),tests/bdd/features) \
	    --import "tests/bdd/support/**/*.ts" --import "tests/bdd/steps/**/*.ts"; \
	  RC=$$?; sh scripts/serve_dist.sh --stop; exit $$RC'

# Nao chama cucumber: a varredura axe vive em tests/bdd/steps/browser, sob o
# alvo bdd. Se audit a chamasse, os dois alvos se chamariam em circulo.
audit: build
	@$(MAKE) --no-print-directory audit-only

# Mesma receita de `audit`, sem reconstruir: o comportamento externo de `audit`
# fica identico, e a esteira ganha como auditar o artefato que ja tem.
audit-only:
	# Relatorio antigo no diretorio faz o cenario de qualidade ler o pior de
	# todas as execucoes ja feitas, e nao a desta. Build passando parecia
	# reprovado por medicao de uma semana atras.
	$(DEV) sh -c 'rm -rf coverage/lighthouse .lighthouseci'
	$(DEV) npx lhci autorun --config=lighthouserc.json
	$(DEV) sh scripts/check_links.sh

report:
	$(DEV) $(NODETS) main_report.ts $(ARG)

# Subcomandos da esteira: version, mode, gate, summary. Silencioso de proposito
# — a saida e capturada por `$$(make -s pipeline version)` e redirecionada para
# o resumo da execucao, e eco de comando corromperia as duas coisas.
pipeline:
	@$(ESTEIRA) $(NODETS) main_pipeline.ts $(ARG)

lint:
	$(DEV) npx eslint $(if $(ARG),$(ARG),.)

fmt:
	$(DEV) npx prettier --write $(if $(ARG),$(ARG),.)

validate:
	@$(MAKE) --no-print-directory fmt
	@$(MAKE) --no-print-directory lint
	@$(MAKE) --no-print-directory test
	@$(MAKE) --no-print-directory cover
	@$(MAKE) --no-print-directory it
	@$(MAKE) --no-print-directory bdd
	@$(MAKE) --no-print-directory audit

down:
	$(COMPOSE) down $(ARG)

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f $(ARG)

# Absorve o caminho passado como segundo alvo (ex.: make test adapters/clients).
%:
	@:
