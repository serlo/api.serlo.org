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
import {
  getEntity,
  fromEntityTypeToEntityRevisionType,
  removeUndefinedFields,
} from './utils'
import { autoreviewTaxonomyIds } from '~/config/autoreview-taxonomies'
import {
  assertArgumentIsNotEmpty,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  Context,
  Model,
} from '~/internals/graphql'
import { EntityType, TaxonomyTermDecoder } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'

export interface SetAbstractEntityInput {
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

interface SetEntityMutationArgs {
  entityType: EntityType
  input: SetAbstractEntityInput
  mandatoryFields: { [key: string]: string | boolean }
}

export async function handleEntitySet<
  C extends Model<'AbstractEntity'> & {
    taxonomyTermIds?: number[]
    parentId?: number
  },
  P extends Model<'AbstractEntity'> & {
    taxonomyTermIds?: number[]
    parentId?: number
  }
>(
  args: SetEntityMutationArgs,
  context: Context,
  {
    childDecoder,
    parentDecoder,
  }: { childDecoder: t.Type<C, unknown>; parentDecoder?: t.Type<P, unknown> }
) {
  const { entityType, input, mandatoryFields } = args

  assertArgumentIsNotEmpty(mandatoryFields)

  const { entityId, parentId } = input

  if (userWantsToCreateNewEntity(entityId, parentId)) {
    return await new EntitySetResolver({
      auth: {
        typeToBeCreated: 'Entity',
        message: 'You are not allowed to create entities.',
      },
      input,
      context,
      entityType,
      decoders: {
        childDecoder,
        parentDecoder,
      },
    }).execute()
  }

  return await new EntitySetResolver({
    auth: {
      typeToBeCreated: 'EntityRevision',
      message: 'You are not allowed to add revision to this entity',
    },
    context,
    input,
    entityType,
    decoders: {
      childDecoder,
      parentDecoder,
    },
  }).execute()
}

class EntitySetResolver<
  C extends Model<'AbstractEntity'> & {
    taxonomyTermIds?: number[]
    parentId?: number
  },
  P extends Model<'AbstractEntity'> & {
    taxonomyTermIds?: number[]
    parentId?: number
  }
> {
  auth: {
    typeToBeCreated: 'Entity' | 'EntityRevision'
    message: string
  }
  input: SetAbstractEntityInput
  context: Context
  entityType: EntityType
  decoders: {
    childDecoder: t.Type<C, unknown>
    parentDecoder?: t.Type<P, unknown>
  }

  constructor({
    auth,
    input,
    context,
    entityType,
    decoders,
  }: {
    auth: {
      typeToBeCreated: 'Entity' | 'EntityRevision'
      message: string
    }
    input: SetAbstractEntityInput
    context: Context
    entityType: EntityType
    decoders: {
      childDecoder: t.Type<C, unknown>
      parentDecoder?: t.Type<P, unknown>
    }
  }) {
    this.auth = auth
    this.context = context
    this.entityType = entityType
    this.input = input
    this.decoders = decoders
  }

  async execute() {
    const {
      changes,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
      parentId,
      entityId,
      ...inputFields
    } = this.input

    const { dataSources, userId } = this.context

    assertUserIsAuthenticated(userId)

    const scope = entityId
      ? await fetchScopeOfUuid({
          id: entityId,
          dataSources,
        })
      : await fetchScopeOfUuid({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: parentId!,
          dataSources,
        })

    await assertUserIsAuthorized({
      userId,
      dataSources,
      message: this.auth.message,
      guard: serloAuth.Uuid.create(this.auth.typeToBeCreated)(scope),
    })

    const fields = removeUndefinedFields(
      inputFields as { [key: string]: string | undefined }
    )

    if (entityId) {
      const { childDecoder, parentDecoder } = this.decoders
      let isAutoreviewEntity = false

      const entity = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: entityId,
        decoder: childDecoder,
      })

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

      const { success, revisionId } =
        await dataSources.model.serlo.addEntityRevision({
          revisionType: fromEntityTypeToEntityRevisionType(this.entityType),
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

    const entity = await dataSources.model.serlo.createEntity({
      entityType: this.entityType,
      userId,
      input: {
        changes,
        licenseId: 1,
        needsReview,
        subscribeThis,
        subscribeThisByEmail,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...(await this.prepareCreateArgs(parentId!)),
        fields,
      },
    })
    return {
      record: entity,
      success: entity != null,
      query: {},
    }
  }

  async prepareCreateArgs(parentId: number) {
    const { dataSources } = this.context

    const parentTypename = (
      await dataSources.model.serlo.getUuid({ id: parentId })
    )?.__typename

    if (parentTypename === 'TaxonomyTerm') {
      return {
        taxonomyTermId: parentId,
        instance: (await getTaxonomyTerm(parentId, dataSources)).instance,
      }
    }

    return {
      parentId,
      instance: (await getEntity(parentId, dataSources)).instance,
    }
  }
}

function userWantsToCreateNewEntity(
  entityId?: number,
  parentId?: number
): parentId is number {
  if ((!entityId && !parentId) || (entityId && parentId))
    throw new UserInputError('Either entityId or parentId has to be provided')

  return entityId == null
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
