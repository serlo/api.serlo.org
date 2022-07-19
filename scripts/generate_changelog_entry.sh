#!/bin/bash

source scripts/utils.sh

echo "==This script is still a work in progress=="

echo "Getting last PR messages..."

MERGED_PRS_BODY_MESSAGES=$(git log $(git describe --tags --abbrev=0)..HEAD | grep 'Merge pull request' -A 10)
CURRENT_PR_TITLE=$(gh pr view | head -n 1 | sed "s/title://g")
PRS_BODY_MESSAGES="$MERGED_PRS_BODY_MESSAGES"$'\n'"$CURRENT_PR_TITLE"

# TODO: put quotes around each entry
ADDED=$(echo $PRS_BODY_MESSAGES | grep 'feat' | awk -F: '{ print $2 }' | sed '$!s/$/,/')
FIXED=$(echo $PRS_BODY_MESSAGES | grep 'fix' | awk -F: '{ print $2 }' | sed '$!s/$/,/')
BREAKING_CHANGES=$(echo $PRS_BODY_MESSAGES | grep '!' | awk -F: '{ print $2 }' | sed '$!s/$/,/')

echo "Upgrading version..."
LAST_VERSION=$(cat scripts/changelog.ts \
  | grep 'tagName:' \
  | tail -1 \
  | awk -F: '{ print $2 }' \
  | sed "s/[v,', ]//g")

IFS=. read MAJOR MINOR PATCH <<< $LAST_VERSION

if [ -n "$BREAKING_CHANGES" ]; then
  NEW_VERSION="$(($MAJOR + 1)).0.0"
elif [ -n "$ADDED" ]; then
  NEW_VERSION="$MAJOR.$(($MINOR + 1)).0"
elif [ -n "$FIXED" ]; then
  NEW_VERSION="$MAJOR.$MINOR.$(($PATCH))"
else
  echo "Aborted!"
  echo "There were no additions, no fixes and no breaking changes since last version."
  echo "If you still want to upgrade this package, do it manually. I can't help you."
  echo
  exit 0
fi

DATE=$(date +%F)

print_header "Changelog entry suggestion"
echo "Based on:"
git log $(git describe --tags --abbrev=0)..HEAD --oneline
echo
echo "We suggest the following changelog entry"
echo "++++++++++++++++++++++++++++++++++++++++"
echo """
{
  tagName: 'v$NEW_VERSION',
  date: '$DATE',
  added: [
    '$ADDED'
  ],
  fixed: [
    '$FIXED'
  ]
},

"""
