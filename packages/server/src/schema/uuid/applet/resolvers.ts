import { AppletDecoder, AppletRevisionDecoder } from '~/model/decoder'
import {
  createRevisionResolvers,
  createRepositoryResolvers,
} from '~/schema/uuid/abstract-repository/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  Applet: {
    ...createRepositoryResolvers({ revisionDecoder: AppletRevisionDecoder }),
    ...createTaxonomyTermChildResolvers(),
  },
  AppletRevision: createRevisionResolvers({ repositoryDecoder: AppletDecoder }),
}
