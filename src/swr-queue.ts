/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import Queue from 'bee-queue'
import { option as O } from 'fp-ts'

import { Cache, Priority } from './cache'
import {
  createFetchHelpersFromNodeFetch,
  isQuery,
  QuerySpec,
} from './internals/model'
import { log } from './log'
import { createSerloModel } from './model/serlo'
import { redisUrl } from './redis-url'
import { Timer } from './timer'

export interface SwrQueue {
  queue(updateJob: UpdateJob): Promise<never>
  ready(): Promise<void>
  quit(): Promise<void>
}

export interface UpdateJob {
  key: string
  maxAge?: number
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
}

export function createSwrQueue({
  cache,
  timer,
}: {
  cache: Cache
  timer: Timer
}): SwrQueue {
  // TODO: this should probably be somewhere else
  const models = [
    createSerloModel({
      environment: {
        cache,
        swrQueue: emptySwrQueue,
      },
      fetchHelpers: createFetchHelpersFromNodeFetch(),
    }),
  ]

  function getSpec(key: string): QuerySpec<unknown, unknown> | null {
    for (const model of models) {
      for (const prop of Object.values(model)) {
        if (isQuery(prop) && O.isSome(prop._spec.getPayload(key))) {
          return prop._spec
        }
      }
    }
    return null
  }

  const queue = new Queue<UpdateJob>('swr', {
    redis: {
      url: redisUrl,
    },
  })

  queue.process(
    async (job): Promise<string> => {
      const { key } = job.data
      const cacheEntry = await cache.get<unknown>({ key })
      if (O.isNone(cacheEntry)) {
        return 'Skipped update because cache empty.'
      }
      const spec = getSpec(key)
      if (spec === null) {
        return 'Skipped update because invalid key'
      }
      const maxAge = spec.maxAge
      const age = timer.now() - cacheEntry.value.lastModified
      if (maxAge === undefined || age <= maxAge * 1000) {
        return `Skipped update because cache non-stale.`
      }
      const payload = spec.getPayload(key)
      if (O.isNone(payload)) {
        return 'Skipped updated because invalid key'
      }
      await cache.set({
        key,
        priority: Priority.Low,
        getValue: async () => {
          // TODO: here we should probably again get the cache entry so it's still up-to-date
          const cacheEntry = await cache.get<unknown>({ key })

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return await spec.getCurrentValue(
            payload.value,
            O.isSome(cacheEntry) ? cacheEntry.value.value : null
          )
        },
      })
      return 'Updated because stale'
    }
  )

  return {
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
