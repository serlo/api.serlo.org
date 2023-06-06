import R from 'ramda'

import { TypeResolvers } from '~/internals/graphql'
import {
  CourseDecoder,
  CoursePageDecoder,
  CourseRevisionDecoder,
} from '~/model/decoder'
import { createEntityResolvers } from '~/schema/uuid/abstract-entity/utils'
import { createRevisionResolvers } from '~/schema/uuid/abstract-repository/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Course, CourseRevision } from '~/types'

export const resolvers: TypeResolvers<Course> & TypeResolvers<CourseRevision> =
  {
    Course: {
      ...createEntityResolvers({ revisionDecoder: CourseRevisionDecoder }),
      ...createTaxonomyTermChildResolvers(),
      async pages(course, { trashed, hasCurrentRevision }, { dataSources }) {
        const pages = await Promise.all(
          course.pageIds.map((id: number) => {
            return dataSources.model.serlo.getUuidWithCustomDecoder({
              id,
              decoder: CoursePageDecoder,
            })
          })
        )

        return pages.filter((page) => {
          if (trashed !== undefined && page.trashed !== trashed) return false
          if (
            hasCurrentRevision !== undefined &&
            R.isNil(page.currentRevisionId) === hasCurrentRevision
          )
            return false

          return true
        })
      },
    },
    CourseRevision: createRevisionResolvers({
      repositoryDecoder: CourseDecoder,
    }),
  }
