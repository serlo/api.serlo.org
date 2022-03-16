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

import { ModelDataSource } from '~/internals/data-source'
import {
  assertStringIsNotEmpty,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  InterfaceResolvers,
  Mutations,
} from '~/internals/graphql'
import {
  castToUuid,
  EntityRevisionType,
  EntityDecoder,
  EntityType,
} from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { Instance } from '~/types'

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
      const { changes, content, title, url, metaDescription, metaTitle } = input

      assertStringIsNotEmpty(
        changes,
        content,
        title,
        url,
        metaDescription,
        metaTitle
      )

      return await createEntity({
        entityType: EntityType.Applet,
        input,
        dataSources,
        userId,
      })
    },
    async createArticle(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, metaDescription, metaTitle } = input

      assertStringIsNotEmpty(
        changes,
        content,
        title,
        metaDescription,
        metaTitle
      )

      return await createEntity({
        entityType: EntityType.Article,
        input,
        dataSources,
        userId,
      })
    },
    async createCourse(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, metaDescription } = input

      assertStringIsNotEmpty(changes, content, title, metaDescription)

      // TODO: the logic of this and others transformedInput's should go to DB Layer
      const transformedInput = {
        ...input,
        description: input.content,
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
      const { changes, content, title } = input

      assertStringIsNotEmpty(changes, content, title)

      // Verify parentId exists

      return await createEntity({
        entityType: EntityType.CoursePage,
        input,
        dataSources,
        userId,
      })
    },
    async createEvent(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, metaDescription, metaTitle } = input

      assertStringIsNotEmpty(
        changes,
        content,
        title,
        metaDescription,
        metaTitle
      )

      return await createEntity({
        entityType: EntityType.Event,
        input,
        dataSources,
        userId,
      })
    },
    async createExercise(_parent, { input }, { dataSources, userId }) {
      const { changes, content } = input

      assertStringIsNotEmpty(changes, content)

      return await createEntity({
        entityType: EntityType.Exercise,
        input,
        dataSources,
        userId,
      })
    },
    async createExerciseGroup(_parent, { input }, { dataSources, userId }) {
      const { changes, content } = input

      assertStringIsNotEmpty(changes, content)

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
      const { changes, content } = input

      assertStringIsNotEmpty(changes, content)

      //verify parentId exists

      return await createEntity({
        entityType: EntityType.GroupedExercise,
        input,
        dataSources,
        userId,
      })
    },
    async createSolution(_parent, { input }, { dataSources, userId }) {
      const { changes, content } = input

      assertStringIsNotEmpty(changes, content)

      //verify parentId exists

      return await createEntity({
        entityType: EntityType.Solution,
        input,
        dataSources,
        userId,
      })
    },
    async createVideo(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, url } = input

      assertStringIsNotEmpty(changes, content, title, url)

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
      const { changes, content, title, url, metaDescription, metaTitle } = input

      assertStringIsNotEmpty(
        changes,
        content,
        title,
        url,
        metaDescription,
        metaTitle
      )

      return await addRevision({
        revisionType: EntityRevisionType.AppletRevision,
        input,
        dataSources,
        userId,
      })
    },
    async addArticleRevision(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, metaDescription, metaTitle } = input

      assertStringIsNotEmpty(
        changes,
        content,
        title,
        metaDescription,
        metaTitle
      )

      return await addRevision({
        revisionType: EntityRevisionType.ArticleRevision,
        input,
        dataSources,
        userId,
      })
    },
    async addCourseRevision(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, metaDescription } = input

      assertStringIsNotEmpty(changes, content, title, metaDescription)

      // TODO: the logic of this and others transformedInput's should go to DB Layer
      const transformedInput = {
        ...input,
        description: input.content,
        content: undefined,
      }

      return await addRevision({
        revisionType: EntityRevisionType.CourseRevision,
        input: transformedInput,
        dataSources,
        userId,
      })
    },
    async addCoursePageRevision(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title } = input

      assertStringIsNotEmpty(changes, content, title)

      return await addRevision({
        revisionType: EntityRevisionType.CoursePageRevision,
        input,
        dataSources,
        userId,
      })
    },
    async addEventRevision(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, metaDescription, metaTitle } = input

      assertStringIsNotEmpty(
        changes,
        content,
        title,
        metaDescription,
        metaTitle
      )

      return await addRevision({
        revisionType: EntityRevisionType.EventRevision,
        input,
        dataSources,
        userId,
      })
    },
    async addExerciseRevision(_parent, { input }, { dataSources, userId }) {
      const { changes, content } = input

      assertStringIsNotEmpty(changes, content)

      return await addRevision({
        revisionType: EntityRevisionType.ExerciseRevision,
        input,
        dataSources,
        userId,
      })
    },
    async addExerciseGroupRevision(
      _parent,
      { input },
      { dataSources, userId }
    ) {
      const { changes, content } = input

      assertStringIsNotEmpty(changes, content)

      const cohesive = input.cohesive === true ? 'true' : 'false'
      const transformedInput: Omit<typeof input, 'cohesive'> & {
        cohesive: 'true' | 'false'
      } = { ...input, cohesive }

      return await addRevision({
        revisionType: EntityRevisionType.ExerciseGroupRevision,
        input: transformedInput,
        dataSources,
        userId,
      })
    },
    async addGroupedExerciseRevision(
      _parent,
      { input },
      { dataSources, userId }
    ) {
      const { changes, content } = input

      assertStringIsNotEmpty(changes, content)

      return await addRevision({
        revisionType: EntityRevisionType.GroupedExerciseRevision,
        input,
        dataSources,
        userId,
      })
    },
    async addSolutionRevision(_parent, { input }, { dataSources, userId }) {
      const { changes, content } = input

      assertStringIsNotEmpty(changes, content)

      return await addRevision({
        revisionType: EntityRevisionType.SolutionRevision,
        input,
        dataSources,
        userId,
      })
    },
    async addVideoRevision(_parent, { input }, { dataSources, userId }) {
      const { changes, content, title, url } = input

      assertStringIsNotEmpty(changes, content, title, url)

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

export interface AbstractEntityCreatePayload {
  entityType: EntityType
  input: {
    changes: string
    subscribeThis: boolean
    subscribeThisByEmail: boolean
    instance: Instance
    licenseId: number
    needsReview: boolean
    parentId?: number
    cohesive?: 'true' | 'false'
    content?: string
    description?: string
    metaDescription?: string
    metaTitle?: string
    title?: string
    url?: string
  }
  dataSources: { model: ModelDataSource }
  userId: number | null
}

interface AbstractEntityAddRevisionPayload {
  revisionType: EntityRevisionType
  input: {
    changes: string
    entityId: number
    needsReview: boolean
    subscribeThis: boolean
    subscribeThisByEmail: boolean
    cohesive?: 'true' | 'false'
    content?: string
    description?: string
    metaDescription?: string
    metaTitle?: string
    title?: string
    url?: string
  }
  dataSources: { model: ModelDataSource }
  userId: number | null
}

async function createEntity({
  entityType,
  dataSources,
  input,
  userId,
}: AbstractEntityCreatePayload) {
  assertUserIsAuthenticated(userId)

  const {
    instance,
    licenseId,
    parentId,
    changes,
    needsReview,
    subscribeThis,
    subscribeThisByEmail,
    ...inputFields
  } = input

  await assertUserIsAuthorized({
    userId,
    dataSources,
    message: 'You are not allowed to add revision to this entity.',
    guard: serloAuth.Uuid.create('Entity')(serloAuth.instanceToScope(instance)),
  })

  const fields = removeUndefinedFields(
    inputFields as { [key: string]: string | undefined }
  )

  const inputPayload = {
    changes,
    instance,
    licenseId,
    needsReview,
    parentId,
    subscribeThis,
    subscribeThisByEmail,
    fields,
  }
  const entity = await dataSources.model.serlo.createEntity({
    entityType,
    userId,
    input: inputPayload,
  })

  return {
    record: entity,
    success: entity != null,
    query: {},
  }
}

async function addRevision({
  revisionType,
  input,
  dataSources,
  userId,
}: AbstractEntityAddRevisionPayload) {
  assertUserIsAuthenticated(userId)

  const {
    entityId,
    changes,
    needsReview,
    subscribeThis,
    subscribeThisByEmail,
    ...inputFields
  } = input

  const scope = await fetchScopeOfUuid({
    id: entityId,
    dataSources,
  })
  await assertUserIsAuthorized({
    userId,
    dataSources,
    message: 'You are not allowed to add revision to this entity.',
    guard: serloAuth.Uuid.create('EntityRevision')(scope),
  })

  const fields = removeUndefinedFields(
    inputFields as { [key: string]: string | undefined }
  )

  const inputPayload = {
    changes,
    entityId,
    needsReview,
    subscribeThis,
    subscribeThisByEmail,
    fields,
  }
  const { success, revisionId } =
    await dataSources.model.serlo.addEntityRevision({
      revisionType,
      userId,
      input: inputPayload,
    })

  return {
    revisionId,
    success,
    query: {},
  }
}

function removeUndefinedFields(inputFields: {
  [key: string]: string | undefined
}) {
  const fields: {
    [key: string]: string
  } = {}

  for (const [key, value] of Object.entries(inputFields)) {
    if (value) {
      fields[key] = value
    }
  }

  return fields
}
