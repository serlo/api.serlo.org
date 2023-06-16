import { TypeResolvers } from '~/internals/graphql'
import { VideoDecoder, VideoRevisionDecoder } from '~/model/decoder'
import { createEntityResolvers } from '~/schema/uuid/abstract-entity/utils'
import { createRevisionResolvers } from '~/schema/uuid/abstract-repository/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Video, VideoRevision } from '~/types'

export const resolvers: TypeResolvers<Video> & TypeResolvers<VideoRevision> = {
  Video: {
    ...createEntityResolvers({ revisionDecoder: VideoRevisionDecoder }),
    ...createTaxonomyTermChildResolvers(),
  },
  VideoRevision: createRevisionResolvers({ repositoryDecoder: VideoDecoder }),
}
