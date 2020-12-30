import * as R from 'ramda'

import { Instance, QueryUuidArgs } from '~/types'

export type AliasConfig = {
  [instance in Instance]?: Partial<Record<string, number>>
}

// Custom aliases that take precedence over any alias defined in serlo.org
export const aliases: AliasConfig = {
  [Instance.De]: {
    '/mathe': 19767,
    '/serlo': 18922,
  },
}

export function lookupCustomAlias(payload: {
  instance: Instance
  id: number
}): string | null {
  const instanceAliasConfig = aliases[payload.instance] ?? {}
  const possibleCustomAlias = R.find(([_path, id]) => {
    return id === payload.id
  }, R.toPairs(instanceAliasConfig))
  return possibleCustomAlias?.[0] ?? null
}

export function resolveCustomId({
  instance,
  path,
}: NonNullable<QueryUuidArgs['alias']>): number | null {
  const instanceAliasConfig = aliases[instance]
  const possibleId = instanceAliasConfig?.[path]
  return typeof possibleId === 'number' ? possibleId : null
}
