# Deployment Instructions with Docker Compose

## Requirements

- Docker
- Nginx
- Git
- GCloud CLI
- Gsutil

## Steps for the Staging deployment

1. `git clone https://github.com/serlo/api.serlo.org && cd api.serlo.org`
2. Set up Nginx on the host machine using configuration file `nginx.staging.conf`.

```console
$ sudo cp nginx.staging.conf /etc/nginx/sites-available/default
$ sudo systemctl restart nginx
```

3. Remember to set up SSL certificates (currently, self-signed ones are enough):

```
$ sudo mkdir -p /etc/nginx/ssl
% sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/selfsigned.key \
  -out /etc/nginx/ssl/selfsigned.crt \
  -subj "/CN=*.serlo-staging.dev"
```

4. Be sure the values at `.staging.env` and `kratos/config.staging.yml` (change the values with "PLACEHODER") are correct.
5. Deploy using Docker Compose with file `docker-compose.staging.yml`.

```console
$ docker compose -f docker-compose.staging.yml up -d
```

6. Set up the Gsutil. You need to authenticate and may use a key of the appropriate service account
   1. Go to GC Console -> IAM -> Service Accounts -> choose the dbreader account -> generate a new one
   2. Put the key in a file `staging_service_account_key.json` in the home directory
   3. `echo $GCLOUD_SERVICE_ACCOUNT_KEY > $HOME/staging_service_account_key.json`
   4. `gcloud auth activate-service-account ${GCLOUD_SERVICE_ACCOUNT_NAME} --key-file /tmp/service_account_key.json` Replace GCLOUD_SERVICE_ACCOUNT_NAME with the email of the service account.
   5. Run `./dbsetup.sh`
   6. Set cron tab to run the dbsetup script every night at 2 am.
