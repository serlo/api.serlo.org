#!/bin/bash

tmp_dir="/tmp"

var_PS_USERNAME="serlo"
var_PS_HOST_URL="serlo"
var_PS_HOST_PORT=""
var_PS_PASSWORD=""
OUTPUT_FILE_NAME="planetscale_data_dump.sql"

# mysql -u "$PS_USERNAME" -h "$PS_HOST_URL" -P "$PS_HOST_PORT" -p"$PS_PASSWORD" -e "SHOW DATABASES;"
# mysqldump -u "$PS_USERNAME" -h "$PS_HOST_URL" -P "$PS_HOST_PORT"> "$OUTPUT_FILE_NAME"

replacements=(
    ("entityId" "entity_id")
    ("sessionId" "session_id")
    ("revisionId" "revision_id")
    ("topicId" "topic_id")
    ("isProduction" "is_production")
    ("isSubject" "is_subject")
    ("key" "link_key")
    ("group" "experiment_group")
)

for replace in "${replacements[@]}"; do
    # Extract elements of the tuple
    old_str=$(echo "$replace" | cut -d' ' -f1)
    new_str=$(echo "$replace" | cut -d' ' -f2)

    # Run sed command
    sed -i "s/$old_str/$new_str/g" "$OUTPUT_FILE_NAME"
done