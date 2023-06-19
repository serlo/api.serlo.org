import { TypeResolvers } from '~/internals/graphql'
import { EventDecoder, EventRevisionDecoder } from '~/model/decoder'
import { createEntityResolvers } from '~/schema/uuid/abstract-entity/utils'
import { createRevisionResolvers } from '~/schema/uuid/abstract-repository/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { EventRevision, Event } from '~/types'

export const resolvers: TypeResolvers<Event> & TypeResolvers<EventRevision> = {
  Event: {
    ...createEntityResolvers({ revisionDecoder: EventRevisionDecoder }),
    ...createTaxonomyTermChildResolvers(),
  },
  EventRevision: createRevisionResolvers({ repositoryDecoder: EventDecoder }),
}
