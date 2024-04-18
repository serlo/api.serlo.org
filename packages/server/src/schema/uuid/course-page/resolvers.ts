import {
  CourseDecoder,
  CoursePageDecoder,
  CoursePageRevisionDecoder,
} from '~/model/decoder'
import {
  createEntityRevisionResolvers,
  createEntityResolvers,
} from '~/schema/uuid/abstract-entity/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CoursePage: {
    ...createEntityResolvers({
      revisionDecoder: CoursePageRevisionDecoder,
    }),
    async course(coursePage, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: coursePage.parentId,
        decoder: CourseDecoder,
      })
    },
  },
  CoursePageRevision: createEntityRevisionResolvers({
    repositoryDecoder: CoursePageDecoder,
  }),
}
