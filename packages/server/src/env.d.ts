declare namespace NodeJS {
  import { LogLevelDesc } from 'loglevel'

  interface ProcessEnv {
    /**
     * Used by server and swr-queue-worker
     */
    ENVIRONMENT: string
    GOOGLE_SPREADSHEET_API_ACTIVE_DONORS: string
    GOOGLE_SPREADSHEET_API_MOTIVATION: string
    GOOGLE_SPREADSHEET_API_SECRET: string
    LOG_LEVEL: LogLevelDesc
    MYSQL_URI: string
    REDIS_URL: string
    REDIS_URL_TEST: string | undefined
    ROCKET_CHAT_API_AUTH_TOKEN: string
    ROCKET_CHAT_URL: string
    ROCKET_CHAT_API_USER_ID: string
    SENTRY_DSN: string | undefined
    SENTRY_RELEASE: string | undefined
    SERLO_ORG_DATABASE_LAYER_HOST: string
    SERLO_ORG_SECRET: string
    CACHE_TYPE: string

    /**
     * Used by server only
     */
    MAILCHIMP_API_KEY: string
    SERVER_HYDRA_HOST: string
    SERVER_KRATOS_PUBLIC_HOST: string
    SERVER_KRATOS_ADMIN_HOST: string
    SERVER_KRATOS_DB_URI: string
    SERVER_KRATOS_SECRET: string
    SERVER_SERLO_CLOUDFLARE_WORKER_SECRET: string
    SERVER_SERLO_CACHE_WORKER_SECRET: string
    SERVER_SERLO_NOTIFICATION_EMAIL_SERVICE_SECRET: string
    SERLO_EDITOR_TESTING_SECRET: string
    SERVER_SWR_QUEUE_DASHBOARD_PASSWORD: string
    SERVER_SWR_QUEUE_DASHBOARD_USERNAME: string
    // Path to Google service account credentials (for @google-cloud/storage)
    // see https://cloud.google.com/docs/authentication/getting-started
    GOOGLE_APPLICATION_CREDENTIALS: string

    /**
     * Used by swr-queue-worker only
     */
    CHECK_STALLED_JOBS_DELAY: string
    SWR_QUEUE_WORKER_CONCURRENCY: string
    SWR_QUEUE_WORKER_DELAY: string | undefined

    /**
     * Used by enmeshed only
     */
    ENMESHED_SERVER_HOST: string
    ENMESHED_SERVER_SECRET: string
    ENMESHED_WEBHOOK_SECRET: string
  }
}
