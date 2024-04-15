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
    async course(coursePage, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: coursePage.parentId,
        decoder: CourseDecoder,
      })
    },
  },
  CoursePageRevision: createRevisionResolvers({
    repositoryDecoder: CoursePageDecoder,
  }),
}
