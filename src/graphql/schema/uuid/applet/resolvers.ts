import {
  createEntityResolvers,
  createEntityRevisionResolvers,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { createTaxonomyTermChildResolvers } from '../abstract-taxonomy-term-child'
import { AppletPreResolver, AppletRevisionPreResolver } from './types'

export const resolvers = {
  Applet: {
    ...createEntityResolvers<AppletPreResolver, AppletRevisionPreResolver>({
      entityRevisionType: EntityRevisionType.AppletRevision,
    }),
    ...createTaxonomyTermChildResolvers<AppletPreResolver>(),
  },
  AppletRevision: createEntityRevisionResolvers<
    AppletPreResolver,
    AppletRevisionPreResolver
  >({
    entityType: EntityType.Applet,
    repository: 'applet',
  }),
}
