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

import { Cache } from './cache'
import { log } from './log'
import { Model } from './model'
import { Timer } from './timer'

export interface SwrQueue {
  queue(updateJob: UpdateJob): Promise<Queue.Job<UpdateJob>>
  ready(): Promise<void>
  flush(): Promise<void>
  quit(): Promise<void>
}

export interface UpdateJob {
  key: string
  maxAge?: number
}

export function createSwrQueue({
  cache,
  model,
  timer,
  host,
}: {
  cache: Cache
  model: Model
  timer: Timer
  host: string
}): SwrQueue {
  const queue = new Queue<UpdateJob>('swr', {
    redis: {
      host,
    },
  })

  queue.process(
    async (job): Promise<string> => {
      const { key, maxAge } = job.data
      const cacheEntry = await cache.get<unknown>(key)
      if (O.isNone(cacheEntry)) {
        return 'Skipped update because cache empty.'
      }
      const age = timer.now() - cacheEntry.value.lastModified
      if (maxAge === undefined || age <= maxAge * 1000) {
        return `Skipped update because cache non-stale.`
      }
      await model.update(key)
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

      return job
    },
    async flush() {
      await queue.destroy()
    },
    async ready() {
      await queue.ready()
    },
    async quit() {
      await queue.close()
    },
  }
}
