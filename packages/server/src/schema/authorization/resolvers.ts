import { fetchAuthorizationPayload } from './utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  Query: {
    authorization(_parent, _payload, { userId, dataSources }) {
      return fetchAuthorizationPayload({ userId, dataSources })
    },
  },
}
