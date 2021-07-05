#!/bin/bash

function init() {
  set -e

  BOLD=$(tput bold)
  NORMAL=$(tput sgr0)

  read_arguments "$@"

  yarn start:redis
  yarn codegen
}

function read_arguments() {
  if [ -n "$1" ]; then
    if [ "$1" = "--no-uncommitted-changes" ]; then
      NO_UNCOMMITTED_CHANGES="True"
    else
      error "Unknown parameter provided"
    fi
  fi
}

function main() {
  if [ -n "$NO_UNCOMMITTED_CHANGES" ]; then
    print_test_header "Check that there are no uncommitted changes when pushing"
    test_no_uncommitted_changes_when_pushing
  fi

  print_test_header "Run all tests"
  yarn test

  print_test_header "Run linter"
  yarn lint

  print_test_header "Run pact tests"
  yarn pacts
}

function test_no_uncommitted_changes_when_pushing() {
  if [ -n "$(git diff HEAD)" ]; then
	  error "There are uncommitted changes in your workspace (forgot to commit changes of 'yarn codegen'?!)"
  fi
}

function error() {
  log "Error: $@"
  exit 1
}

function print_test_header() {
  echo
  log "=== $@ ==="
}

function log() {
  echo "${BOLD}$@${NORMAL}"
}

init "$@"
main
