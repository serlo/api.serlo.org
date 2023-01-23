/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import type {
  ApolloServerPlugin,
  GraphQLRequestExecutionListener,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base'
import * as R from 'ramda'

import { InvalidCurrentValueError } from '~/internals/data-source-helper'
import { Environment } from '~/internals/environment'
import { Sentry } from '~/internals/sentry'
import { createSerloModel } from '~/model'
import { UuidDecoder } from '~/model/decoder'
import { isSupportedUuidType } from '~/schema/uuid/abstract-uuid/utils'

export function createInvalidCurrentValueErrorPlugin({
  environment,
}: {
  environment: Environment
}): ApolloServerPlugin {
  const serloModel = createSerloModel({ environment })
  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    async requestDidStart(): Promise<GraphQLRequestListener> {
      const uuids: number[] = []
      return {
        // eslint-disable-next-line @typescript-eslint/require-await
        async executionDidStart(): Promise<GraphQLRequestExecutionListener> {
          return {
            // eslint-disable-next-line @typescript-eslint/require-await
            willResolveField({ source, info }) {
              if (
                isSupportedUuidType(info.parentType.name) &&
                UuidDecoder.is(source)
              ) {
                uuids.push(source.id)
              }
            },
          }
        },
        async didEncounterErrors(requestContext) {
          const { errors } = requestContext
          const hasInvalidCurrentValueError = R.any((error) => {
            return error.originalError instanceof InvalidCurrentValueError
          }, errors)
          if (hasInvalidCurrentValueError) {
            const ids = R.uniq(uuids).sort()
            await serloModel.getUuid._querySpec.removeCache({
              payloads: ids.map((id) => {
                return { id }
              }),
            })
            Sentry.captureMessage(
              'Purging cache recursively because invalid value received from data source.',
              (scope) => {
                scope.setFingerprint([
                  'invalid-current-value-error-plugin',
                  JSON.stringify(ids),
                ])
                scope.setContext('cache', {
                  ids,
                })
                return scope
              }
            )
          }
        },
      }
    },
  }
}
