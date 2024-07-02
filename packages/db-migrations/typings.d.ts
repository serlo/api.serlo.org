declare module 'db-migrate' {
  export function getInstance(
    isModule: boolean,
    options: { cwd: string },
  ): { up(): Promise<void> }
}

interface ProcessEnv {
  ENVIRONMENT: string
  SLACK_TOKEN: string | undefined
  SLACK_CHANNEL: string
  REDIS_URL: string
}
