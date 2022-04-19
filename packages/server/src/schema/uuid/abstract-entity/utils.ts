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

  const inputPayload = {
    changes,
    instance,
    licenseId,
    needsReview,
    parentId,
    subscribeThis,
    subscribeThisByEmail,
    taxonomyTermId,
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
  dataSources: Context['dataSources']
  userId: number | null
  isAutoreviewEntity: boolean
}

export async function addRevision({
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

export async function getEntity<S extends Model<'AbstractEntity'>>(
  entityId: number,
  dataSources: Context['dataSources'],
  decoder: t.Type<S, unknown>
) {
  return await dataSources.model.serlo.getUuidWithCustomDecoder({
    id: entityId,
    decoder,
  })
}

export async function verifyAutoreviewEntity(
  entity: { taxonomyTermIds: number[] },
  dataSources: Context['dataSources']
): Promise<boolean> {
  const taxonomyTermIds = entity.taxonomyTermIds

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
