#!/bin/bash

source scripts/utils.sh

set -e

print_header "Test it manually!"

print_header "Is it alright?(y/n)"
read -r is_alright

if [ "$is_alright" != 'y' ]; then
  print_header "Aborting..."
  exit
fi

print_header "Do you want to make a new version?(y/n)"
read -r make_new_version

if [ "$make_new_version" == 'y' ]; then
  yarn update-version
  print_header "Push the commit and wait the checks have passed"
  print_header "Aborting PR merging..."
  exit
fi

print_header "Time to merge 🚀️"
gh pr merge
