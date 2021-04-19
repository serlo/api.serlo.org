/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as R from 'ramda'

import { Connection, ConnectionPayload, Cursor } from './types'

/** @see https://relay.dev/graphql/connections.htm */
export function resolveConnection<T>({
  nodes,
  payload,
  createCursor,
}: {
  nodes: T[]
  payload: ConnectionPayload
  createCursor(node: T): string
}): Connection<T> {
  const { before, after, first, last } = payload
  const allEdges = nodes.map((node) => {
    return {
      cursor: Buffer.from(createCursor(node)).toString('base64'),
      node,
    }
  })
  const applyCursorToEdgesResult = applyCursorToEdges()
  const edges = R.pipe(handleFirst, handleLast)(applyCursorToEdgesResult)

  return {
    edges,
    nodes: R.map((edge) => edge.node, edges),
    totalCount: allEdges.length,
    pageInfo: {
      hasPreviousPage: hasPreviousPage(),
      hasNextPage: hasNextPage(),
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    },
  }

  function applyCursorToEdges() {
    let edges = allEdges
    if (after !== undefined) edges = edges.slice(getAfterIndex(edges) + 1)
    if (before !== undefined) edges = edges.slice(0, getBeforeIndex(edges))
    return edges
  }

  function getAfterIndex(xs = allEdges) {
    return R.findIndex((edge) => {
      return edge.cursor === after
    }, xs)
  }

  function getBeforeIndex(xs = allEdges) {
    return R.findIndex((edge) => {
      return edge.cursor === before
    }, xs)
  }

  function handleFirst(xs: Cursor<T>[]): Cursor<T>[] {
    if (first == null) return xs
    if (first < 0) throw new Error('`first` cannot be negative')
    return R.take(first, xs)
  }

  function handleLast(xs: Cursor<T>[]): Cursor<T>[] {
    if (last == null) return xs
    if (last < 0) throw new Error('`last` cannot be negative')
    return R.takeLast(last, xs)
  }

  function hasPreviousPage() {
    if (last != null) return applyCursorToEdgesResult.length > last
    if (after != null) return getAfterIndex() > 0
    return false
  }

  function hasNextPage() {
    if (first != null) return applyCursorToEdgesResult.length > first
    if (before != null) return getBeforeIndex() + 1 < allEdges.length
    return false
  }
}
