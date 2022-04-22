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
import R from 'ramda'

import { assertIsTaxonomyTerm } from '../taxonomy-term/utils'
import { autoreviewTaxonomyIds } from '~/config/autoreview-taxonomies'
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
import { Instance, VideoRevisionsArgs } from '~/types'

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

export interface AbstractEntityCreateInput {
  changes: string
  subscribeThis: boolean
  subscribeThisByEmail: boolean
  instance: Instance
  licenseId: number
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
    instance,
    licenseId,
    needsReview,
    subscribeThis,
    subscribeThisByEmail,
    parentId,
    taxonomyTermId,
    ...inputFields
  } = input

  if (taxonomyTermId) await assertIsTaxonomyTerm(taxonomyTermId, dataSources)

  if (parentId) await assertParentExists(parentId, dataSources)

  // TODO: get the instance from taxonomyTerm or parent

  await assertUserIsAuthorized({
    userId,
    dataSources,
    message: 'You are not allowed to add revision to this entity.',
    guard: serloAuth.Uuid.create('Entity')(serloAuth.instanceToScope(instance)),
  })

  const fields = removeUndefinedFields(
    inputFields as { [key: string]: string | undefined }
  )

  const entity = await dataSources.model.serlo.createEntity({
    entityType,
    userId,
    input: {
      changes,
      instance,
      licenseId,
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

  const { success, revisionId } =
    await dataSources.model.serlo.addEntityRevision({
      revisionType,
      userId,
      input: {
        changes,
        entityId,
        needsReview: isAutoreviewEntity ? false : needsReview,
        subscribeThis,
        subscribeThisByEmail,
        fields,
      },
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
  return R.filter((value) => value != undefined, inputFields) as {
    [key: string]: string
  }
}

async function assertParentExists(
  parentId: number,
  dataSources: Context['dataSources']
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
