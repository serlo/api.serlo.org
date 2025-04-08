# Deployment Instructions with Docker Compose

## Requirements

- Docker
- Nginx
- Git
- GCloud CLI
- Gsutil
- unzip

## Steps for the deployment

1. `git clone https://github.com/serlo/api.serlo.org && cd api.serlo.org/deploy/`
2. `cd staging/` or `cd production/` depending on your enviroment.
3. Set up Nginx on the host machine using configuration file `nginx.default.conf`.
   1. First you need to set up SSL certificates (currently, self-signed ones are enough):
   ```console
   $ sudo mkdir -p /etc/nginx/ssl
   $ sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout /etc/nginx/ssl/selfsigned.key \
     -out /etc/nginx/ssl/selfsigned.crt \
      # uncomment what apply
      # -subj "/CN=*.serlo-staging.dev"
      # -subj "/CN=*.serlo.org"
   ```
   2. Then configure the routes:
   ```console
   $ sudo cp nginx.default.conf /etc/nginx/sites-available/default # alternatively use the command `ln`
   $ sudo systemctl restart nginx
   ```
4. Be sure the values at corresponding `.env` and `kratos/config.staging.yml` or `kratos/config.production.yml` (change the values with "PLACEHODER") are correct.
5. Deploy using Docker Compose.
6. Set the DNS accordingly. At the server, remember set the firewall rules to allow http and https.

## Additional steps for STAGING

### Serlo DB Setup

You need to fill up the database with data and set the cronjob for that for every night.

Set up the Gsutil. You need to authenticate and may use a key of the appropriate service account.

1.  Go to GC Console -> IAM -> Service Accounts -> choose the dbreader account -> generate a new one
2.  Put the key in a file `staging_service_account_key.json` in the home directory
3.  `gcloud auth activate-service-account --key-file ~/staging_service_account_key.json`
4.  Run `./dbsetup.sh` in host
5.  Set cron tab to run the dbsetup script every night at 2 am.

### DB Migration Cronjob

Add a crontab in host with the following command (replace the missing values) for 3 am.

```
docker run --rm --name db-migration --env-file PATH/TO/.env -e SLACK_CHANNEL="PLACEHOLDER" -e SLACK_TOKEN="PLACEHOLDER"  --network staging_staging-network ghcr.io/serlo/api.serlo.org/db-migration:PLACEHOLDER
```

## Additional steps for PRODUCTION

### Serlo DB Dump

In your first deployment, you will need to import the existing data into mysql and postgres containers.
Manually dump the production databases. Take a look at `staging/dbsetup.sh` for some inspiration on how to
import the data.

Afterwards, You need to set up the cronjob for dumping the database for staging.

Set up the Gsutil. You need the credentials of a service account in order that the script runs correctly.

1.  Go to GC Console -> IAM -> Service Accounts -> choose the dbreader account -> generate a new one
2.  Put the key in a file `production_service_account_key.json` in the home directory
3.  Set cron tab to run the dbdump script every night at 1 am.

### Rocket Chat DB Dump

In your first deployment, you will need to import the existing data into mongodb container.

1. Download the dump from the corresponding bucket in the GC project 'production'
2. Run
   ```
   $ docker compose cp dump-????.gz mongodb:/dump.gz
   $ docker compose exec mongodb mongorestore --archive=dump.gz --gzip
   ```

Now, set up a crontab to upload a backup of the data to the bucket at midnight, using the script `mongodbdump.sh`.

### DB Migration

In case of db migration, run the following command in host (replace the missing values).

```
docker run --rm --name db-migration --env-file PATH/TO/.env -e SLACK_CHANNEL="PLACEHOLDER" -e SLACK_TOKEN="PLACEHOLDER"  --network production-network ghcr.io/serlo/api.serlo.org/db-migration:PLACEHOLDER
```
