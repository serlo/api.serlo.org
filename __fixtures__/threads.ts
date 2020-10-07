import { user } from '.'
import { ThreadsPayload } from '../src/graphql/schema'

export const threads: ThreadsPayload = {
  threadIds: [1],
  objectId: user.id,
}
