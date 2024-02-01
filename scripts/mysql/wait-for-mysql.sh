#!/bin/sh

WAIT_TIMEOUT=180

main() {
  START_TIMESTAMP=$(current_timestamp)

  while true; do
    if is_mysql_running; then
      break
    fi

    if test $(expr $(current_timestamp) - $START_TIMESTAMP) -gt $WAIT_TIMEOUT; then
      error "Timeout: The server has not be started"
    fi

    sleep 1
  done

  # After we can successfully connect to MySQL we need to wait a little bit
  # longer. Otherwise the GitHub workflows will break with a ConnectionError.
  sleep 3
}

current_timestamp() {
  date "+%s"
}

is_mysql_running() {
  docker compose exec -T mysql serlo-mysql \
    --execute="select id from uuid limit 1" > /dev/null 2>&1
}

error() {
  echo "$@" >&2
  exit 1
}

main
