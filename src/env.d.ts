declare namespace NodeJS {
  interface ProcessEnv {
    SERLO_CLOUDFLARE_WORKER_SECRET: string
    SERLO_ORG_HOST: string
    SERLO_ORG_SECRET: string
    PLAYGROUND_SECRET: string
    HYDRA_HOST: string
  }
}
