#!/bin/bash

if docker compose ps | grep -q "mysql"; then
  docker compose exec mysql serlo-mysql "$@"
elif which mysql; then
  mysql --password=secret --user=root --protocol=tcp serlo "$@"
else
  echo "MySQL may not be running via docker-compose in this directory, or the MySQL binary may not be installed" >&2
fi
