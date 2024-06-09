#!/bin/bash

tmp_dir="/tmp"

latest_dump=$(gsutil ls -l gs://anonymous-data | grep dump | sort -rk 2 | head -n 1 | awk '{ print $3 }' | tr -d '\n')

if [ -z "$latest_dump" ]; then
  echo "❌ Could not fetch latest dump, check your gsutil setup"
  exit 1
fi

file_name=$(basename "$latest_dump")

gsutil cp "$latest_dump" "$tmp_dir/$file_name"

container=$(docker compose ps -q mysql | tr -d '\n')

if [ -z "$container" ]; then
  echo "❌ MySQL container not found. Please start the database first with 'yarn start'!"
  exit 1
fi

unzip -o "$tmp_dir/$file_name" -d "$tmp_dir"
docker cp "$tmp_dir/mysql.sql" "$container:/tmp/mysql.sql"
docker cp "$tmp_dir/user.csv" "$container:/tmp/user.csv"

echo "🟢 Start importing MySQL data"
docker compose exec mysql sh -c 'pv "/tmp/mysql.sql" | serlo-mysql'

echo "🟢 Start importing anonymized user data"
docker compose exec mysql sh -c "serlo-mysql --local_infile=1 -e \"LOAD DATA LOCAL INFILE '/tmp/user.csv' INTO TABLE user FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' IGNORE 1 ROWS;\""
