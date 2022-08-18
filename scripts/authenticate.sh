#!/bin/bash

source scripts/utils.sh

if [ -z $1 ]; then
  user_id=1
else
  user_id=$1
fi

sed -i -e '103,132d' packages/server/src/internals/server/graphql-middleware.ts
sed -i "s/context({ req }): Promise<Pick<Context, 'service' | 'userId'>> {/context(): Promise<Pick<Context, 'service' | 'userId'>> {return Promise.resolve({ service: Service.SerloCloudflareWorker,userId: $user_id,}) }/" packages/server/src/internals/server/graphql-middleware.ts

print_header "Authenticated as user with id $user_id"
echo "The file 'packages/server/src/internals/server/graphql-middleware.ts' was changed in order to allow authentication."
echo "Important: Do not commit this file!"
echo "If you are editing this file, do not use this script!"
echo "Exit: ctrl+C"

trap restore_graphql_middleware SIGINT

restore_graphql_middleware() {
  echo
  echo "Restoring 'packages/server/src/internals/server/graphql-middleware.ts' to original state"
  git restore packages/server/src/internals/server/graphql-middleware.ts
}

sleep 99999m
