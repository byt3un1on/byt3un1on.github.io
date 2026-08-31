# Contrato de operacao da vitrine. Nenhuma ferramenta de linguagem e invocada
# fora daqui, e todo alvo roda dentro do servico `dev` do compose.

.PHONY: infra init install build run test cover it bdd lint fmt validate \
        down ps logs catalog audit report

COMPOSE := docker compose
DEV     := $(COMPOSE) exec -T dev
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
	$(DEV) npx vitest run tests/it/$(ARG) --coverage.enabled=false

bdd: build
	$(COMPOSE) up -d wiremock
	$(DEV) npx cucumber-js $(if $(ARG),tests/bdd/features/$(ARG),)

audit:
	$(DEV) sh scripts/serve_dist.sh --wait
	$(DEV) npx lhci autorun --config=lighthouserc.json
	$(DEV) sh scripts/check_links.sh
	$(DEV) npx cucumber-js --tags @navegador --name "qualidade"

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
