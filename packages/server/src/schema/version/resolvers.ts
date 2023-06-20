import { version } from '../../../package.json'
import { LegacyQueries } from '~/internals/graphql'

export const resolvers: LegacyQueries<'version'> = {
  Query: {
    version: () => version,
  },
}
