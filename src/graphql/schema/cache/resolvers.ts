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
import { ForbiddenError } from 'apollo-server'

import { Instance } from '../../../types'
import { MajorDimension } from '../../data-sources/google-spreadsheet-api'
import { resolveConnection } from '../connection'
import { Service } from '../types'
import { CacheResolvers } from './types'

export const resolvers: CacheResolvers = {
  Query: {
    async _cacheKeys(_parent, { ...cursorPayload }, { dataSources }) {
      const cacheKeys = await dataSources.serlo.getAllCacheKeys()
      return resolveConnection<string>({
        nodes: cacheKeys,
        payload: cursorPayload,
        createCursor(node) {
          return node
        },
      })
    },
  },
  Mutation: {
    async _setCache(_parent, { key, value }, { dataSources, service }) {
      if (service !== Service.Serlo) {
        throw new ForbiddenError(
          'You do not have the permissions to set the cache'
        )
      }
      await dataSources.serlo.setCache(key, value)
      return null
    },
    async _removeCache(_parent, { key }, { dataSources, service }) {
      if (service !== Service.Serlo) {
        throw new ForbiddenError(
          'You do not have the permissions to remove the cache'
        )
      }
      await dataSources.serlo.removeCache(key)
      return null
    },
    async _updateCache(_parent, { keys }, { dataSources, service }) {
      if (service !== Service.Serlo) {
        throw new ForbiddenError(
          'You do not have the permissions to update the cache'
        )
      }
      await Promise.all(
        keys.map(async (key) => {
          if (key.includes('serlo.org')) {
            const instance = key.slice(0, 2)
            if (!Object.values(Instance).includes(instance as Instance)) {
              throw new Error(`"${instance}" is not a valid instance`)
            }
            const path = key.slice('xx.serlo.org'.length)
            await dataSources.serlo.updateCache({
              path,
              instance,
              cacheKey: key,
            })
          } else if (key.includes('spreadsheet-')) {
            const sslen = 'spreadsheet-'.length
            const googleIdLength = 44
            const spreadsheetId = key.slice(sslen, sslen + googleIdLength)
            const [, range, majorDimension] = key
              .slice(sslen + googleIdLength)
              .split('-')
            await dataSources.googleSheetApi.getValues({
              spreadsheetId,
              range,
              majorDimension: majorDimension as MajorDimension,
              ignoreCache: true,
            })
          } else {
            throw new Error(`"${key}" is not a valid key`)
          }
        })
      )
      return null
    },
  },
}
