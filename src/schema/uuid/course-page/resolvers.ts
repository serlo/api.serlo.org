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
import { GraphQLResolveInfo } from 'graphql'

import { CoursePagePayload, CoursePageRevisionPayload } from './types'
import { Context, requestsOnlyFields } from '~/internals/graphql'
import {
  createRepositoryResolvers,
  createRevisionResolvers,
} from '~/schema/uuid/abstract-repository/utils'
import {
  CoursePageDecoder,
  CoursePageRevisionDecoder,
} from '~/schema/uuid/course-page/decoder'
import { CourseDecoder } from '~/schema/uuid/course/decoder'

export const resolvers = {
  CoursePage: {
    ...createRepositoryResolvers<CoursePagePayload, CoursePageRevisionPayload>({
      revisionDecoder: CoursePageRevisionDecoder,
    }),
    async course(
      coursePage: CoursePagePayload,
      _args: never,
      { dataSources }: Context,
      info: GraphQLResolveInfo
    ) {
      const partialCourse = { id: coursePage.parentId }
      if (requestsOnlyFields('Course', ['id'], info)) {
        return partialCourse
      }
      return dataSources.model.serlo.getUuidWithCustomDecoder({
        ...partialCourse,
        decoder: CourseDecoder,
      })
    },
  },
  CoursePageRevision: createRevisionResolvers<
    CoursePagePayload,
    CoursePageRevisionPayload
  >({
    repositoryDecoder: CoursePageDecoder,
  }),
}
