#!/bin/bash

# PlanetScale SQL dump file name
# Instructions on how to dump from PlanetScale: 
# https://github.com/planetscale/discussion/discussions/168

# If using pscale cli, then the dump will be a folder with lots of sql files
# In that case, you can use the following commands to merge them into a single file:

# rm $(ls -1 | grep 'schema.sql' )
# cat *.sql  > all_files.sql_all
# mv all_files.sql_all planetscale_data_dump.sql

PLANETSCALE_SQL_DUMP_FILE_NAME="planetscale_data_dump.sql"

replacements=(
    ("entityId" "entity_id")
    ("sessionId" "session_id")
    ("revisionId" "revision_id")
    ("topicId" "topic_id")
    ("threadId" "thread_id")
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
    sed -i "s/$old_str/$new_str/g" "$PLANETSCALE_SQL_DUMP_FILE_NAME"
done