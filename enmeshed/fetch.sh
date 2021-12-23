#!/bin/bash

set -e

function set_attribute() {
  curl -X POST \
    "http://localhost:3001/enmeshed/attributes?sessionId=$1&name=$2&value=$3" | jq
}

function get_attributes() {
  curl "http://localhost:3001/enmeshed/attributes?sessionId=$1" | jq
}

function init() {
  TARGET=$(mktemp --suffix .png)

  if [ -n "$1" ]; then
    QUERY_STRING="?sessionId=$1&familyName=Musterfrau&givenName=Anna"
  fi

  curl -X POST "http://localhost:3001/enmeshed/init$QUERY_STRING" > "$TARGET"

  open "$TARGET"
}

function help() {
  echo """USAGE: ./fetch.sh [COMMAND]

init [sessionId]               – make call to /enmeshed/init and show QR-Code
get <sessionId>                – Get attributes of <sessionId>
set <sessionId> <name> <value> – Set attribute <name> of <sessionId> to <value>
help                           – show this help"""
}

function open() {
  if which open; then
    open "$1"
  elif which xdg-open; then
    xdg-open "$1"
  else
    firefox "$1"
  fi
}

case "$1" in
  help) help ;;
  init) init "$2" ;;
  get) get_attributes "$2" ;;
  set) set_attribute "$2" "$3" "$4" ;;
  *) help ;;
esac
