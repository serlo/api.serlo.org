import { option as O } from 'fp-ts'
import jwt from 'jsonwebtoken'

// TODO: review, might want to move some stuff
import { HOUR, MINUTE } from '../graphql/data-sources'
import { AbstractUuidPayload, isUnsupportedUuid } from '../graphql/schema'
import { Service } from '../graphql/schema/types'
import { Environment } from '../internals/environment'
import { createQuery, FetchHelpers } from '../internals/model'
import { Instance } from '../types'

export function createSerloModel({
  environment,
  fetchHelpers,
}: {
  environment: Environment
  fetchHelpers: FetchHelpers
}) {
  function get<T>({
    path,
    instance = Instance.De,
  }: {
    path: string
    instance?: Instance
  }): Promise<T> {
    const token = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      expiresIn: '2h',
      audience: Service.Serlo,
      issuer: 'api.serlo.org',
    })
    return fetchHelpers.get(
      `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
      {},
      {
        headers: {
          Authorization: `Serlo Service=${token}`,
        },
      }
    )
  }

  const getUuid = createQuery<{ id: number }, AbstractUuidPayload | null>(
    {
      getCurrentValue: async ({ id }) => {
        const uuid = await get<AbstractUuidPayload | null>({
          path: `/api/uuid/${id}`,
        })
        return uuid === null || isUnsupportedUuid(uuid) ? null : uuid
      },
      maxAge: 5 * MINUTE,
      getKey: ({ id }) => {
        return `de.serlo.org/api/uuid/${id}`
      },
      getPayload: (key) => {
        if (!key.startsWith('de.serlo.org/api/uuid/')) return O.none
        const id = parseInt(key.replace('de.serlo.org/api/uuid/', ''), 10)
        return O.some({ id })
      },
    },
    environment
  )

  const getActiveAuthorIds = createQuery<undefined, number[]>(
    {
      getCurrentValue: async () => {
        return await get<number[]>({
          path: '/api/user/active-authors',
        })
      },
      maxAge: 1 * HOUR,
      getKey: () => {
        return 'de.serlo.org/api/user/active-authors'
      },
      getPayload: (key: string) => {
        if (key !== 'de.serlo.org/api/user/active-authors') return O.none
        return O.some(undefined)
      },
    },
    environment
  )

  return {
    getActiveAuthorIds,
    getUuid,
  }
}
