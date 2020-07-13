import * as R from 'ramda'

export interface Connection<T> {
  edges: Cursor<T>[]
  nodes: T[]
  totalCount: number
  pageInfo: PageInfo
}

export interface ConnectionPayload {
  after?: string
  before?: string
  first?: number
  last?: number
}

export interface Cursor<T> {
  cursor: string
  node: T
}

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

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
  const allEdges = R.map<T, Cursor<T>>((node) => {
    return {
      cursor: Buffer.from(createCursor(node)).toString('base64'),
      node,
    }
  }, nodes)
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
    if (first === undefined) return xs
    if (first < 0) throw new Error('`first` cannot be negative')
    return R.take(first, xs)
  }

  function handleLast(xs: Cursor<T>[]): Cursor<T>[] {
    if (last === undefined) return xs
    if (last < 0) throw new Error('`last` cannot be negative')
    return R.takeLast(last, xs)
  }

  function hasPreviousPage() {
    if (last !== undefined) return applyCursorToEdgesResult.length > last
    if (after !== undefined) return getAfterIndex() > 0
    return false
  }

  function hasNextPage() {
    if (first !== undefined) return applyCursorToEdgesResult.length > first
    if (before !== undefined) return getBeforeIndex() + 1 < allEdges.length
    return false
  }
}
