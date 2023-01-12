#!/bin/bash

source scripts/utils.sh

if [ -z $1 ]; then
  user_id=1
else
  user_id=$1
fi

auth_file=packages/server/src/internals/server/graphql-middleware.ts

body_of_context_method='113,138d'

sed -i -e $body_of_context_method $auth_file
sed -i "s/context({ req }): Promise<Pick<Context, 'service' | 'userId'>> {/context(): Promise<Pick<Context, 'service' | 'userId'>> {return Promise.resolve({ service: Service.SerloCloudflareWorker,userId: $user_id,}) }/" $auth_file

print_header "Authenticated as user with id $user_id"
echo "The file '$auth_file' was changed in order to allow authentication."
echo "Important: Do not commit this file!"
echo "If you are editing this file, do not use this script!"
echo "Exit: ctrl+C"

trap restore_graphql_middleware SIGINT

function restore_graphql_middleware() {
  echo
  echo "Restoring '$auth_file' to original state"
  git restore $auth_file
}

sleep 99999m
