k8s_yaml(helm("helm/api"))
k8s_resource("server", port_forwards=3000)
docker_build(
  "eu.gcr.io/serlo-shared/api",
  ".",
  target="dev",
  build_args={"node_env": "development"},
  entrypoint="yarn start",
  live_update=[
    sync(".", "/usr/src/app"),
    run("cd /usr/src/app && yarn", trigger=["./package.json", "./yarn.lock"]),
  ]   
)
