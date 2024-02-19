#!/bin/bash

source scripts/utils.sh

user_id=${1:-1}

auth_file="packages/server/src/internals/server/graphql-middleware.ts"

# backup the original file if not already backed up
backup_file="${auth_file}.bak"
if [ ! -f "$backup_file" ]; then
    cp "$auth_file" "$backup_file"
fi

# Trap Ctrl+C (SIGINT) to execute the restore function
trap restore_graphql_middleware SIGINT

awk -v user_id="$user_id" '
BEGIN { printing = 1; replaced = 0 }
/async context\(\{ req \}\): Promise<Context> {/,/return \{ ...partialContext, dataSources, googleStorage \}/ {
    if (printing && /async context\(\{ req \}\): Promise<Context> {/) {
        printing = 0
        replaced = 1
        print "      async context(): Promise<Context> {"
        print "        const googleStorage = new Storage();"
        print "        const dataSources = {"
        print "          model: new ModelDataSource(environment),"
        print "        };"
        print "        return Promise.resolve({"
        print "          service: Service.SerloCloudflareWorker,"
        print "          userId: " user_id ","
        print "          googleStorage,"
        print "          dataSources,"
        print "        });"
    }
    if (/return \{ ...partialContext, dataSources, googleStorage \}/ && replaced) {
        printing = 1
    }
    next
}
printing { print }
' "$auth_file" > temp_file && mv temp_file "$auth_file"

print_header "Authenticated as user with id $user_id"
echo "The file '$auth_file' was changed to allow authentication."
echo "Important: Do not commit this file!"
echo "If you are editing this file, do not use this script!"
echo "Exit: ctrl+C"

function restore_graphql_middleware() {
    echo "Restoring '$auth_file' to original state"
    cp "$backup_file" "$auth_file"
}

sleep infinity
