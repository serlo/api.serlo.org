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
import * as R from 'ramda'

import { fromEntityTypeToEntityRevisionType } from './utils'
import { autoreviewTaxonomyIds } from '~/config/autoreview-taxonomies'
import {
  assertArgumentIsNotEmpty,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  Context,
} from '~/internals/graphql'
import { EntityDecoder, EntityType, TaxonomyTermDecoder } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'

export interface SetAbstractEntityInput {
  changes: string
  subscribeThis: boolean
  subscribeThisByEmail: boolean
  needsReview: boolean
  entityId?: number
  parentId?: number
  cohesive?: boolean
  content?: string
  description?: string
  metaDescription?: string
  metaTitle?: string
  title?: string
  url?: string
}

export function createSetEntityResolver({
  entityType,
  mandatoryFieldKeys,
  transformedInput,
}: {
  entityType: EntityType
  mandatoryFieldKeys: (keyof SetAbstractEntityInput)[]
  // TODO: the logic of this and others transformedInput's should go to DB Layer
  transformedInput?: (x: SetAbstractEntityInput) => SetAbstractEntityInput
}) {
  return async (
    _parent: unknown,
    { input }: { input: SetAbstractEntityInput },
    { dataSources, userId }: Context
  ) => {
    assertArgumentIsNotEmpty(R.pick(mandatoryFieldKeys, input))

    if (transformedInput != null) input = transformedInput(input)

    const { needsReview } = input
    const forwardArgs = R.pick(
      ['changes', 'subscribeThis', 'subscribeThisByEmail'],
      input
    )
    const fieldKeys = [
      'cohesive',
      'content',
      'description',
      'metaDescription',
      'metaTitle',
      'title',
      'url',
    ] as const
    const fields = R.mapObjIndexed(
      (val: string | boolean) =>
        typeof val !== 'string' ? val.toString() : val,
      R.filter((val) => val != null, R.pick(fieldKeys, input))
    )

    if (!checkInput(input))
      throw new UserInputError('Either entityId or parentId must be provided')

    assertUserIsAuthenticated(userId)

    const scope = await fetchScopeOfUuid({
      id: input.entityId != null ? input.entityId : input.parentId,
      dataSources,
    })

    await assertUserIsAuthorized({
      userId,
      dataSources,
      message: `You are not allowed to create ${
        input.entityId == null ? 'entities' : 'revisions'
      }`,
      guard: serloAuth.Uuid.create(
        input.entityId == null ? 'Entity' : 'EntityRevision'
      )(scope),
    })

    if (input.entityId != null) {
      const isAutoreview = await isAutoreviewEntity(input.entityId, dataSources)

      if (!isAutoreview && !needsReview) {
        await assertUserIsAuthorized({
          userId,
          dataSources,
          message: 'You are not allowed to skip the reviewing process.',
          guard: serloAuth.Entity.checkoutRevision(scope),
        })
      }

      const { success, revisionId } =
        await dataSources.model.serlo.addEntityRevision({
          revisionType: fromEntityTypeToEntityRevisionType(entityType),
          userId,
          input: {
            ...forwardArgs,
            entityId: input.entityId,
            needsReview: isAutoreview ? false : needsReview,
            fields,
          },
        })

      return { revisionId, success, query: {} }
    } else {
      const parent = await dataSources.model.serlo.getUuid({
        id: input.parentId,
      })
      const isParentTaxonomyTerm = TaxonomyTermDecoder.is(parent)
      const isParentEntity = EntityDecoder.is(parent)

      if (!isParentTaxonomyTerm && !isParentEntity)
        throw new UserInputError(
          `No entity or taxonomy term found for the provided id ${input.parentId}`
        )

      const entity = await dataSources.model.serlo.createEntity({
        entityType,
        userId,
        input: {
          ...forwardArgs,
          licenseId: 1,
          needsReview,
          instance: parent.instance,
          ...(isParentTaxonomyTerm ? { taxonomyTermId: input.parentId } : {}),
          ...(isParentEntity ? { parentId: input.parentId } : {}),
          fields,
        },
      })
      return { record: entity, success: entity != null, query: {} }
    }
  }
}

function checkInput(input: {
  parentId?: number
  entityId?: number
}): input is
  | { parentId: number; entityId: undefined }
  | { parentId: undefined; entityId: number } {
  return (
    (input.entityId != null && input.parentId == null) ||
    (input.entityId == null && input.parentId != null)
  )
}

async function isAutoreviewEntity(
  id: number,
  dataSources: Context['dataSources']
): Promise<boolean> {
  if (autoreviewTaxonomyIds.includes(id)) return true

  const uuid = await dataSources.model.serlo.getUuid({ id })

  if (t.type({ parentId: t.number }).is(uuid)) {
    return (
      uuid.parentId != null &&
      (await isAutoreviewEntity(uuid.parentId, dataSources))
    )
  } else if (t.type({ taxonomyTermIds: t.array(t.number) }).is(uuid)) {
    return (
      await Promise.all(
        uuid.taxonomyTermIds.map((id) => isAutoreviewEntity(id, dataSources))
      )
    ).every((x) => x)
  } else {
    return false
  }
}
