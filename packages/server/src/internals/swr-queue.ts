import Queue from 'bee-queue'
import { either as E, option as O } from 'fp-ts'
import * as t from 'io-ts'
import * as R from 'ramda'

import { createAuthServices } from './authentication'
import { isLegacyQuery, LegacyQuery } from './data-source-helper'
import { log } from './log'
import { type Context } from '~/context'
import { CacheEntry, Cache, Priority } from '~/context/cache'
import { SwrQueue } from '~/context/swr-queue'
import { Database } from '~/database'
import { captureErrorEvent } from '~/error-event'
import { modelFactories } from '~/model'
import { cachedResolvers } from '~/schema'
import { Timer, Time, timeToSeconds, timeToMilliseconds } from '~/timer'

const INVALID_VALUE_RECEIVED =
  'SWR-Queue: Invalid value received from data source.'

interface UpdateJob {
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
      authServices: createAuthServices(),
    },
  }
  const models = R.values(modelFactories).map((createModel) =>
    createModel(args),
  )
  const legacyQueries = models.flatMap((model) =>
    Object.values(model).filter(isLegacyQuery),
  )

  const queue = new Queue<UpdateJob>(queueName, {
    redis: { url: process.env.REDIS_URL },
    isWorker: false,
    removeOnFailure: true,
    removeOnSuccess: true,
  })

  queue.on('error', (err) => {
    log.error(`Queue error event - ${err.message}`)
  })

  return {
    _queue: queue as unknown as never,
    async queue(updateJob) {
      const { key, cacheEntry } = updateJob

      const result = await shouldProcessJob({
        key,
        cache,
        legacyQueries,
        timer,
        cacheEntry,
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

      job.on('failed', (error) => {
        reportError({ jobStatus: 'failed', error })
        log.error(`Job ${job.id} failed with error ${error.message}`)
      })

      job.on('retrying', (error) => {
        reportError({ jobStatus: 'retrying', error })
        log.debug(
          `Job ${job.id} failed with error ${error.message} but is being retried!`,
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
  database,
}: {
  cache: Cache
  timer: Timer
  concurrency: number
  database: Database
}): {
  checkStalledJobs(timeout: number): Promise<void>
  ready(): Promise<void>
  healthy(): Promise<void>
  quit(): Promise<void>
  _queue: never
} {
  const args = {
    environment: {
      cache,
      swrQueue: emptySwrQueue,
      authServices: createAuthServices(),
    },
  }
  const models = R.values(modelFactories).map((createModel) =>
    createModel(args),
  )
  const legacyQueries = models.flatMap((model) =>
    Object.values(model).filter(isLegacyQuery),
  )

  const queue = new Queue<UpdateJob>(queueName, {
    redis: { url: process.env.REDIS_URL },
    removeOnFailure: true,
    removeOnSuccess: true,
  })

  queue.process(concurrency, async (job): Promise<string> => {
    async function processJob() {
      const { key } = job.data

      const result = await shouldProcessJob({
        key,
        cache,
        legacyQueries,
        timer,
      })

      if (E.isLeft(result)) {
        return `Skipped update because ${result.left}`
      }

      const { spec, payload } = result.right

      await cache.set({
        key,
        ttlInSeconds: spec.maxAge ? timeToSeconds(spec.maxAge) : undefined,
        source: 'SWR worker',
        priority: Priority.Low,
        getValue: async () => {
          const value = await spec.getCurrentValue(payload, { database })

          if (spec.decoder.is(value)) {
            return value
          } else {
            captureErrorEvent({
              error: new Error(INVALID_VALUE_RECEIVED),
              location: 'SWR worker',
              fingerprint: ['invalid-value', 'swr', JSON.stringify(value)],
              errorContext: {
                key,
                invalidValue: value,
                decoder: spec.decoder.name,
              },
            })

            throw new Error(INVALID_VALUE_RECEIVED)
          }
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
    async checkStalledJobs(timeout: number) {
      await queue.checkStalledJobs(timeout)
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

async function shouldProcessJob({
  key,
  cache,
  legacyQueries,
  timer,
  cacheEntry,
}: {
  key: string
  cache: Cache
  legacyQueries: LegacyQuery<unknown, unknown>[]
  timer: Timer
  cacheEntry?: O.Option<CacheEntry<unknown>>
}): Promise<E.Either<string, { spec: JobSpec; payload: unknown }>> {
  function getSpec(key: string): JobSpec | null {
    for (const legacyQuery of legacyQueries) {
      if (O.isSome(legacyQuery._querySpec.getPayload(key))) {
        return {
          ...legacyQuery._querySpec,
          decoder: legacyQuery._querySpec.decoder ?? t.unknown,
        }
      }
    }
    for (const cachedResolver of cachedResolvers) {
      if (O.isSome(cachedResolver.spec.getPayload(key))) {
        // TODO: Change types so that `as` is not needed here
        return cachedResolver.spec as unknown as JobSpec
      }
    }
    return null
  }

  cacheEntry = cacheEntry ?? (await cache.get<unknown>({ key }))
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
  const staleAfter =
    spec.staleAfter === undefined
      ? undefined
      : timeToMilliseconds(spec.staleAfter)
  const age = timer.now() - cacheEntry.value.lastModified
  if (staleAfter === undefined || age <= staleAfter) {
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

// TODO: Merge with CachedResolverSpec in `cached-resolver.ts`
interface JobSpec<P = unknown> {
  decoder: { is: (a: unknown) => a is P; name: string }
  getPayload: (key: string) => O.Option<P>
  getCurrentValue: (
    payload: P,
    context: Pick<Context, 'database'>,
  ) => Promise<unknown>
  maxAge?: Time
  staleAfter?: Time
  enableSwr: boolean
}

function reportError({
  error,
  jobStatus,
}: {
  error: Error
  jobStatus: string
}) {
  if (error.message != INVALID_VALUE_RECEIVED) {
    captureErrorEvent({
      error,
      errorContext: { jobStatus },
      location: 'SWR worker',
    })
  }
}
