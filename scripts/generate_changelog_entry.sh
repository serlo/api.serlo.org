#!/bin/bash

source scripts/utils.sh

echo "Getting last PR messages..."

MERGED_PRS_BODY_MESSAGES=$(git log $(git describe --tags --abbrev=0)..HEAD --pretty=tformat:'%s %b%n') | grep 'Merge pull request'
CURRENT_PR_TITLE=$(gh pr view | head -n 1 | sed "s/title://g")
PRS_BODY_MESSAGES="$MERGED_PRS_BODY_MESSAGES"$'\n'"$CURRENT_PR_TITLE"

# TODO: put quotes around each message
ADDED=$(echo $PRS_BODY_MESSAGES | grep 'feat' | awk -F: '{ print $2 }' | sed '$!s/$/,/' | xargs)
FIXED=$(echo $PRS_BODY_MESSAGES | grep 'fix' | awk -F: '{ print $2 }' | sed '$!s/$/,/' | xargs)
# TODO: ignore break changes in fixed and added and put them only here
BREAKING_CHANGES=$(echo $PRS_BODY_MESSAGES | grep '!' | awk -F: '{ print $2 }' | sed '$!s/$/,/' | xargs)

echo "Finding new version..."
LAST_VERSION=$(cat scripts/changelog.ts \
  | grep 'tagName:' \
  | tail -1 \
  | awk -F: '{ print $2 }' \
  | sed "s/[v,', ]//g")

IFS=.
read MAJOR MINOR PATCH <<< $LAST_VERSION

if [ -n "$BREAKING_CHANGES" ]; then
  NEW_VERSION="$(($MAJOR + 1)).0.0"
elif [ -n "$ADDED" ]; then
  NEW_VERSION="$MAJOR.$(($MINOR + 1)).0"
elif [ -n "$FIXED" ]; then
  NEW_VERSION="$MAJOR.$MINOR.$(($PATCH + 1))"
else
  echo "Aborted!"
  echo "There were no additions, no fixes and no breaking changes since last version."
  echo "If you still want to upgrade this package, do it manually. I can't help you."
  echo
  exit 0
fi

DATE=$(date +%F)

if [ -n "$ADDED" ]; then
  ADDED_ENTRIES="added: [
  '$ADDED'
  ]"
fi

if [ -n "$FIXED" ]; then
  FIXED_ENTRIES="fixed: [
  '$FIXED'
  ]"
fi
print_header "Changelog entry suggestion"
echo "BASED ON"
echo "++++++++"
echo
git --no-pager log "$(git describe --tags --abbrev=0)"..HEAD --oneline
if [ -n "$CURRENT_PR_TITLE" ]; then
  echo "PR title: $CURRENT_PR_TITLE"
fi
echo
echo "WE SUGGEST THE FOLLOWING CHANGELOG ENTRY"
echo "++++++++++++++++++++++++++++++++++++++++"
echo """
{
  tagName: 'v$NEW_VERSION',
  date: '$DATE',
  $(if [ -n "$ADDED_ENTRIES" ]; then echo "$ADDED_ENTRIES,"; fi)
  $FIXED_ENTRIES
}
"""
