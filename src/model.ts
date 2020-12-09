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
import { either as E, pipeable } from 'fp-ts'
import * as t from 'io-ts'
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray'
import { failure } from 'io-ts/lib/PathReporter'
import jwt from 'jsonwebtoken'
import fetch, { RequestInit } from 'node-fetch'
import * as R from 'ramda'

import { Cache } from './cache'
import { ErrorEvent } from './error-event'
import { Service } from './graphql/schema/types'
import { LockManager } from './lock-manager'
import { log } from './log'
import { Instance } from './types'

type Fetch<Result = unknown> = (
  init: RequestInit & { path: string; params?: Record<string, string> }
) => Promise<Result>

export interface Model {
  update(key: string): Promise<void>
}

const defaultFetch: Fetch = async ({ path, params, ...init }) => {
  const url = new URL(path)
  if (params !== undefined) {
    for (const [name, value] of Object.entries(params)) {
      url.searchParams.append(name, value)
    }
  }
  const response = await fetch(url.toString(), init)
  return (await response.json()) as unknown
}

// Decouple our business logic from the actual used fetch. This way, we can use Apollo's internals, too.
export function createModel({
  cache,
  lockManager,
  fetch = defaultFetch,
}: {
  cache: Cache
  lockManager: LockManager
  fetch?: Fetch
}) {
  // TODO: might move that into cache itself?
  async function setCacheWithLock(key: string, f: () => Promise<unknown>) {
    try {
      const lock = await lockManager.lock(key)
      try {
        const value = await f()
        await cache.set(key, value)
      } catch (e) {
        log.error('Error while trying to update key', key, ':', e)
      } finally {
        await lock.unlock()
      }
    } catch (e) {
      log.debug('Key', key, 'already locked:', e)
    }
  }

  enum MajorDimension {
    Rows = 'ROWS',
    Columns = 'COLUMNS',
  }

  interface Arguments {
    spreadsheetId: string
    range: string
    majorDimension?: MajorDimension
  }
  const CellValues = nonEmptyArray(t.array(t.string))
  type CellValues = t.TypeOf<typeof CellValues>

  const ValueRange = t.intersection([
    t.partial({
      values: CellValues,
    }),
    t.type({
      range: t.string,
      majorDimension: t.string,
    }),
  ])
  type ValueRange = t.TypeOf<typeof ValueRange>

  async function getSpreadValuesWithoutCache(
    args: Required<Arguments>
  ): Promise<E.Either<ErrorEvent, CellValues>> {
    const { spreadsheetId, range, majorDimension } = args
    let result: E.Either<ErrorEvent, CellValues>

    try {
      const response = await fetch({
        path: `${spreadsheetId}/values/${range}`,
        params: {
          majorDimension,
          key: process.env.GOOGLE_API_KEY,
        },
      })
      result = pipeable.pipe(
        response,
        (res) => ValueRange.decode(res),
        E.mapLeft((errors) => {
          return {
            message: `invalid response while accessing spreadsheet "${spreadsheetId}"`,
            contexts: { response, validationErrors: failure(errors) },
          }
        }),
        E.map((v) => v.values),
        E.chain(
          E.fromNullable({
            message: `range "${range}" of spreadsheet "${spreadsheetId}" is empty`,
          })
        )
      )
    } catch (error) {
      const exception =
        error instanceof Error ? error : new Error(JSON.stringify(error))

      result = E.left({
        message: `an error occured while accessing spreadsheet "${spreadsheetId}"`,
        exception,
      })
    }

    return E.mapLeft((event: ErrorEvent) =>
      R.mergeDeepRight({ contexts: { args } }, event)
    )(result)
  }

  return {
    async update(key: string) {
      if (key.includes('serlo.org')) {
        const instance = key.slice(0, 2)
        if (!isInstance(instance)) {
          throw new Error(`"${instance} is not a valid instance.`)
        }
        const path = key.slice(`${instance}.serlo.org`.length)
        await setCacheWithLock(key, async () => {
          const token = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
            expiresIn: '2h',
            audience: Service.Serlo,
            issuer: 'api.serlo.org',
          })
          return await fetch({
            path: `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
            headers: {
              Authorization: `Serlo Service=${token}`,
            },
          })
        })
      } else if (key.includes('spreadsheet-')) {
        const sslen = 'spreadsheet-'.length
        const googleIdLength = 44
        const spreadsheetId = key.slice(sslen, sslen + googleIdLength)
        const [, range, majorDimension] = key
          .slice(sslen + googleIdLength)
          .split('-')

        await setCacheWithLock(key, async () => {
          return await getSpreadValuesWithoutCache({
            spreadsheetId,
            range,
            majorDimension: majorDimension as MajorDimension,
          })
        })
      }
    },
  }
}

export function isInstance(instance: string): instance is Instance {
  return Object.values(Instance).includes(instance as Instance)
}
