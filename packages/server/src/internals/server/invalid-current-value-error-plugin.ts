import type { ApolloServerPlugin } from 'apollo-server-plugin-base'
import * as R from 'ramda'

import { InvalidCurrentValueError } from '~/internals/data-source-helper'
import { Environment } from '~/internals/environment'
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
    requestDidStart() {
      const uuids: number[] = []
      return {
        executionDidStart() {
          return {
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
            await serloModel.getUuid._querySpec.removeCache({
              payloads: uuids.map((id) => {
                return { id }
              }),
            })
          }
        },
      }
    },
  }
}
