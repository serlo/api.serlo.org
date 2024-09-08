import { Connection, ConnectionPayload } from './types'
import { UserInputError } from '~/errors'

/** @see https://relay.dev/graphql/connections.htm */
export function resolveConnection<T>({
  nodes,
  payload,
  createCursor,
  limit = 500,
}: {
  nodes: T[]
  payload: ConnectionPayload
  createCursor: (node: T) => string
  limit?: number
}): Connection<T> {
  const { after, first = limit } = payload

  if (first != null && first > limit) {
    throw new UserInputError(`first cannot be higher than limit=${limit}`)
  }

  let startIndex = 0
  let endIndex = nodes.length

  if (after != null) {
    startIndex = nodes.findIndex((node) => encodeCursor(node) === after) + 1
  }

  if (first != null) endIndex = Math.min(endIndex, startIndex + first)

  const selectedNodes = nodes.slice(startIndex, endIndex)
  const lastSelectNode = selectedNodes.at(-1)

  return {
    nodes: selectedNodes,
    totalCount: nodes.length,
    pageInfo: {
      hasNextPage: endIndex < nodes.length,
      endCursor:
        lastSelectNode !== undefined ? encodeCursor(lastSelectNode) : null,
    },
  }

  function encodeCursor(node: T) {
    return Buffer.from(createCursor(node)).toString('base64')
  }
}
