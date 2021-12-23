#!/bin/bash

set -e

function fetch_get_attributes {
  curl "http://localhost:3001/enmeshed/attributes?sessionId=$1" | jq
}

function fetch_init {
  TARGET=$(mktemp --suffix .png)

  if [ -n "$1" ]; then
    QUERY_STRING="?sessionId=$1&familyName=Musterfrau&givenName=Anna"
  fi

  curl -X POST "http://localhost:3001/enmeshed/init$QUERY_STRING" > "$TARGET"

  open "$TARGET"
}

function help {
  echo """USAGE: ./fetch.sh [COMMAND]

init [sessionId] – make call to /enmeshed/init and show QR-Code
get <sessionId>  – Get attributes of <sessionId>
help             – show this help"""
}

function open {
  if which open; then
    open "$1"
  elif which xdg-open; then
    xdg-open "$1"
  else
    firefox "$1"
  fi
}

case "$1" in
  help) help;;
  init) fetch_init "$2";;
  get) fetch_get_attributes "$2";;
  *) help;;
esac
