#!/bin/bash

set -e

function fetch_init {
  TARGET=$(mktemp --suffix .png)

  curl -X POST http://localhost:3001/enmeshed/init > "$TARGET"

  open "$TARGET"
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

fetch_init
