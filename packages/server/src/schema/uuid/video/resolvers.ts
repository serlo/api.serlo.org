import { VideoDecoder, VideoRevisionDecoder } from '~/model/decoder'
import {
  createEntityRevisionResolvers,
  createEntityResolvers,
} from '~/schema/uuid/abstract-entity/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  Video: {
    ...createEntityResolvers({ revisionDecoder: VideoRevisionDecoder }),
    ...createTaxonomyTermChildResolvers(),
  },
  VideoRevision: createEntityRevisionResolvers({
    repositoryDecoder: VideoDecoder,
  }),
}
