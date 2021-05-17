import type { ApolloServerPlugin } from 'apollo-server-plugin-base'
import * as R from 'ramda'

import { InvalidCurrentValueError } from '~/internals/data-source-helper'
import { Environment } from '~/internals/environment'
import { createSerloModel } from '~/model'
import {
  DiscriminatorType,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'

const uuidTypes: string[] = [
  ...Object.values(DiscriminatorType),
  ...Object.values(EntityType),
  ...Object.values(EntityRevisionType),
]

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
                uuidTypes.includes(info.parentType.name) &&
                R.has('id', source)
              ) {
                uuids.push(source.id as number)
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
            await Promise.all(
              uuids.map((id) => {
                return environment.cache.remove({
                  key: serloModel.getUuid._querySpec.getKey({ id }),
                })
              })
            )
          }
        },
      }
    },
  }
}
