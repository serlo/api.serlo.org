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

import { handleEntitySet } from './entity-set-handler'
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
    async setApplet(_parent, { input }, context) {
      const { changes, content, title, url } = input

      return await handleEntitySet(
        {
          entityType: EntityType.Applet,
          input,
          mandatoryFields: {
            changes,
            content,
            title,
            url,
          },
        },
        context,
        { childDecoder: AppletDecoder }
      )
    },
    async setArticle(_parent, { input }, context) {
      const { changes, content, title } = input

      return await handleEntitySet(
        {
          entityType: EntityType.Article,
          input,
          mandatoryFields: {
            changes,
            content,
            title,
          },
        },
        context,
        { childDecoder: ArticleDecoder }
      )
    },
    async setCourse(_parent, { input }, context) {
      const { changes, title, content } = input

      // TODO: the logic of this and others transformedInput's should go to DB Layer
      const transformedInput = {
        ...input,
        description: content,
        content: undefined,
      }

      return await handleEntitySet(
        {
          entityType: EntityType.Course,
          input: transformedInput,
          mandatoryFields: { changes, title },
        },
        context,
        { childDecoder: CourseDecoder }
      )
    },
    async setCoursePage(_parent, { input }, context) {
      const { changes, content, title } = input

      return await handleEntitySet(
        {
          entityType: EntityType.CoursePage,
          input,
          mandatoryFields: { changes, content, title },
        },
        context,
        { childDecoder: CoursePageDecoder, parentDecoder: CourseDecoder }
      )
    },
    async setEvent(_parent, { input }, context) {
      const { changes, content, title } = input

      return await handleEntitySet(
        {
          entityType: EntityType.Event,
          input,
          mandatoryFields: { changes, content, title },
        },
        context,
        { childDecoder: EventDecoder }
      )
    },
    async setExercise(_parent, { input }, context) {
      const { changes, content } = input

      return await handleEntitySet(
        {
          entityType: EntityType.Exercise,
          input,
          mandatoryFields: { changes, content },
        },
        context,
        { childDecoder: ExerciseDecoder }
      )
    },
    async setExerciseGroup(_parent, { input }, context) {
      const { changes, content } = input

      // TODO: this logic should go to DBLayer
      const cohesive = input.cohesive === true ? 'true' : 'false'
      const transformedInput: Omit<typeof input, 'cohesive'> & {
        cohesive: 'true' | 'false'
      } = { ...input, cohesive }

      return await handleEntitySet(
        {
          entityType: EntityType.ExerciseGroup,

          input: transformedInput,
          mandatoryFields: { changes, content },
        },
        context,
        { childDecoder: ExerciseGroupDecoder }
      )
    },
    async setGroupedExercise(_parent, { input }, context) {
      const { changes, content } = input

      return await handleEntitySet(
        {
          entityType: EntityType.GroupedExercise,
          input,
          mandatoryFields: { changes, content },
        },
        context,
        {
          childDecoder: GroupedExerciseDecoder,
          parentDecoder: ExerciseGroupDecoder,
        }
      )
    },
    async setSolution(_parent, { input }, context) {
      const { changes, content } = input

      return await handleEntitySet(
        {
          entityType: EntityType.Solution,
          input,
          mandatoryFields: { changes, content },
        },
        context,
        {
          childDecoder: SolutionDecoder,
          parentDecoder: AbstractExerciseDecoder,
        }
      )
    },
    async setVideo(_parent, { input }, context) {
      const { changes, content, title, url } = input
      // TODO: logic should go to DBLayer
      const transformedInput = {
        ...input,
        content: input.url,
        description: input.content,
        url: undefined,
      }

      return await handleEntitySet(
        {
          entityType: EntityType.Video,
          input: transformedInput,
          mandatoryFields: { changes, content, title, url },
        },
        context,
        { childDecoder: VideoDecoder }
      )
    },
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
