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

describe('throws an error', () => {
  test('when first > limit', () => {
    expect(() => {
      resolveConnection({
        nodes: R.range(1, 2000),
        payload: { first: 1000 },
        createCursor: (node) => node.toString(),
        limit: 500,
      })
    }).toThrowError(UserInputError)
  })

  test('when last > limit', () => {
    expect(() => {
      resolveConnection({
        nodes: R.range(1, 2000),
        payload: { last: 1000 },
        createCursor: (node) => node.toString(),
        limit: 500,
      })
    }).toThrowError(UserInputError)
  })

  test('when first and last is set (because then the behavior is ambiguous)', () => {
    expect(() => {
      resolveConnection({
        nodes: R.range(1, 2000),
        payload: { last: 10, first: 10 },
        createCursor: (node) => node.toString(),
        limit: 500,
      })
    }).toThrowError(UserInputError)
  })
})
