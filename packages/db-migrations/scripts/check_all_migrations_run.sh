migrations_run=$(yarn mysql:list-migrations)

for migration_file in src/*.ts
do
  migration_filename=$(basename -- "$migration_file")
  migration_name=${migration_filename%%.*}
  match=$(echo $migrations_run | grep -o $migration_name)

  # Exit if the file name was not found within migrations that have been run
  if [ -z "$match" ]
  then
    echo "$migration_name migration has not been run"
    exit 1
  fi
done

echo "all migrations have been run"
