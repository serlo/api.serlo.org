/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import R from 'ramda'

import { CoursePayload, CourseRevisionPayload } from './types'
import { Context } from '~/internals/graphql'
import {
  createRepositoryResolvers,
  createRevisionResolvers,
} from '~/schema/uuid/abstract-repository/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { CoursePagePayload } from '~/schema/uuid/course-page/types'
import { CoursePagesArgs } from '~/types'
import { isDefined } from '~/utils'

export const resolvers = {
  Course: {
    ...createRepositoryResolvers<CoursePayload, CourseRevisionPayload>(),
    ...createTaxonomyTermChildResolvers<CoursePayload>(),
    async pages(
      course: CoursePayload,
      { trashed, hasCurrentRevision }: CoursePagesArgs,
      { dataSources }: Context
    ) {
      const pages = await Promise.all(
        course.pageIds.map((id: number) => {
          return dataSources.model.serlo.getUuid({
            id,
          }) as Promise<CoursePagePayload | null>
        })
      )

      return pages.filter(isDefined).filter((page) => {
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
  CourseRevision: createRevisionResolvers<
    CoursePayload,
    CourseRevisionPayload
  >(),
}
