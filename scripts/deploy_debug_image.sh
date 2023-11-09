#!/bin/bash

docker build -t eu.gcr.io/serlo-shared/api-server:debug -f packages/server/docker/server/Dockerfile.debug .
docker push eu.gcr.io/serlo-shared/api-server:debug

docker build -t eu.gcr.io/serlo-shared/api-swr-queue-worker:debug -f packages/server/docker/swr-queue-worker/Dockerfile.debug .
docker push eu.gcr.io/serlo-shared/api-swr-queue-worker:debug
