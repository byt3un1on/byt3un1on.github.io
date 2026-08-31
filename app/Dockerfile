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

# CHROME_PATH precisa apontar para o binario, e nao para o diretorio: o
# Lighthouse o executa direto, e um diretorio falha com EACCES. O caminho e
# resolvido no build porque carrega a versao do Chromium que o Playwright baixou.
RUN printf 'export CHROME_PATH=%s\n' "$(find /ms-playwright -name chrome -type f | head -1)" \
      > /etc/profile.d/chrome_path.sh \
 && ln -sf "$(find /ms-playwright -name chrome -type f | head -1)" /usr/local/bin/chrome
ENV CHROME_PATH=/usr/local/bin/chrome

WORKDIR /app

# O servico sobe ocioso e recebe os comandos por docker compose exec.
CMD ["sleep", "infinity"]
