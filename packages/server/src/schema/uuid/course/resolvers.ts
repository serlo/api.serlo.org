import * as R from 'ramda'

import {
  CourseDecoder,
  CoursePageDecoder,
  CourseRevisionDecoder,
} from '~/model/decoder'
import {
  createEntityRevisionResolvers,
  createEntityResolvers,
} from '~/schema/uuid/abstract-entity/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
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
        }),
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
  CourseRevision: createEntityRevisionResolvers({
    repositoryDecoder: CourseDecoder,
  }),
}
