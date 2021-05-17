/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import Queue from 'bee-queue'
import { either as E, option as O } from 'fp-ts'
import * as t from 'io-ts'
import * as R from 'ramda'

import { Cache, Priority } from './cache'
import { isQuery, QuerySpec } from './data-source-helper'
import { log } from './log'
import { redisUrl } from './redis-url'
import { Sentry } from './sentry'
import { Timer } from './timer'
import { modelFactories } from '~/model'

export interface SwrQueue {
  queue(updateJob: UpdateJob): Promise<never>
  ready(): Promise<void>
  healthy(): Promise<void>
  quit(): Promise<void>
  _queue: never
}

export interface UpdateJob {
  key: string
}

export const emptySwrQueue: SwrQueue = {
  queue(_updateJob) {
    return Promise.resolve(undefined as never)
  },
  ready() {
    return Promise.resolve()
  },
  healthy() {
    return Promise.resolve()
  },
  quit() {
    return Promise.resolve()
  },
  _queue: undefined as never,
}

export const queueName = 'swr'

export function createSwrQueue({
  cache,
  timer,
}: {
  cache: Cache
  timer: Timer
}): SwrQueue {
  const args = {
    environment: {
      cache,
      swrQueue: emptySwrQueue,
    },
  }
  const models = R.values(modelFactories).map((createModel) =>
    createModel(args)
  )

  const queue = new Queue<UpdateJob>(queueName, {
    redis: {
      url: redisUrl,
    },
    isWorker: false,
    removeOnFailure: true,
    removeOnSuccess: true,
  })

  return {
    _queue: queue as unknown as never,
    async queue(updateJob) {
      const { key } = updateJob

      const result = await shouldProcessJob({
        key,
        cache,
        models,
        timer,
      })

      if (E.isLeft(result)) {
        log.debug('Skipped job', key, 'because', result.left)
        return undefined as never
      }

      log.debug('Queuing job', key)

      // By setting the job's ID, we make sure that there will be only one update job for the same key
      // See also https://github.com/bee-queue/bee-queue#jobsetidid
      const job = await queue
        .createJob(updateJob)
        .setId(updateJob.key)
        .timeout(60000)
        .retries(5)
        .backoff('exponential', 10000)
        .save()

      job.on('failed', (err) => {
        log.error(`Job ${job.id} failed with error ${err.message}`)
      })

      job.on('retrying', (err) => {
        log.debug(
          `Job ${job.id} failed with error ${err.message} but is being retried!`
        )
      })

      job.on('succeeded', (result: string) => {
        log.debug(`Job ${job.id} succeeded with result: ${result}`)
      })

      return job as never
    },
    async ready() {
      await queue.ready()
    },
    async healthy() {
      await queue.checkHealth()
    },
    async quit() {
      await queue.close()
    },
  }
}

export function createSwrQueueWorker({
  cache,
  timer,
  concurrency,
}: {
  cache: Cache
  timer: Timer
  concurrency: number
}): {
  ready(): Promise<void>
  healthy(): Promise<void>
  quit(): Promise<void>
  _queue: never
} {
  const args = {
    environment: {
      cache,
      swrQueue: emptySwrQueue,
    },
  }
  const models = R.values(modelFactories).map((createModel) =>
    createModel(args)
  )

  const queue = new Queue<UpdateJob>(queueName, {
    redis: {
      url: redisUrl,
    },
    removeOnFailure: true,
    removeOnSuccess: true,
  })

  queue.process(concurrency, async (job): Promise<string> => {
    async function processJob() {
      const { key } = job.data

      // TODO: Delete this when not necessary any more
      // article "Prozent"
      if (key === 'de.serlo.org/api/uuid/1627') {
        Sentry.captureMessage(
          'Hey Kulla, how are you? Sentry is working in SWR by the way (with "captureMessage")'
        )

        // to test wether thrown errors work
        throw new Error(
          'Hey Kulla, how are you? Sentry is working in SWR by the way (with "error")'
        )
      }

      const result = await shouldProcessJob({
        key,
        cache,
        models,
        timer,
      })
      if (E.isLeft(result)) {
        return `Skipped update because ${result.left}`
      }

      const { spec, payload } = result.right

      await cache.set({
        key,
        source: 'SWR worker',
        priority: Priority.Low,
        getValue: async (current) => {
          const value = await spec.getCurrentValue(payload, current ?? null)
          const decoder = spec.decoder || t.unknown
          const decoded = decoder.decode(value)
          if (E.isRight(decoded)) {
            return decoded.right
          }
          throw new Error(`Invalid value: ${JSON.stringify(value)}`)
        },
      })
      return 'Updated because stale'
    }

    const result = await processJob()
    if (process.env.SWR_QUEUE_WORKER_DELAY !== undefined) {
      const delay = parseInt(process.env.SWR_QUEUE_WORKER_DELAY, 10)
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, delay)
      })
    }
    return result
  })

  return {
    _queue: queue as unknown as never,
    async ready() {
      await queue.ready()
    },
    async healthy() {
      await queue.checkHealth()
    },
    async quit() {
      await queue.close()
    },
  }
}

async function shouldProcessJob({
  key,
  cache,
  models,
  timer,
}: {
  key: string
  cache: Cache
  models: Record<string, unknown>[]
  timer: Timer
}): Promise<
  E.Either<string, { spec: QuerySpec<unknown, unknown>; payload: unknown }>
> {
  function getSpec(key: string): QuerySpec<unknown, unknown> | null {
    for (const model of models) {
      for (const prop of Object.values(model)) {
        if (isQuery(prop) && O.isSome(prop._querySpec.getPayload(key))) {
          return prop._querySpec
        }
      }
    }
    return null
  }

  const cacheEntry = await cache.get<unknown>({ key })
  if (O.isNone(cacheEntry)) {
    return E.left('cache empty.')
  }
  const spec = getSpec(key)
  if (spec === null) {
    return E.left('invalid key.')
  }
  if (!spec.enableSwr) {
    return E.left('SWR disabled.')
  }
  const maxAge =
    spec.maxAge === undefined ? undefined : timeToMilliseconds(spec.maxAge)
  const age = timer.now() - cacheEntry.value.lastModified
  if (maxAge === undefined || age <= maxAge) {
    return E.left('cache non-stale.')
  }
  const payload = spec.getPayload(key)
  if (O.isNone(payload)) {
    return E.left('invalid key.')
  }

  return E.right({
    spec,
    payload: payload.value,
  })
}

export interface Time {
  day?: number
  days?: number
  hour?: number
  hours?: number
  minute?: number
  minutes?: number
  second?: number
  seconds?: number
}

export function timeToMilliseconds({
  day = 0,
  days = 0,
  hour = 0,
  hours = 0,
  minute = 0,
  minutes = 0,
  second = 0,
  seconds = 0,
}: Time) {
  const SECOND = 1000
  const MINUTE = 60 * SECOND
  const HOUR = 60 * MINUTE
  const DAY = 24 * HOUR

  return (
    (day + days) * DAY +
    (hour + hours) * HOUR +
    (minute + minutes) * MINUTE +
    (second + seconds) * SECOND
  )
}
