#!/bin/bash

set -e

source scripts/utils.sh

if [ -n "$(git diff HEAD)" ]; then
  error "There are uncommitted changes in your workspace"
fi

yarn prepare-release

print_header "Updating lock file"
yarn

print_header "Formatting"
yarn format

print_header "Time to commit 🚀️"
git add -p
git commit
