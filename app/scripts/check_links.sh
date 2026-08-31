#!/bin/sh
# Duas afirmacoes sobre o sitio construido, medidas no HTML gerado:
#   RNF-10 — nenhuma ligacao interna e absoluta;
#   RNF-06 — toda pagina publica esta a no maximo 2 cliques da inicial.
set -eu

DIST="${DIST_DIR:-dist/browser}"
HOST="${SITE_HOST:-byt3un1on.github.io}"

if [ ! -d "$DIST" ]; then
  echo "erro: diretorio publicavel ausente: recebido '$DIST', esperado saida de 'make build'" >&2
  exit 1
fi

falhas=0

# --- RNF-10: ligacao interna absoluta e defeito -----------------------------
# Ligacao externa e marcada com rel="noopener" pelos componentes, e por isso e
# distinguivel da navegacao interna. A distincao importa: o endereco publicado
# de um projeto pode apontar para este mesmo host — e o caso da propria vitrine
# no catalogo — sem que isso seja navegacao interna escrita de forma absoluta.
absolutas=""
for arq in $(find "$DIST" -name '*.html'); do
  suspeitas=$(grep -o '<a[^>]*>' "$arq" 2>/dev/null \
    | grep -v 'rel="noopener"' \
    | grep -E "href=\"https?://$HOST" || true)
  [ -z "$suspeitas" ] || absolutas="$absolutas$arq\n"
done
absolutas=$(printf '%b' "$absolutas" | sed '/^$/d')
if [ -n "$absolutas" ]; then
  echo "RNF-10 REPROVADO — ligacao interna absoluta apontando para $HOST em:" >&2
  echo "$absolutas" | sed 's/^/  /' >&2
  falhas=$((falhas + 1))
else
  echo "RNF-10 ok — nenhuma ligacao interna absoluta"
fi

# --- RNF-06: alcance em no maximo 2 cliques ---------------------------------
# Extrai os href internos de um arquivo e devolve o caminho de rota normalizado.
rotas_de() {
  grep -oE 'href="/[^"#?]*"' "$1" 2>/dev/null \
    | sed -E 's/^href="//; s/"$//; s#/$##' \
    | sed 's#^$#/#' \
    | sort -u
}

# Traduz uma rota no arquivo html que a serve.
arquivo_de() {
  case "$1" in
    /) echo "$DIST/index.html" ;;
    *) echo "$DIST${1}/index.html" ;;
  esac
}

alcancadas="/"
fronteira="/"
nivel=0
while [ "$nivel" -lt 2 ]; do
  proxima=""
  for rota in $fronteira; do
    arq=$(arquivo_de "$rota")
    [ -f "$arq" ] || continue
    for destino in $(rotas_de "$arq"); do
      case " $alcancadas " in
        *" $destino "*) ;;
        *) alcancadas="$alcancadas $destino"; proxima="$proxima $destino" ;;
      esac
    done
  done
  fronteira="$proxima"
  nivel=$((nivel + 1))
done

# A pagina de erro nao entra na conta: por definicao ela e alcancada digitando
# um endereco que nao existe, e nao navegando. Exigir que a inicial aponte para
# ela inverteria o proposito dela.
ERRO="${ERROR_ROUTE:-/404}"

inalcancaveis=""
for arq in $(find "$DIST" -name 'index.html' | sort); do
  rota=$(printf '%s' "$arq" | sed "s#^$DIST##; s#/index.html\$##")
  [ -n "$rota" ] || rota="/"
  [ "$rota" != "$ERRO" ] || continue
  case " $alcancadas " in
    *" $rota "*) ;;
    *) inalcancaveis="$inalcancaveis $rota" ;;
  esac
done

if [ -n "$inalcancaveis" ]; then
  echo "RNF-06 REPROVADO — pagina publica a mais de 2 cliques da inicial:" >&2
  for r in $inalcancaveis; do echo "  $r" >&2; done
  falhas=$((falhas + 1))
else
  echo "RNF-06 ok — toda pagina publica alcancavel em ate 2 cliques"
fi

exit "$falhas"
