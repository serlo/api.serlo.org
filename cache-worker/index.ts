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
import { CacheWorker } from './src/cache-worker'
import { Service } from './src/lib'

const apiEndpoint = process.env.SERLO_ORG_HOST
const secret = process.env.SERLO_ORG_SECRET
const service = process.env.SERLO_SERVICE as Service
const cacheKeys = process.env.CACHE_KEYS

const cw = new CacheWorker({ apiEndpoint, secret, service })

const MAX_RETRIES = (process.env.CACHE_KEYS_RETRIES as unknown) as number

async function start() {
  console.log('Updating cache values of the following keys:', cacheKeys)
  run(0)
}

async function run(tries: number) {
  await cw.updateCache(cacheKeys!)
  if (cw.errLog == []) success()
  if (cw.errLog != [] && tries < MAX_RETRIES) {
    cw.errLog = []
    console.log('Retrying to update cache')
    setTimeout(async () => await run(++tries), 5000)
    return
  }
  failure()
}

function failure() {
  console.warn(
    'Cache update was run but the following errors were found',
    cw.errLog
  )
}

function success() {
  console.log('Cache successfully updated')
}

start()
