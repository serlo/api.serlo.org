import { TypeResolvers } from '~/internals/graphql'
import { AppletDecoder, AppletRevisionDecoder } from '~/model/decoder'
import { createEntityResolvers } from '~/schema/uuid/abstract-entity/utils'
import { createRevisionResolvers } from '~/schema/uuid/abstract-repository/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Applet, AppletRevision } from '~/types'

export const resolvers: TypeResolvers<Applet> & TypeResolvers<AppletRevision> =
  {
    Applet: {
      ...createEntityResolvers({ revisionDecoder: AppletRevisionDecoder }),
      ...createTaxonomyTermChildResolvers(),
    },
    AppletRevision: createRevisionResolvers({
      repositoryDecoder: AppletDecoder,
    }),
  }
