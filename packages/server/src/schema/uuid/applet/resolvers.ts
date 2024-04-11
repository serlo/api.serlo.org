import { TypeResolvers } from '~/internals/graphql'
import { AppletDecoder, AppletRevisionDecoder } from '~/model/decoder'
import {
  createEntityResolvers,
  createEntityRevisionResolvers,
} from '~/schema/uuid/abstract-entity/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Applet, AppletRevision } from '~/types'

export const resolvers: TypeResolvers<Applet> & TypeResolvers<AppletRevision> =
  {
    Applet: {
      ...createEntityResolvers({ revisionDecoder: AppletRevisionDecoder }),
      ...createTaxonomyTermChildResolvers(),
    },
    AppletRevision: createEntityRevisionResolvers({
      repositoryDecoder: AppletDecoder,
    }),
  }
