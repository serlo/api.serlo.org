#!/bin/bash

set -e

main() {
  clear_build_outdir
  build_migrations_into_build_outdir "$@"
  wait_for_mysql
  delete_migrations_in_mysql "$@"
  run_migrations_in_build_outdir
}

wait_for_mysql() {
  if docker compose ps | grep -q "mysql"; then
    "scripts/mysql/wait-for-mysql.sh"
  fi
}

clear_build_outdir() {
  MIGRATIONS_DIR="$PWD/packages/db-migrations/migrations/*js"
  if ls $MIGRATIONS_DIR &> /dev/null; then
    rm $MIGRATIONS_DIR
  fi
}

build_migrations_into_build_outdir() {
  yarn lerna --scope @serlo/db-migrations run build -- "$@"
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
