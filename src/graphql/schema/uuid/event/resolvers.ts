import {
  createEntityResolvers,
  createEntityRevisionResolvers,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { createTaxonomyTermChildResolvers } from '../abstract-taxonomy-term-child'
import { EventPreResolver, EventRevisionPreResolver } from './types'

export const resolvers = {
  Event: {
    ...createEntityResolvers<EventPreResolver, EventRevisionPreResolver>({
      entityRevisionType: EntityRevisionType.EventRevision,
    }),
    ...createTaxonomyTermChildResolvers<EventPreResolver>(),
  },
  EventRevision: createEntityRevisionResolvers<
    EventPreResolver,
    EventRevisionPreResolver
  >({
    entityType: EntityType.Event,
    repository: 'event',
  }),
}
