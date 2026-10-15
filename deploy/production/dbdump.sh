#!/bin/sh

set -e

mysql_cmd="docker compose exec -T mysql mysql --user=serlo --password=secret"

echo "dump serlo.org database - start"

echo "dump legacy serlo database schema"
mysql_dump_cmd="docker compose exec -T mysql mysqldump --user=serlo --password=secret --lock-tables=false"

$mysql_dump_cmd --no-data --add-drop-database --databases serlo >mysql.sql

$mysql_dump_cmd --no-create-info --lock-tables=false --add-locks --ignore-table=serlo.user serlo >>mysql.sql

$mysql_cmd --batch -e "SELECT id, CONCAT(@rn:=@rn+1, '@localhost') AS email, username, '8a534960a8a4c8e348150a0ae3c7f4b857bfead4f02c8cbf0d' AS password, logins, date, CONCAT(@rn:=@rn+1, '') AS token, last_login, description FROM user, (select @rn:=2) r;" serlo >user.csv

echo "dump kratos identities data"

echo "dumping the data from the kratos database"
docker compose exec postgres pg_dump --user=serlo kratos >temp.sql

echo "creating another container to manipulate and anonymize the data"
docker run --name temp_postgres -e POSTGRES_PASSWORD=secret -e POSTGRES_PASSWORD=password -e POSTGRES_DB=kratos -e PGPASSWORD=secret -v ./temp.sql:/temp.sql -d postgres:13

echo "waiting for the postgres container to be ready"
if ! timeout 60s sh -c 'until docker exec temp_postgres pg_isready -U postgres; do sleep 1; done'; then
    echo "Postgres container did not become ready within 1 minute."
    exit 1
fi

temp_postgres_cmd="docker exec temp_postgres psql -h localhost -U postgres --quiet -c"
$temp_postgres_cmd "CREATE user serlo;"
$temp_postgres_cmd "GRANT ALL PRIVILEGES ON DATABASE kratos TO serlo;"

docker exec -i temp_postgres psql -h localhost -U serlo -d kratos <temp.sql

temp_postgres_cmd="docker exec temp_postgres psql -h localhost -U serlo kratos --quiet -c"
$temp_postgres_cmd "UPDATE identities SET traits = JSONB_SET(traits, '{email}', TO_JSONB(CONCAT(id, '@localhost')));"
$temp_postgres_cmd "UPDATE identities SET traits = JSONB_SET(traits, '{interest}', '\"\"') where traits ->> 'interest' != 'teacher';"
$temp_postgres_cmd "UPDATE identity_credentials SET config = '{\"hashed_password\": \"\$sha1\$pf=e1NBTFR9e1BBU1NXT1JEfQ==\$YTQwYzEwY2ZlNA==\$hTlqikjjSFoK43S4V7+t8CyMvw0=\"}';"
$temp_postgres_cmd "UPDATE identity_verifiable_addresses SET value = CONCAT(identity_id, '@localhost');"
$temp_postgres_cmd "UPDATE identity_recovery_addresses SET value = CONCAT(identity_id, '@localhost');"
$temp_postgres_cmd "UPDATE identity_credential_identifiers SET identifier = CONCAT(ic.identity_id, '@localhost') FROM (select id, identity_id FROM identity_credentials) AS ic where ic.id = identity_credential_id and identifier LIKE '%@%';"
$temp_postgres_cmd "TRUNCATE sessions, continuity_containers, courier_messages, identity_verification_codes, identity_recovery_codes, identity_recovery_tokens, identity_verification_tokens, selfservice_errors, selfservice_login_flows, selfservice_recovery_flows, selfservice_registration_flows, selfservice_settings_flows, selfservice_verification_flows, session_devices, session_token_exchanges, identity_login_codes CASCADE;"
docker exec temp_postgres pg_dump  -h localhost -U serlo kratos >kratos.sql

echo "compressing database dump"
day=$(date -I)
zip "dump-$day".zip mysql.sql user.csv kratos.sql

gcloud auth activate-service-account --key-file=~/production_service-account.json
gsutil cp dump-$day gs://anonymous-dump
echo "latest dump uploaded"

echo "removing temporary files and containers"
rm -f mysql.sql user.csv kratos.sql dump-$day.zip temp.sql
docker rm -f temp_postgres >/dev/null 2>&1

echo "dump of serlo.org database - end"
