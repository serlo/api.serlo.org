import { VideoDecoder, VideoRevisionDecoder } from '~/model/decoder'
import {
  createRevisionResolvers,
  createRepositoryResolvers,
} from '~/schema/uuid/abstract-repository/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  Video: {
    ...createRepositoryResolvers({ revisionDecoder: VideoRevisionDecoder }),
    ...createTaxonomyTermChildResolvers(),
  },
  VideoRevision: createRevisionResolvers({ repositoryDecoder: VideoDecoder }),
}
