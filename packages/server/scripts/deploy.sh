#!/bin/bash

set -e

function run() {
  local env_name=$1
  if [ -z "$env_name" ]; then
    echo "You have to specify environment, staging or production"
    exit 1
  fi

  if [[ "$env_name" != "staging" && "$env_name" != "production" ]]; then
    echo "Invalid environment name, please use 'staging' or 'production'"
    exit 1
  fi

  build_docker_image "server" "../.." "$env_name"
  build_docker_image "swr-queue-worker" "../.." "$env_name"
}

function build_docker_image() {
  local name=$1
  local context=$2
  local env_name=$3

  local registry=${DOCKER_REGISTRY:-"ghcr.io"}
  local repository=${DOCKER_REPOSITORY:-"serlo/api.serlo.org/$name"}
  local remote_name="$registry/$repository"
  local date=$(date -u +"%Y-%m-%d-%s")

  local git_hash=$(git rev-parse --short HEAD)

  local remote_tags=$(to_tags "$remote_name" "$env_name" "$date" "$git_hash")
  local tags=$(to_tags "$name" "$env_name")

  local script_dir=$(dirname "$(readlink -f "$0")")
  local root=$(realpath "$script_dir/..")
  local dockerfile="$root/Dockerfile"

  docker build -f "$dockerfile" $(for tag in $remote_tags $tags; do echo -n "-t $tag "; done) "$context" --build-arg "image=$name"

  for remote_tag in $remote_tags; do
    echo "Pushing $remote_tag"
    docker push "$remote_tag"
  done
}

function to_tags() {
  local name=$1
  shift
  local tags=""
  for version in "$@"; do
    tags+="$name:$version "
  done
  echo "$tags"
}

if [ $# -eq 0 ]; then
  echo "Usage: $0 <environment>"
  exit 1
fi

run "$1"
