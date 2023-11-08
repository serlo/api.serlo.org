docker build -t eu.gcr.io/serlo-shared/api-server:debug -f packages/server/docker/Dockerfile.debug .
docker push eu.gcr.io/serlo-shared/api-server:debug
