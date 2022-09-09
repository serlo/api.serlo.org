#!/bin/bash

set -e

source scripts/utils.sh

if [ -n "$(git diff HEAD)" ]; then
  error "There are uncommitted changes in your workspace"
fi

$(git config core.editor) scripts/changelog.ts

print_header "Generating CHANGELOG"
yarn changelog

print_header "Updating version in each package.json"
VERSION=$(cat scripts/changelog.ts \
  | grep 'tagName:' \
  | tail -1 \
  | awk -F: '{ print $2 }' \
  | sed "s/[v,', ]//g")

yarn prepare-release $VERSION -y

print_header "Updating lock file"
yarn

print_header "Formatting"
yarn format

print_header "Time to commit 🚀️"
git add -p
git commit
