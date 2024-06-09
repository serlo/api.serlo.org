<img width="688" alt="image" src="https://github.com/serlo/db-migrations/assets/1258870/e19d4bc1-977c-4327-ab06-7b187e4dc8ab">

# DB migrations

particularly for the mysql database

## Add a new migration

1. Run `yarn new` to create a new file with the migration timestamp. You can
   copy and paste one of the existing migrations as a template for the new one.

2. You need to build a migration by running
   `yarn build src/YYYYMMDDHHMMSS-xyz.ts` in the `src` directory. This creates a
   new file in `migrations`. Both files in `migrations` and `src` need to be
   added in the PR. 

!!_Note that any changes in other directories that are
   imported by the file will be built together_!! 
