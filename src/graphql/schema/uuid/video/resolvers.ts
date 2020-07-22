import {
  createEntityResolvers,
  createEntityRevisionResolvers,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { createTaxonomyTermChildResolvers } from '../abstract-taxonomy-term-child'
import { VideoPreResolver, VideoRevisionPreResolver } from './types'

export const resolvers = {
  Video: {
    ...createEntityResolvers<VideoPreResolver, VideoRevisionPreResolver>({
      entityRevisionType: EntityRevisionType.VideoRevision,
    }),
    ...createTaxonomyTermChildResolvers<VideoPreResolver>(),
  },
  VideoRevision: createEntityRevisionResolvers<
    VideoPreResolver,
    VideoRevisionPreResolver
  >({
    entityType: EntityType.Video,
    repository: 'video',
  }),
}
