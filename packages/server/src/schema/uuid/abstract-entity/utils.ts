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

import { getTaxonomyTerm } from '../taxonomy-term/utils'
import { autoreviewTaxonomyIds } from '~/config/autoreview-taxonomies'
import { InvalidCurrentValueError } from '~/internals/data-source-helper'
import {
  assertArgumentIsNotEmpty,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  Context,
  Model,
  PickResolvers,
  Repository,
  ResolverFunction,
} from '~/internals/graphql'
import {
  EntityDecoder,
  EntityRevisionType,
  EntityType,
  TaxonomyTermDecoder,
} from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { Connection } from '~/schema/connection/types'
import { createRepositoryResolvers } from '~/schema/uuid/abstract-repository/utils'
import { VideoRevisionsArgs } from '~/types'

export function createEntityResolvers<
  R extends Model<'AbstractEntityRevision'>
>({
  revisionDecoder,
}: {
  revisionDecoder: t.Type<R, unknown>
}): PickResolvers<
  'AbstractEntity',
  'alias' | 'threads' | 'license' | 'events' | 'subject'
> &
  // TODO: Add threads to "AbstractEntity"
  PickResolvers<'AbstractRepository', 'threads'> & {
    currentRevision: ResolverFunction<R | null, Repository<R['__typename']>>
    revisions: ResolverFunction<
      Connection<R>,
      Repository<R['__typename']>,
      VideoRevisionsArgs
    >
  } {
  return {
    ...createRepositoryResolvers({ revisionDecoder }),
    subject(entity) {
      return entity.canonicalSubjectId
        ? { taxonomyTermId: entity.canonicalSubjectId }
        : null
    },
  }
}

export interface AbstractEntitySetInput {
  changes: string
  subscribeThis: boolean
  subscribeThisByEmail: boolean
  needsReview: boolean
  entityId?: number
  parentId?: number
  cohesive?: 'true' | 'false'
  content?: string
  description?: string
  metaDescription?: string
  metaTitle?: string
  title?: string
  url?: string
}

interface setEntityMutationArgs {
  entityType: EntityType
  input: AbstractEntitySetInput
  mandatoryFields: { [key: string]: string | boolean }
}

export async function buildSetEntityResolver<
  C extends Model<'AbstractEntity'> & {
    taxonomyTermIds?: number[]
    parentId?: number
  },
  P extends Model<'AbstractEntity'> & {
    taxonomyTermIds?: number[]
    parentId?: number
  }
>(
  args: setEntityMutationArgs,
  context: Context,
  {
    childDecoder,
    parentDecoder,
  }: { childDecoder: t.Type<C, unknown>; parentDecoder?: t.Type<P, unknown> }
) {
  const { entityType, input, mandatoryFields } = args
  const { entityId, parentId } = input

  if (userWantsToCreateNewEntity(entityId, parentId)) {
    const parentTypename = (
      await context.dataSources.model.serlo.getUuid({ id: parentId })
    )?.__typename

    const newInput = {
      ...input,
      taxonomyTermId: parentTypename === 'TaxonomyTerm' ? parentId : undefined,
      parentId: parentTypename === 'TaxonomyTerm' ? undefined : parentId,
    }
    return await buildCreateEntityResolver(
      {
        entityType,
        input: newInput,
        mandatoryFields,
      },
      context
    )
  } else {
    return await buildAddRevisionResolver(
      {
        revisionType: fromEntityTypeToEntityRevisionType(entityType),
        input: {
          ...input,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          entityId: input.entityId!,
        },
        mandatoryFields,
      },
      context,
      { childDecoder, parentDecoder }
    )
  }
}

function userWantsToCreateNewEntity(
  entityId?: number | undefined,
  parentId?: number
): parentId is number {
  if (!entityId && !parentId)
    throw new UserInputError('Either entityId or parentId has to be provided')

  if (entityId) {
    return false
  }
  return true
}

interface AbstractEntityCreateInput {
  changes: string
  subscribeThis: boolean
  subscribeThisByEmail: boolean
  needsReview: boolean
  parentId?: number
  taxonomyTermId?: number
  cohesive?: 'true' | 'false'
  content?: string
  description?: string
  metaDescription?: string
  metaTitle?: string
  title?: string
  url?: string
}
interface createEntityMutationArgs {
  entityType: EntityType
  input: AbstractEntityCreateInput
  mandatoryFields: { [key: string]: string | boolean }
}

