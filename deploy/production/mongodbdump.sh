#!/bin/sh

set -e

echo "rocket-chat mongodump - start"

echo "cleaning up old dumps"
docker compose exec -u root mongodb rm /dump.gz || true

echo "creating new dump"
docker compose exec -u root mongodb mongodump --archive=dump.gz --gzip
dumpname="dump-$(date -I).gz"
docker compose cp mongodb:/dump.gz "$dumpname"

echo "uploading dump to GCS"
gsutil cp $dumpname gs://serlo-production-rocket-chat-mongodump 

echo "cleaning up"
docker compose exec -u root mongodb rm /dump.gz || true
rm  $dumpname 

echo "rocket-chat mongodump - end"
