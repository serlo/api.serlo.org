import { option as O } from 'fp-ts'
import jwt from 'jsonwebtoken'
import * as R from 'ramda'

// TODO: review, might want to move some stuff
import { HOUR, MINUTE } from '../graphql/data-sources'
import {
  AbstractUuidPayload,
  AliasPayload,
  decodePath,
  encodePath,
  EntityPayload,
  isUnsupportedUuid,
  Navigation,
  NavigationPayload,
  NodeData,
} from '../graphql/schema'
import { Service } from '../graphql/schema/types'
import { Environment } from '../internals/environment'
import { createHelper, createQuery, FetchHelpers } from '../internals/model'
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

  const getActiveReviewerIds = createQuery<undefined, number[]>(
    {
      getCurrentValue: async () => {
        return await get<number[]>({
          path: '/api/user/active-reviewers',
        })
      },
      maxAge: 1 * HOUR,
      getKey: () => {
        return 'de.serlo.org/api/user/active-reviewers'
      },
      getPayload: (key: string) => {
        if (key !== 'de.serlo.org/api/user/active-reviewers') return O.none
        return O.some(undefined)
      },
    },
    environment
  )
  const getNavigationPayload = createQuery<
    { instance: Instance },
    NavigationPayload
  >(
    {
      getCurrentValue: async ({ instance }) => {
        return await get<NavigationPayload>({
          path: '/api/navigation',
          instance,
        })
      },
      maxAge: 1 * HOUR,
      getKey: ({ instance }) => {
        return `${instance}.serlo.org/api/navigation`
      },
      getPayload: (key: string) => {
        const instance = getInstanceFromKey(key)
        return instance && key === `${instance}.serlo.org/api/navigation`
          ? O.some({ instance })
          : O.none
      },
    },
    environment
  )

  const getNavigation = createHelper<
    { instance: Instance; id: number },
    Navigation | null
  >({
    helper: async ({ instance, id }) => {
      const payload = await getNavigationPayload({ instance })
      const { data } = payload

      const leaves: Record<string, number> = {}

      const findLeaves = (node: NodeData): number[] => {
        return [
          ...(node.id ? [node.id] : []),
          ...R.flatten(R.map(findLeaves, node.children || [])),
        ]
      }

      for (let i = 0; i < data.length; i++) {
        findLeaves(data[i]).forEach((id) => {
          leaves[id] = i
        })
      }

      const treeIndex = leaves[id]

      if (treeIndex === undefined) return null

      const findPathToLeaf = (node: NodeData, leaf: number): NodeData[] => {
        if (node.id !== undefined && node.id === leaf) {
          return [node]
        }

        if (node.children === undefined) return []

        const childPaths = node.children.map((childNode) => {
          return findPathToLeaf(childNode, leaf)
        })
        const goodPaths = childPaths.filter((path) => {
          return path.length > 0
        })
        if (goodPaths.length === 0) return []
        return [node, ...goodPaths[0]]
      }

      const nodes = findPathToLeaf(data[treeIndex], id)
      const path = []

      for (let i = 0; i < nodes.length; i++) {
        const nodeData = nodes[i]
        const uuid = nodeData.id
          ? ((await getUuid({
              id: nodeData.id,
            })) as EntityPayload)
          : null
        const node = {
          label: nodeData.label,
          url: (uuid ? uuid.alias : null) || nodeData.url || null,
          id: uuid ? uuid.id : null,
        }
        path.push(node)
      }

      return {
        data: data[treeIndex],
        path,
      }
    },
  })

  const getAlias = createQuery<
    { path: string; instance: Instance },
    AliasPayload
  >(
    {
      getCurrentValue: async ({ path, instance }) => {
        const cleanPath = encodePath(decodePath(path))
        return get({ path: `/api/alias${cleanPath}`, instance })
      },
      maxAge: 5 * MINUTE,
      getKey: ({ path, instance }) => {
        const cleanPath = encodePath(decodePath(path))
        return `${instance}.serlo.org/api/alias${cleanPath}`
      },
      getPayload: (key) => {
        const instance = getInstanceFromKey(key)
        const prefix = `${instance || ''}.serlo.org/api/alias`
        return instance && key.startsWith(prefix)
          ? O.some({ instance, path: key.replace(prefix, '') })
          : O.none
      },
    },
    environment
  )

  return {
    getActiveAuthorIds,
    getActiveReviewerIds,
    getAlias,
    getNavigationPayload,
    getNavigation,
    getUuid,
  }
}

function getInstanceFromKey(key: string): Instance | null {
  const instance = key.slice(0, 2)
  return key.startsWith(`${instance}.serlo.org`) && isInstance(instance)
    ? instance
    : null
}

function isInstance(instance: string): instance is Instance {
  return Object.values(Instance).includes(instance as Instance)
}
