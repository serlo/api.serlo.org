# Deployment Instructions with Docker Compose

## Requirements
- Docker
- Nginx

## Steps for the Staging deployment

1. Set up Nginx on the host machine using configuration file `nginx.staging.conf`.
```console
$ cp nginx.staging.conf /etc/nginx/sites-available/default
$ systemctl restart nginx
```
2. Be sure the values at `.staging.env` and `kratos/config.staging.yml` (change the values with "PLACEHODER") are correct.
3. Deploy using Docker Compose with file `docker-compose.staging.yml`.
```console
$ docker compose -f docker-compose.staging.yml up -d
```
