import Bull from 'bull'
import { option as O } from 'fp-ts'
import fetch from 'node-fetch'
import * as R from 'ramda'

import {
  BackgroundTask,
  BackgroundTasks,
  Cache,
  Timer,
} from '../graphql/environment'
import { Instance } from '../types'

export function createRedisBackgroundTasks({
  cache,
  timer,
  host,
}: {
  cache: Cache
  timer: Timer
  host: string
}): BackgroundTasks {
  const queue = new Bull<BackgroundTask>('tasks', host)
  void queue.process(async function (job) {
    const { key, maxAge } = job.data
    const cacheEntry = await cache.get<unknown>(key)

    if (O.isNone(cacheEntry)) return

    const cacheValue = cacheEntry.value
    const entry = isEntry<unknown>(cacheValue)
      ? cacheValue
      : { key, value: cacheValue, lastModified: timer.now() }

    const age = timer.now() - entry.lastModified

    if (maxAge === undefined || age <= maxAge * 1000) return

    const newValue = await update(key, entry.value)
    console.log(newValue)
    return await cache.set(key, {
      value: newValue,
      lastModified: timer.now(),
    })
  })

  return {
    async schedule(task) {
      console.log('scheduling')
      await queue.add(task)
    },
  }
}

interface Entry<Value> {
  value: Value
  lastModified: number
}

function isEntry<Value>(entry: unknown): entry is Entry<Value> {
  return R.has('lastModified', entry) && R.has('value', entry)
}

async function update(key: string, _currentValue: unknown) {
  const instanceStr = key.slice(0, 2)
  if (!Object.values(Instance).includes(instanceStr as Instance)) {
    throw new Error(`"${instanceStr}" is not a valid instance`)
  }
  const instance = instanceStr as Instance
  const path = key.slice('xx.serlo.org'.length)
  const res = await fetch(
    `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`
  )
  return (await res.json()) as unknown
}
