import { TypeResolvers } from '~/internals/graphql'
import { EventDecoder, EventRevisionDecoder } from '~/model/decoder'
import {
  createEntityResolvers,
  createEntityRevisionResolvers,
} from '~/schema/uuid/abstract-entity/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { EventRevision, Event } from '~/types'

export const resolvers: TypeResolvers<Event> & TypeResolvers<EventRevision> = {
  Event: {
    ...createEntityResolvers({ revisionDecoder: EventRevisionDecoder }),
    ...createTaxonomyTermChildResolvers(),
  },
  EventRevision: createEntityRevisionResolvers({
    repositoryDecoder: EventDecoder,
  }),
}
