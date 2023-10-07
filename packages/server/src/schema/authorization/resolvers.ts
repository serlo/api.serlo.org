import { fetchAuthorizationPayload } from './utils'
import { LegacyQueries } from '~/internals/graphql'

export const resolvers: LegacyQueries<'authorization'> = {
  Query: {
    authorization(_parent, _payload, { userId, dataSources }) {
      return fetchAuthorizationPayload({ userId, dataSources })
    },
  },
}
