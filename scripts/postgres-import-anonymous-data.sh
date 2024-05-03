echo '==> IMPORTANT: you should have successfully run yarn mysql:import-anonymous-data first <=='

sleep 3

postgres_exec='docker compose -f docker-compose.kratos.yml exec -T postgres psql --user=serlo kratos'

$postgres_exec -c "DROP SCHEMA public CASCADE;"
$postgres_exec -c "CREATE SCHEMA public;"
$postgres_exec -c "GRANT ALL ON SCHEMA public TO serlo;"

# Hardcoded temp directory
$postgres_exec </tmp/kratos.sql
