/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as serloAuth from '@serlo/authorization'

import { createSetEntityResolver } from './entity-set-handler'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  InterfaceResolvers,
  Mutations,
} from '~/internals/graphql'
import {
  castToUuid,
  EntityType,
  AppletDecoder,
  ArticleDecoder,
  CourseDecoder,
  CoursePageDecoder,
  EventDecoder,
  ExerciseDecoder,
  ExerciseGroupDecoder,
  GroupedExerciseDecoder,
  SolutionDecoder,
  VideoDecoder,
  AbstractExerciseDecoder,
} from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'

export const resolvers: InterfaceResolvers<'AbstractEntity'> &
  InterfaceResolvers<'AbstractEntityRevision'> &
  Mutations<'entity'> = {
  Mutation: {
    entity: createNamespace(),
  },
  AbstractEntity: {
    __resolveType(entity) {
      return entity.__typename
    },
  },
  AbstractEntityRevision: {
    __resolveType(entityRevision) {
      return entityRevision.__typename
    },
  },
  EntityMutation: {
    setApplet: createSetEntityResolver({
      childDecoder: AppletDecoder,
      entityType: EntityType.Applet,
      mandatoryFieldKeys: ['changes', 'content', 'title', 'url'],
    }),
    setArticle: createSetEntityResolver({
      childDecoder: ArticleDecoder,
      entityType: EntityType.Article,
      mandatoryFieldKeys: ['changes', 'content', 'title'],
    }),
    setCourse: createSetEntityResolver({
      childDecoder: CourseDecoder,
      entityType: EntityType.Course,
      mandatoryFieldKeys: ['changes', 'title'],
      transformedInput: (input) => {
        return {
          ...input,
          description: input.content,
          content: undefined,
        }
      },
    }),
    setCoursePage: createSetEntityResolver({
      childDecoder: CoursePageDecoder,
      parentDecoder: CourseDecoder,
      entityType: EntityType.CoursePage,
      mandatoryFieldKeys: ['changes', 'content', 'title'],
    }),
    setEvent: createSetEntityResolver({
      childDecoder: EventDecoder,
      entityType: EntityType.Event,
      mandatoryFieldKeys: ['changes', 'content', 'title'],
    }),
    setExercise: createSetEntityResolver({
      childDecoder: ExerciseDecoder,
      entityType: EntityType.Exercise,
      mandatoryFieldKeys: ['changes', 'content'],
    }),
    setExerciseGroup: createSetEntityResolver({
      childDecoder: ExerciseGroupDecoder,
      entityType: EntityType.ExerciseGroup,
      mandatoryFieldKeys: ['changes', 'content'],
    }),
    setGroupedExercise: createSetEntityResolver({
      childDecoder: GroupedExerciseDecoder,
      parentDecoder: ExerciseGroupDecoder,
      entityType: EntityType.GroupedExercise,
      mandatoryFieldKeys: ['changes', 'content'],
    }),
    setSolution: createSetEntityResolver({
      childDecoder: SolutionDecoder,
      parentDecoder: AbstractExerciseDecoder,
      entityType: EntityType.Solution,
      mandatoryFieldKeys: ['changes', 'content'],
    }),
    setVideo: createSetEntityResolver({
      childDecoder: VideoDecoder,
      entityType: EntityType.Video,
      mandatoryFieldKeys: ['changes', 'title', 'url', 'title'],
      transformedInput: (input) => {
        return {
          ...input,
          description: input.content,
          content: input.url,
          url: undefined,
        }
      },
    }),

    async checkoutRevision(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const scope = await fetchScopeOfUuid({
        id: input.revisionId,
        dataSources,
      })
      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to check out the provided revision.',
        guard: serloAuth.Entity.checkoutRevision(scope),
      })

      await dataSources.model.serlo.checkoutEntityRevision({
        revisionId: castToUuid(input.revisionId),
        reason: input.reason,
        userId,
      })

      return { success: true, query: {} }
    },
    async rejectRevision(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const scope = await fetchScopeOfUuid({
        id: input.revisionId,
        dataSources,
      })
      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to reject the provided revision.',
        guard: serloAuth.Entity.rejectRevision(scope),
      })

      await dataSources.model.serlo.rejectEntityRevision({ ...input, userId })

      return { success: true, query: {} }
    },
  },
}
