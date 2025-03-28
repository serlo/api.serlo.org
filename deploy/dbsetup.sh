#!/bin/sh

set -e

mysql_connect="docker compose -f docker-compose.staging.yml exec -T mysql mysql --user=serlo --password=secret"

echo "wait for mysql database to be ready"
until $mysql_connect -e "SHOW DATABASES" >/dev/null 2>/dev/null; do
    echo "could not find mysql server - retry in 10 seconds"
    sleep 10
done

newest_dump_uri=$(gsutil ls -l gs://anonymous-dump | grep dump | sort -rk 2 | head -n 1 | awk '{ print $3 }')
[ -z "$newest_dump_uri" ] && {
    echo "no database dump available in anonymous db dump bucket"
    exit 1
}

newest_dump=$(basename $newest_dump_uri)

gsutil cp $newest_dump_uri "/tmp/$newest_dump"
echo "downloaded newest dump $newest_dump"
unzip -o "/tmp/$newest_dump" -d /tmp || {
    echo "unzip of dump file failed"
    exit 1
}

echo "Recreating serlo database"

docker compose -f docker-compose.staging.yml cp /tmp/mysql.sql mysql:/tmp/mysql.sql
docker compose -f docker-compose.staging.yml cp /tmp/user.csv mysql:/tmp/user.csv

$mysql_connect -e "DROP DATABASE serlo"
$mysql_connect -e "CREATE DATABASE serlo"
$mysql_connect serlo <"/tmp/mysql.sql" || {
    echo "import of dump failed"
    exit 1
}

docker compose -f docker-compose.staging.yml exec -T mysql mysql --user=root --password=secret -e "SET GLOBAL local_infile = 1"
$mysql_connect --local-infile=1 -e "LOAD DATA LOCAL INFILE '/tmp/user.csv' INTO TABLE user FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' IGNORE 1 ROWS;" serlo || {
    echo "import of users failed"
    exit 1
}
$mysql_connect serlo -e "UPDATE user SET description = NULL WHERE description = 'NULL'"

echo "imported serlo database dump $newest_dump"

echo "Recreating kratos database"

docker compose -f docker-compose.staging.yml cp /tmp/kratos.sql postgres:/tmp/kratos.sql

postgres_connect="docker compose -f docker-compose.staging.yml exec -T postgres psql --user=serlo kratos "
$postgres_connect -c "DROP SCHEMA public CASCADE;"
$postgres_connect -c "CREATE SCHEMA public;"
$postgres_connect -c "GRANT ALL ON SCHEMA public TO serlo;"
$postgres_connect </tmp/kratos.sql

echo "Recreated kratos database"

echo "Deleting unnecessary files"
rm -f $(ls /tmp/dump*.zip | grep -v $newest_dump)
rm /tmp/*.sql /tmp/user.csv
