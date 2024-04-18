import * as R from 'ramda'

import { UserInputError } from '~/errors'
import { ConnectionPayload } from '~/schema/connection/types'
import { resolveConnection } from '~/schema/connection/utils'

describe('resolveConnection', () => {
  const nodes = R.range(1, 10)
  const edges = R.map((node) => {
    return {
      cursor: Buffer.from(node.toString()).toString('base64'),
      node,
    }
  }, nodes)
  function getResult(payload: ConnectionPayload) {
    return resolveConnection({
      nodes,
      payload,
      createCursor(node: number) {
        return node.toString()
      },
    })
  }

  test('without payload', () => {
    expect(getResult({})).toEqual({
      nodes,
      totalCount: 9,
      pageInfo: {
        hasNextPage: false,
        endCursor: edges[8].cursor,
      },
    })
  })

  test('forward pagination (by 5)', () => {
    const page1 = getResult({ first: 5 })
    expect(page1).toEqual({
      nodes: nodes.slice(0, 5),
      totalCount: 9,
      pageInfo: {
        hasNextPage: true,
        endCursor: edges[4].cursor,
      },
    })
    const page2 = getResult({ first: 5, after: page1.pageInfo.endCursor! })
    expect(page2).toEqual({
      nodes: nodes.slice(5, 9),
      totalCount: 9,
      pageInfo: {
        hasNextPage: false,
        endCursor: edges[8].cursor,
      },
    })
  })
})

test('sets "first = limit" when first and limit are not defined', () => {
  const result = resolveConnection({
    nodes: R.range(1, 2000),
    payload: {},
    createCursor: (node) => node.toString(),
    limit: 500,
  })

  expect(result.nodes.length).toBe(500)
})

test('throws an error when first > limit', () => {
  expect(() => {
    resolveConnection({
      nodes: R.range(1, 2000),
      payload: { first: 1000 },
      createCursor: (node) => node.toString(),
      limit: 500,
    })
  }).toThrowError(UserInputError)
})
