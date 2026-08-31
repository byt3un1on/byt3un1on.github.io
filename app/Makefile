# Contrato de operacao da vitrine. Nenhuma ferramenta de linguagem e invocada
# fora daqui, e todo alvo roda dentro do servico `dev` do compose.

.PHONY: infra init install build run test cover it bdd lint fmt validate \
        down ps logs catalog audit report

COMPOSE := docker compose
# A credencial de build e repassada por exec, e nao so na criacao do container:
# sem isso, quem exporta GITHUB_TOKEN depois de `make infra` cai no limite
# anonimo de 60 requisicoes por hora e a publicacao aborta.
DEV     := $(COMPOSE) exec -T -e GITHUB_TOKEN dev
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
bdd: build audit
	$(COMPOSE) up -d wiremock
	# Servidor de arquivos puro sobre o dist: se o sitio funciona aqui, funciona
	# no Pages, e o Principio 7 fica provado pela propria suite.
	$(DEV) sh -c 'sh scripts/serve_dist.sh --wait \
	  && NODE_OPTIONS=--experimental-transform-types npx cucumber-js $(if $(ARG),tests/bdd/features/$(ARG),tests/bdd/features) \
	    --import "tests/bdd/support/**/*.ts" --import "tests/bdd/steps/**/*.ts"; \
	  RC=$$?; pkill -f http-server || true; exit $$RC'

# Nao chama cucumber: a varredura axe vive em tests/bdd/steps/browser, sob o
# alvo bdd. Se audit a chamasse, os dois alvos se chamariam em circulo.
audit: build
	$(DEV) npx lhci autorun --config=lighthouserc.json
	$(DEV) sh scripts/check_links.sh

report:
	$(DEV) $(NODETS) main_report.ts $(ARG)

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
