#!/bin/bash

set -e

DIR="$(dirname "$0")"

main() {
  clear_build_outdir
  build_migrations_into_build_outdir "$@"
  wait_for_mysql
  delete_migrations_in_mysql "$@"
  run_migrations_in_build_outdir
}

wait_for_mysql() {
  if docker compose ps | grep -q "mysql"; then
    "$DIR/mysql/wait-for-mysql.sh"
  fi
}

clear_build_outdir() {
  if ls migrations/*js &> /dev/null; then
    rm migrations/*js
  fi
}

build_migrations_into_build_outdir() {
  yarn build "$@"
}

delete_migrations_in_mysql() {
  FIRST=true

  for ARG in "$@"; do
    if [ "$FIRST" = "true" ]; then
      FIRST=false
    else
      MIGRATIONS="${MIGRATIONS}, "
    fi

    FILENAME="$(basename "$ARG")"
    MIGRATIONS="\"/${FILENAME%.*}\""
  done

  yarn mysql --execute "DELETE FROM migrations WHERE name IN ($MIGRATIONS)"
}


run_migrations_in_build_outdir() {
  yarn migrate:up
}

main "$@"
