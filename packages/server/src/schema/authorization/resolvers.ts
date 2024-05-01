import { fetchAuthorizationPayload } from './utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  Query: {
    authorization(_parent, _payload, context) {
      return fetchAuthorizationPayload(context)
    },
  },
}
