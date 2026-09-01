#!/bin/sh
# Serve o diretorio publicavel com um servidor de arquivos puro. Se o sitio
# funciona aqui, ele funciona no GitHub Pages — e o Principio 7 fica provado
# pela propria suite, sem teste adicional.
set -eu

DIST="${DIST_DIR:-dist/browser}"
PORT="${SERVE_PORT:-8080}"

if [ ! -d "$DIST" ]; then
  echo "erro: diretorio publicavel ausente: recebido '$DIST', esperado saida de 'make build'" >&2
  exit 1
fi

# A imagem nao tem procps, entao `pkill` nao existe: varrer /proc e o unico
# jeito portavel de derrubar o servidor. Sem isto o servidor sobrevive ao alvo,
# e o `make bdd` seguinte reaproveita um servidor velho sem avisar ninguem.
if [ "${1:-}" = "--stop" ]; then
  for entrada in /proc/[0-9]*; do
    pid="${entrada#/proc/}"
    cmd=$(tr '\0' ' ' < "$entrada/cmdline" 2>/dev/null || true)
    case "$cmd" in
      *http-server*) kill "$pid" 2>/dev/null || true ;;
    esac
  done
  exit 0
fi

if [ "${1:-}" = "--wait" ]; then
  npx http-server "$DIST" -p "$PORT" -s --silent &
  PID=$!
  # Espera o servidor aceitar conexao antes de devolver o controle.
  i=0
  while [ "$i" -lt 50 ]; do
    if curl -sf "http://127.0.0.1:$PORT/" >/dev/null 2>&1; then
      echo "servindo $DIST em http://127.0.0.1:$PORT (pid $PID)"
      exit 0
    fi
    i=$((i + 1))
    sleep 0.2
  done
  echo "erro: servidor nao respondeu em 10s na porta $PORT" >&2
  kill "$PID" 2>/dev/null || true
  exit 1
fi

exec npx http-server "$DIST" -p "$PORT" -s
