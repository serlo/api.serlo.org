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
import { UserInputError } from 'apollo-server'
import * as t from 'io-ts'

import { ModelDataSource } from '~/internals/data-source'
import {
  assertStringIsNotEmpty,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  InterfaceResolvers,
  Model,
  Mutations,
} from '~/internals/graphql'
import {
  castTo,
  castToUuid,
  EntityRevisionType,
  EntityDecoder,
  TaxonomyTermDecoder,
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
      const { changes, content, title, parentId } = input

      assertStringIsNotEmpty(changes, content, title)

      await verifyParentExists(parentId, dataSources)

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
      const { changes, content, parentId } = input

      assertStringIsNotEmpty(changes, content)

      await verifyParentExists(parentId, dataSources)

      return await createEntity({
        entityType: EntityType.GroupedExercise,
        input,
        dataSources,
        userId,
      })
    },
    async createSolution(_parent, { input }, { dataSources, userId }) {
      const { changes, content, parentId } = input

      assertStringIsNotEmpty(changes, content)

      await verifyParentExists(parentId, dataSources)

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
      const {
        entityId,
        changes,
        content,
        title,
        url,
        metaDescription,
        metaTitle,
      } = input

      assertStringIsNotEmpty(
        changes,
        content,
        title,
        url,
        metaDescription,
        metaTitle
      )

      const entity = await verifyEntity(
        entityId,
        dataSources,
        EntityType.Applet
      )

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        castTo(AppletDecoder, entity),
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
      const { entityId, changes, content, title, metaDescription, metaTitle } =
        input

      assertStringIsNotEmpty(
        changes,
        content,
        title,
        metaDescription,
        metaTitle
      )

      const entity = await verifyEntity(
        entityId,
        dataSources,
        EntityType.Article
      )

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        castTo(ArticleDecoder, entity),
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
      const { entityId, changes, content, title, metaDescription } = input

      assertStringIsNotEmpty(changes, content, title, metaDescription)

      const entity = await verifyEntity(
        entityId,
        dataSources,
        EntityType.Course
      )

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        castTo(CourseDecoder, entity),
        dataSources
      )

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
        isAutoreviewEntity,
      })
    },
    async addCoursePageRevision(_parent, { input }, { dataSources, userId }) {
      const { entityId, changes, content, title } = input

      assertStringIsNotEmpty(changes, content, title)

      const entity = await verifyEntity(
        entityId,
        dataSources,
        EntityType.CoursePage
      )

      const parent = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: castTo(CoursePageDecoder, entity).parentId,
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
      const { entityId, changes, content, title, metaDescription, metaTitle } =
        input

      assertStringIsNotEmpty(
        changes,
        content,
        title,
        metaDescription,
        metaTitle
      )

      const entity = await verifyEntity(entityId, dataSources, EntityType.Event)

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        castTo(EventDecoder, entity),
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
      const { entityId, changes, content } = input

      assertStringIsNotEmpty(changes, content)

      const entity = await verifyEntity(
        entityId,
        dataSources,
        EntityType.Exercise
      )

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        castTo(ExerciseDecoder, entity),
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

      assertStringIsNotEmpty(changes, content)

      const entity = await verifyEntity(
        entityId,
        dataSources,
        EntityType.ExerciseGroup
      )

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        castTo(ExerciseGroupDecoder, entity),
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

      assertStringIsNotEmpty(changes, content)

      const entity = await verifyEntity(
        entityId,
        dataSources,
        EntityType.GroupedExercise
      )

      const parent = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: castTo(GroupedExerciseDecoder, entity).parentId,
        decoder: ExerciseGroupDecoder,
      })

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        parent,
        dataSources
      )

      // TODO: What about solutionId?

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

      assertStringIsNotEmpty(changes, content)

      const entity = await verifyEntity(
        entityId,
        dataSources,
        EntityType.Solution
      )

      const parent = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: castTo(SolutionDecoder, entity).parentId,
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

      assertStringIsNotEmpty(changes, content, title, url)

      const entity = await verifyEntity(entityId, dataSources, EntityType.Video)

      const isAutoreviewEntity = await verifyAutoreviewEntity(
        castTo(VideoDecoder, entity),
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
  isAutoreviewEntity: boolean
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
  isAutoreviewEntity,
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

  if (!isAutoreviewEntity && !needsReview) {
    await assertUserIsAuthorized({
      userId,
      dataSources,
      message: 'You are not allowed to skip the reviewing process.',
      guard: serloAuth.Entity.checkoutRevision(scope),
    })
  }

  const fields = removeUndefinedFields(
    inputFields as { [key: string]: string | undefined }
  )

  const inputPayload = {
    changes,
    entityId,
    needsReview: isAutoreviewEntity ? false : needsReview,
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

async function verifyEntity(
  entityId: number,
  dataSources: { model: ModelDataSource },
  entityType: EntityType
) {
  const entity = await dataSources.model.serlo.getUuid({ id: entityId })

  if (entity === null) {
    throw 'Nothing found for the provided entityId'
  }

  if (!EntityDecoder.is(entity)) {
    throw 'No entity found for the provided entityId'
  }

  if (entity.__typename !== entityType) {
    throw `The entity of type ${entity.__typename} cannot have revision of another type`
  }

  return entity
}

async function verifyAutoreviewEntity(
  entity:
    | Model<'Applet'>
    | Model<'Article'>
    // | Model<'CoursePage'>
    | Model<'Course'>
    | Model<'Event'>
    | Model<'ExerciseGroup'>
    | Model<'Exercise'>
    // | Model<'GroupedExercise'>
    // | Model<'Solution'>
    | Model<'Video'>,
  dataSources: { model: ModelDataSource }
): Promise<boolean> {
  const taxonomyTermIds = entity.taxonomyTermIds as number[]

  for (const id of taxonomyTermIds) {
    // 106082 = sandkasten. TODO: make it configurable
    if ([106082].includes(id)) return true

    const taxonomyTerm = await dataSources.model.serlo.getUuidWithCustomDecoder(
      { id, decoder: TaxonomyTermDecoder }
    )

    const parentId = taxonomyTerm.parentId

    if (parentId && [106082].includes(parentId)) return true
  }

  return false
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

async function verifyParentExists(
  parentId: number,
  dataSources: { model: ModelDataSource }
) {
  const parent = await dataSources.model.serlo.getUuidWithCustomDecoder({
    id: parentId,
    decoder: t.union([EntityDecoder, t.null]),
  })

  if (!parent) {
    throw new UserInputError(
      `No entity found for the provided parentId ${parentId}`
    )
  }
}
