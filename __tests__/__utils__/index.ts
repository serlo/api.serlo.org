import * as R from 'ramda'

export * from './assertions'
export * from './handlers'
export * from './services'
export * from './query'

export function getTypenameAndId(value: { __typename: string; id: number }) {
  return R.pick(['__typename', 'id'], value)
}

export function nextUuid(id: number): number {
  return id + 1
}
