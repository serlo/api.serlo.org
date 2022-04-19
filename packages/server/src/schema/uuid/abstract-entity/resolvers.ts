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

import { assertIsTaxonomyTerm } from '../taxonomy-term/utils'
import {
  createEntity,
  addRevision,
  assertParentExists,
  verifyAutoreviewEntity,
  getEntity,
} from './utils'
import {
  assertArgumentIsNotEmpty,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  InterfaceResolvers,
  Mutations,
} from '~/internals/graphql'
import {
  castToUuid,
  EntityRevisionType,
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
    async createApplet(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, url, taxonomyTermId } = input

      assertArgumentIsNotEmpty({
        changes,
        content,
        title,
        url,
      })

      await assertIsTaxonomyTerm(taxonomyTermId, dataSources)

      return await createEntity({
        entityType: EntityType.Applet,
        input,
        dataSources,
        userId,
      })
    },
    async createArticle(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, taxonomyTermId } = input

      assertArgumentIsNotEmpty({
        changes,
        content,
        title,
      })

      await assertIsTaxonomyTerm(taxonomyTermId, dataSources)

      return await createEntity({
        entityType: EntityType.Article,
        input,
        dataSources,
        userId,
      })
    },
    async createCourse(_parent, { input }, { dataSources, userId }) {
      const { changes, title, content, taxonomyTermId } = input

      assertArgumentIsNotEmpty({ changes, title })

      await assertIsTaxonomyTerm(taxonomyTermId, dataSources)

      // TODO: the logic of this and others transformedInput's should go to DB Layer
      const transformedInput = {
        ...input,
        description: content,
        content: undefined,
      }

      return await createEntity({
        entityType: EntityType.Course,
        input: transformedInput,
        dataSources,
        userId,
      })
    },
    async createCoursePage(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, parentId } = input

      assertArgumentIsNotEmpty({ changes, content, title })

      await assertParentExists(parentId, dataSources)

      return await createEntity({
        entityType: EntityType.CoursePage,
        input,
        dataSources,
        userId,
      })
    },
    async createEvent(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, taxonomyTermId } = input

      assertArgumentIsNotEmpty({
        changes,
        content,
        title,
      })

      await assertIsTaxonomyTerm(taxonomyTermId, dataSources)

      return await createEntity({
        entityType: EntityType.Event,
        input,
        dataSources,
        userId,
      })
    },
    async createExercise(_parent, { input }, { dataSources, userId }) {
      const { changes, content, taxonomyTermId } = input

      assertArgumentIsNotEmpty({ changes, content })

      await assertIsTaxonomyTerm(taxonomyTermId, dataSources)

      return await createEntity({
        entityType: EntityType.Exercise,
        input,
        dataSources,
        userId,
      })
    },
    async createExerciseGroup(_parent, { input }, { dataSources, userId }) {
      const { changes, content, taxonomyTermId } = input

      assertArgumentIsNotEmpty({ changes, content })

      await assertIsTaxonomyTerm(taxonomyTermId, dataSources)

      // TODO: this logic should go to DBLayer
      const cohesive = input.cohesive === true ? 'true' : 'false'
      const transformedInput: Omit<typeof input, 'cohesive'> & {
        cohesive: 'true' | 'false'
      } = { ...input, cohesive }

      return await createEntity({
        entityType: EntityType.ExerciseGroup,
        input: transformedInput,
        dataSources,
        userId,
      })
    },
    async createGroupedExercise(_parent, { input }, { dataSources, userId }) {
      const { changes, content, parentId } = input

      assertArgumentIsNotEmpty({ changes, content })

      await assertParentExists(parentId, dataSources)

      return await createEntity({
        entityType: EntityType.GroupedExercise,
        input,
        dataSources,
        userId,
      })
    },
    async createSolution(_parent, { input }, { dataSources, userId }) {
      const { changes, content, parentId } = input

      assertArgumentIsNotEmpty({ changes, content })

      await assertParentExists(parentId, dataSources)

      return await createEntity({
        entityType: EntityType.Solution,
        input,
        dataSources,
        userId,
      })
    },
    async createVideo(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, url, taxonomyTermId } = input

      assertArgumentIsNotEmpty({ changes, content, title, url })

      await assertIsTaxonomyTerm(taxonomyTermId, dataSources)

      // TODO: logic should go to DBLayer
      const transformedInput = {
        ...input,
        content: input.url,
        description: input.content,
        url: undefined,
      }

      return await createEntity({
        entityType: EntityType.Video,
        input: transformedInput,
        dataSources,
        userId,
      })
    },
    async addAppletRevision(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, url, entityId } = input

      assertArgumentIsNotEmpty({
        changes,
        content,
        title,
        url,
      })

      const entity = await getEntity(entityId, dataSources, AppletDecoder)

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        entity,
        dataSources
      )

      return await addRevision({
        revisionType: EntityRevisionType.AppletRevision,
        input,
        dataSources,
        userId,
        isAutoreviewEntity,
      })
    },
    async addArticleRevision(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, entityId } = input

      assertArgumentIsNotEmpty({
        changes,
        content,
        title,
      })

      const entity = await getEntity(entityId, dataSources, ArticleDecoder)

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        entity,
        dataSources
      )

      return await addRevision({
        revisionType: EntityRevisionType.ArticleRevision,
        input,
        dataSources,
        userId,
        isAutoreviewEntity,
      })
    },
    async addCourseRevision(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, entityId } = input

      assertArgumentIsNotEmpty({ changes, title })

      const entity = await getEntity(entityId, dataSources, CourseDecoder)

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        entity,
        dataSources
      )

      // TODO: the logic of this and others transformedInput's should go to DB Layer
      const transformedInput = {
        ...input,
        description: content,
        content: undefined,
      }

      return await addRevision({
        revisionType: EntityRevisionType.CourseRevision,
        input: transformedInput,
        dataSources,
        userId,
        isAutoreviewEntity,
      })
    },
    async addCoursePageRevision(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, entityId } = input

      assertArgumentIsNotEmpty({ changes, content, title })

      const entity = await getEntity(entityId, dataSources, CoursePageDecoder)

      const parent = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: entity.parentId,
        decoder: CourseDecoder,
      })

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        parent,
        dataSources
      )

      return await addRevision({
        revisionType: EntityRevisionType.CoursePageRevision,
        input,
        dataSources,
        userId,
        isAutoreviewEntity,
      })
    },
    async addEventRevision(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, entityId } = input

      assertArgumentIsNotEmpty({
        changes,
        content,
        title,
      })

      const entity = await getEntity(entityId, dataSources, EventDecoder)

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        entity,
        dataSources
      )
      return await addRevision({
        revisionType: EntityRevisionType.EventRevision,
        input,
        dataSources,
        userId,
        isAutoreviewEntity,
      })
    },
    async addExerciseRevision(_parent, { input }, { dataSources, userId }) {
      const { changes, content, entityId } = input

      assertArgumentIsNotEmpty({ changes, content })

      const entity = await getEntity(entityId, dataSources, ExerciseDecoder)

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        entity,
        dataSources
      )

      return await addRevision({
        revisionType: EntityRevisionType.ExerciseRevision,
        input,
        dataSources,
        userId,
        isAutoreviewEntity,
      })
    },
    async addExerciseGroupRevision(
      _parent,
      { input },
      { dataSources, userId }
    ) {
      const { entityId, changes, content } = input

      assertArgumentIsNotEmpty({ changes, content })

      const entity = await getEntity(
        entityId,
        dataSources,
        ExerciseGroupDecoder
      )

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        entity,
        dataSources
      )

      const cohesive = input.cohesive === true ? 'true' : 'false'
      const transformedInput: Omit<typeof input, 'cohesive'> & {
        cohesive: 'true' | 'false'
      } = { ...input, cohesive }

      return await addRevision({
        revisionType: EntityRevisionType.ExerciseGroupRevision,
        input: transformedInput,
        dataSources,
        userId,
        isAutoreviewEntity,
      })
    },
    async addGroupedExerciseRevision(
      _parent,
      { input },
      { dataSources, userId }
    ) {
      const { entityId, changes, content } = input

      assertArgumentIsNotEmpty({ changes, content })

      const entity = await getEntity(
        entityId,
        dataSources,
        GroupedExerciseDecoder
      )

      const parent = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: entity.parentId,
        decoder: ExerciseGroupDecoder,
      })

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        parent,
        dataSources
      )

      return await addRevision({
        revisionType: EntityRevisionType.GroupedExerciseRevision,
        input,
        dataSources,
        userId,
        isAutoreviewEntity,
      })
    },
    async addSolutionRevision(_parent, { input }, { dataSources, userId }) {
      const { entityId, changes, content } = input

      assertArgumentIsNotEmpty({ changes, content })

      const entity = await getEntity(entityId, dataSources, SolutionDecoder)

      const parent = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: entity.parentId,
        decoder: ExerciseDecoder,
      })

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        parent,
        dataSources
      )

      return await addRevision({
        revisionType: EntityRevisionType.SolutionRevision,
        input,
        dataSources,
        userId,
        isAutoreviewEntity,
      })
    },
    async addVideoRevision(_parent, { input }, { dataSources, userId }) {
      const { entityId, changes, content, title, url } = input

      assertArgumentIsNotEmpty({ changes, content, title, url })

      const entity = await getEntity(entityId, dataSources, VideoDecoder)

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        entity,
        dataSources
      )

      const transformedInput = {
        ...input,
        content: input.url,
        description: input.content,
        url: undefined,
      }

      return await addRevision({
        revisionType: EntityRevisionType.VideoRevision,
        input: transformedInput,
        dataSources,
        userId,
        isAutoreviewEntity,
      })
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
