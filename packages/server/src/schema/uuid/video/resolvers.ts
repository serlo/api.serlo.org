import { TypeResolvers } from '~/internals/graphql'
import { VideoDecoder, VideoRevisionDecoder } from '~/model/decoder'
import {
  createEntityResolvers,
  createEntityRevisionResolvers,
} from '~/schema/uuid/abstract-entity/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Video, VideoRevision } from '~/types'

export const resolvers: TypeResolvers<Video> & TypeResolvers<VideoRevision> = {
  Video: {
    ...createEntityResolvers({ revisionDecoder: VideoRevisionDecoder }),
    ...createTaxonomyTermChildResolvers(),
  },
  VideoRevision: createEntityRevisionResolvers({
    repositoryDecoder: VideoDecoder,
  }),
}
