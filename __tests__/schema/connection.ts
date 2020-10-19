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
import * as R from 'ramda'

import {
  ConnectionPayload,
  resolveConnection,
  Connection,
} from '../../src/graphql/schema'

describe('resolveConnection', () => {
  describe('cursor', () => {
    let cursors: string[]

    beforeAll(() => {
      cursors = getCursors(R.range(0, 1000))
    })

    test('is uniq for each node', () => {
      expect(R.uniq(cursors).length).toBe(1000)
    })

    test('is a short string (length < 7)', () => {
      const maxLength = cursors.map((cursor) => cursor.length).reduce(R.max)

      expect(maxLength).toBeLessThan(7)
    })
  })

  describe('results', () => {
    const nodes = R.range(1, 10)
    let edges: Connection<number>['edges']

    beforeAll(() => {
      edges = R.zip(nodes, getCursors(nodes)).map(([node, cursor]) => {
        return { node, cursor }
      })
    })

    test('without payload', () => {
      expect(getResult({})).toEqual({
        edges,
        nodes,
        totalCount: 9,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: edges[0].cursor,
          endCursor: edges[8].cursor,
        },
      })
    })

    test('forward pagination (by 5)', () => {
      const page1 = getResult({ first: 5 })
      expect(page1).toEqual({
        edges: edges.slice(0, 5),
        nodes: nodes.slice(0, 5),
        totalCount: 9,
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: edges[0].cursor,
          endCursor: edges[4].cursor,
        },
      })

      const page2 = getResult({ first: 5, after: page1.pageInfo.endCursor! })
      expect(page2).toEqual({
        edges: edges.slice(5, 9),
        nodes: nodes.slice(5, 9),
        totalCount: 9,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: true,
          startCursor: edges[5].cursor,
          endCursor: edges[8].cursor,
        },
      })
    })

    test('backward pagination (by 5)', () => {
      const page1 = getResult({ last: 5 })
      expect(page1).toEqual({
        edges: edges.slice(4, 9),
        nodes: nodes.slice(4, 9),
        totalCount: 9,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: true,
          startCursor: edges[4].cursor,
          endCursor: edges[8].cursor,
        },
      })

      const page2 = getResult({ last: 5, before: page1.pageInfo.startCursor! })
      expect(page2).toEqual({
        edges: edges.slice(0, 4),
        nodes: nodes.slice(0, 4),
        totalCount: 9,
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: edges[0].cursor,
          endCursor: edges[3].cursor,
        },
      })
    })

    function getResult(payload: ConnectionPayload) {
      return createConnection(nodes, payload)
    }
  })

  function getCursors(nodes: number[]) {
    return createConnection(nodes).edges.map((edge) => edge.cursor)
  }

  function createConnection(nodes: number[], payload: ConnectionPayload = {}) {
    return resolveConnection({ nodes, payload, createCursor: R.toString })
  }
})
