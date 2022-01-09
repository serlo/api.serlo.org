/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { UserInputError } from 'apollo-server'
import * as R from 'ramda'

import { Connection, ConnectionPayload } from './types'

/** @see https://relay.dev/graphql/connections.htm */
export function resolveConnection<T>({
  nodes,
  payload,
  createCursor,
  limit = 500,
}: {
  nodes: T[]
  payload: ConnectionPayload
  createCursor(node: T): string
  limit?: number
}): Connection<T> {
  const { before, after, last } = payload
  let { first } = payload

  if (first != null && first > limit) {
    throw new UserInputError(`first cannot be higher than limit=${limit}`)
  }
  if (last != null && last > limit) {
    throw new UserInputError(`last cannot be higher than limit=${limit}`)
  }
  if (first != null && last != null) {
    throw new UserInputError(
      '`first` and `last` cannot be set at the same time'
    )
  }
  if (first == null && last == null) {
    first = limit
  }

  let startIndex = 0
  let endIndex = nodes.length

  if (after != null) {
    startIndex = nodes.findIndex((node) => encodeCursor(node) === after) + 1
  }
  if (before != null) {
    endIndex = R.findLastIndex((node) => encodeCursor(node) === before, nodes)
    if (endIndex < 0) endIndex = nodes.length
  }

  if (first != null) endIndex = Math.min(endIndex, startIndex + first)
  if (last != null) startIndex = Math.max(startIndex, endIndex - last)

  const selectedNodes = nodes.slice(startIndex, endIndex)
  const edges = selectedNodes.map((node) => {
    return { cursor: encodeCursor(node), node }
  })

  return {
    edges,
    nodes: selectedNodes,
    totalCount: nodes.length,
    pageInfo: {
      hasPreviousPage: startIndex > 0,
      hasNextPage: endIndex < nodes.length,
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    },
  }

  function encodeCursor(node: T) {
    return Buffer.from(createCursor(node)).toString('base64')
  }
}
