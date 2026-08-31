# Imagem unica: a mesma que executa a aplicacao e que recebe os comandos do Makefile.
FROM node:24-bookworm-slim

# Os navegadores do Playwright ficam fora de /app para sobreviverem ao volume montado.
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    NODE_OPTIONS=--no-warnings

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates curl git jq make \
 && rm -rf /var/lib/apt/lists/*

# Chromium serve ao BDD, a varredura axe e ao Lighthouse.
RUN npx --yes playwright@1.62.1 install --with-deps chromium \
 && rm -rf /root/.npm

ENV CHROME_PATH=/ms-playwright

WORKDIR /app

# O servico sobe ocioso e recebe os comandos por docker compose exec.
CMD ["sleep", "infinity"]
