import { Instance } from '~/types'

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
