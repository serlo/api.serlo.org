/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */

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
    LOG_LEVEL: LogLevelDesc | undefined
    REDIS_URL: string
    REDIS_URL_TEST: string | undefined
    ROCKET_CHAT_API_AUTH_TOKEN: string
    ROCKET_CHAT_URL: string
    ROCKET_CHAT_API_USER_ID: string
    SENTRY_DSN: string | undefined
    SENTRY_RELEASE: string | undefined
    SERLO_ORG_DATABASE_LAYER_HOST: string
    SERLO_ORG_SECRET: string

    /**
     * Used by server only
     */
    MAILCHIMP_API_KEY: string
    SERVER_HYDRA_HOST: string
    SERVER_SERLO_CLOUDFLARE_WORKER_SECRET: string
    SERVER_SERLO_CACHE_WORKER_SECRET: string
    SERVER_SWR_QUEUE_DASHBOARD_PASSWORD: string
    SERVER_SWR_QUEUE_DASHBOARD_USERNAME: string

    /**
     * Used by swr-queue-worker only
     */
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