export async function buildCreateEntityResolver(
  args: createEntityMutationArgs,
  { dataSources, userId }: Context
) {
  assertUserIsAuthenticated(userId)

  const { mandatoryFields, input, entityType } = args

  assertArgumentIsNotEmpty(mandatoryFields)

  const {
    changes,
    needsReview,
    subscribeThis,
    subscribeThisByEmail,
    parentId,
    taxonomyTermId,
    ...inputFields
  } = input

  let parent: Model<'AbstractEntity' | 'TaxonomyTerm'>

  if (taxonomyTermId) {
    parent = await getTaxonomyTerm(taxonomyTermId, dataSources)
  } else if (parentId) {
    parent = await getEntity(parentId, dataSources)
  } else {
    throw new Error('parentId or taxonomyTermId has to be provided')
  }

  await assertUserIsAuthorized({
    userId,
    dataSources,
    message: 'You are not allowed to add revision to this entity.',
    guard: serloAuth.Uuid.create('Entity')(
      serloAuth.instanceToScope(parent.instance)
    ),
  })

  const fields = removeUndefinedFields(
    inputFields as { [key: string]: string | undefined }
  )

  const entity = await dataSources.model.serlo.createEntity({
    entityType,
    userId,
    input: {
      changes,
      instance: parent.instance,
      licenseId: 1,
      needsReview,
      parentId,
      subscribeThis,
      subscribeThisByEmail,
      taxonomyTermId,
      fields,
    },
  })

  return {
    record: entity,
    success: entity != null,
    query: {},
  }
}

interface AbstractEntityAddRevisionInput {
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

interface addEntityRevisionMutationArgs {
  revisionType: EntityRevisionType
  input: AbstractEntityAddRevisionInput
  mandatoryFields: { [key: string]: string | boolean }
}

export async function buildAddRevisionResolver<
  C extends Model<'AbstractEntity'> & {
    taxonomyTermIds?: number[]
    parentId?: number
  },
  P extends Model<'AbstractEntity'> & {
    taxonomyTermIds?: number[]
    parentId?: number
  }
>(
  args: addEntityRevisionMutationArgs,
  { dataSources, userId }: Context,
  {
    childDecoder,
    parentDecoder,
  }: { childDecoder: t.Type<C, unknown>; parentDecoder?: t.Type<P, unknown> }
) {
  assertUserIsAuthenticated(userId)

  const { input, mandatoryFields, revisionType } = args

  assertArgumentIsNotEmpty(mandatoryFields)

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

  const entity = await dataSources.model.serlo.getUuidWithCustomDecoder({
    id: entityId,
    decoder: childDecoder,
  })

  let isAutoreviewEntity = false

  if (entity.taxonomyTermIds) {
    isAutoreviewEntity = await verifyAutoreviewEntity(
      entity.taxonomyTermIds,
      dataSources
    )
  }

  if (entity.parentId && parentDecoder) {
    const parent = await dataSources.model.serlo.getUuidWithCustomDecoder({
      id: entity.parentId,
      decoder: parentDecoder,
    })

    if (parent.taxonomyTermIds) {
      isAutoreviewEntity = await verifyAutoreviewEntity(
        parent.taxonomyTermIds,
        dataSources
      )
    }
  }

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

export async function verifyAutoreviewEntity(
  taxonomyTermIds: number[],
  dataSources: Context['dataSources']
): Promise<boolean> {
  return (
    await Promise.all(
      taxonomyTermIds.map((id) => checkAnyParentAutoreview(id, dataSources))
    )
  ).every((x) => x)
}

async function checkAnyParentAutoreview(
  taxonomyTermId: number,
  dataSources: Context['dataSources']
): Promise<boolean> {
  if (autoreviewTaxonomyIds.includes(taxonomyTermId)) return true

  const taxonomyTerm = await dataSources.model.serlo.getUuidWithCustomDecoder({
    id: taxonomyTermId,
    decoder: TaxonomyTermDecoder,
  })

  return (
    taxonomyTerm.parentId !== null &&
    (await checkAnyParentAutoreview(taxonomyTerm.parentId, dataSources))
  )
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

async function getEntity(
  entityId: number,
  dataSources: Context['dataSources']
) {
  await assertIsEntity(entityId, dataSources)

  return await dataSources.model.serlo.getUuidWithCustomDecoder({
    id: entityId,
    decoder: EntityDecoder,
  })
}

async function assertIsEntity(id: number, dataSources: Context['dataSources']) {
  try {
    await dataSources.model.serlo.getUuidWithCustomDecoder({
      id,
      decoder: EntityDecoder,
    })
  } catch (error) {
    if (error instanceof InvalidCurrentValueError) {
      throw new UserInputError(`No entity found for the provided id ${id}`)
    } else {
      throw error
    }
  }
}

export function fromEntityTypeToEntityRevisionType(
  entityType: EntityType
): EntityRevisionType {
  switch (entityType) {
    case EntityType.Applet:
      return EntityRevisionType.AppletRevision
    case EntityType.Article:
      return EntityRevisionType.ArticleRevision
    case EntityType.Course:
      return EntityRevisionType.CourseRevision
    case EntityType.CoursePage:
      return EntityRevisionType.CoursePageRevision
    case EntityType.Event:
      return EntityRevisionType.EventRevision
    case EntityType.Exercise:
      return EntityRevisionType.ExerciseRevision
    case EntityType.ExerciseGroup:
      return EntityRevisionType.ExerciseGroupRevision
    case EntityType.GroupedExercise:
      return EntityRevisionType.GroupedExerciseRevision
    case EntityType.Solution:
      return EntityRevisionType.SolutionRevision
    case EntityType.Video:
      return EntityRevisionType.VideoRevision
  }
}
