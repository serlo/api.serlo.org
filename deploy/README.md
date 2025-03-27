# Deployment Instructions with Docker Compose

## Requirements
- Docker
- Nginx
- Git

## Steps for the Staging deployment

1. `git clone https://github.com/serlo/api.serlo.org && cd api.serlo.org`
2. Set up Nginx on the host machine using configuration file `nginx.staging.conf`.
```console
$ sudo cp nginx.staging.conf /etc/nginx/sites-available/default
$ sudo systemctl restart nginx
```
3. Be sure the values at `.staging.env` and `kratos/config.staging.yml` (change the values with "PLACEHODER") are correct.
4. Deploy using Docker Compose with file `docker-compose.staging.yml`.
```console
$ docker compose -f docker-compose.staging.yml up -d
```
