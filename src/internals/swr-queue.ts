/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import Queue from 'bee-queue'
import { option as O } from 'fp-ts'
import * as R from 'ramda'

import { Cache, Priority } from './cache'
import { log } from './log'
import { createFetchHelpersFromNodeFetch, isQuery, QuerySpec } from './model'
import { redisUrl } from './redis-url'
import { Timer } from './timer'
import { modelFactories } from '~/model'

export interface SwrQueue {
  queue(updateJob: UpdateJob): Promise<never>
  ready(): Promise<void>
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
  quit() {
    return Promise.resolve()
  },
  _queue: undefined as never,
}

export const queueName = 'swr'

export function createSwrQueue(): SwrQueue {
  const queue = new Queue<UpdateJob>(queueName, {
    redis: {
      url: redisUrl,
    },
    isWorker: false,
    removeOnFailure: true,
    removeOnSuccess: true,
  })

  return {
    _queue: (queue as unknown) as never,
    async queue(updateJob) {
      log.debug('Queuing job', updateJob.key)
      // By setting the job's ID, we make sure that there will be only one update job for the same key
      // See also https://github.com/bee-queue/bee-queue#jobsetidid
      const job = await queue.createJob(updateJob).setId(updateJob.key).save()

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
  quit(): Promise<void>
  _queue: never
} {
  const args = {
    environment: {
      cache,
      swrQueue: emptySwrQueue,
    },
    fetchHelpers: createFetchHelpersFromNodeFetch(),
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

  queue.process(
    concurrency,
    async (job): Promise<string> => {
      const { key } = job.data
      const cacheEntry = await cache.get<unknown>({ key })
      if (O.isNone(cacheEntry)) {
        return 'Skipped update because cache empty.'
      }
      const spec = getSpec(key)
      if (spec === null) {
        return 'Skipped update because invalid key.'
      }
      const maxAge =
        spec.maxAge === undefined ? undefined : timeToMilliseconds(spec.maxAge)
      const age = timer.now() - cacheEntry.value.lastModified
      if (maxAge === undefined || age <= maxAge) {
        return 'Skipped update because cache non-stale.'
      }
      const payload = spec.getPayload(key)
      if (O.isNone(payload)) {
        return 'Skipped updated because invalid key.'
      }
      await cache.set({
        key,
        priority: Priority.Low,
        getValue: async (current) => {
          return await spec.getCurrentValue(payload.value, current ?? null)
        },
      })
      return 'Updated because stale'
    }
  )

  return {
    _queue: (queue as unknown) as never,
    async ready() {
      await queue.ready()
    },
    async quit() {
      await queue.close()
    },
  }
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
  const HOUR = 60 * minute
  const DAY = 24 * hour

  return (
    (day + days) * DAY +
    (hour + hours) * HOUR +
    (minute + minutes) * MINUTE +
    (second + seconds) * SECOND
  )
}
