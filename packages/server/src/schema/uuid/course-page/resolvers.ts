import { TypeResolvers } from '~/internals/graphql'
import {
  CourseDecoder,
  CoursePageDecoder,
  CoursePageRevisionDecoder,
} from '~/model/decoder'
import { createEntityResolvers } from '~/schema/uuid/abstract-entity/utils'
import { createRevisionResolvers } from '~/schema/uuid/abstract-repository/utils'
import { CoursePage, CoursePageRevision } from '~/types'

export const resolvers: TypeResolvers<CoursePage> &
  TypeResolvers<CoursePageRevision> = {
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
  CoursePageRevision: createRevisionResolvers({
    repositoryDecoder: CoursePageDecoder,
  }),
}
