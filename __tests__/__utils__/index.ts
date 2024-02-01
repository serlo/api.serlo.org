import * as R from 'ramda'

import { castToUuid, Uuid } from '~/model/decoder'

export * from './assertions'
export * from './handlers'
export * from './services'
export * from './test-client'

export { castToUuid, castToAlias } from '~/model/decoder'

export function getTypenameAndId(value: { __typename: string; id: number }) {
  return R.pick(['__typename', 'id'], value)
}

export function nextUuid(id: Uuid): Uuid {
  return castToUuid((id as number) + 1)
}
