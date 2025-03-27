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
