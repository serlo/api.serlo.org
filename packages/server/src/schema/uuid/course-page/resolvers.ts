import { UuidResolver } from '../abstract-uuid/resolvers'
import {
  CourseDecoder,
  CoursePageDecoder,
  CoursePageRevisionDecoder,
} from '~/model/decoder'
import {
  createRevisionResolvers,
  createRepositoryResolvers,
} from '~/schema/uuid/abstract-repository/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CoursePage: {
    ...createRepositoryResolvers({
      revisionDecoder: CoursePageRevisionDecoder,
    }),
    async course(coursePage, _args, context) {
      const id = coursePage.parentId
      return UuidResolver.resolveWithDecoder(CourseDecoder, { id }, context)
    },
  },
  CoursePageRevision: createRevisionResolvers({
    repositoryDecoder: CoursePageDecoder,
  }),
}
