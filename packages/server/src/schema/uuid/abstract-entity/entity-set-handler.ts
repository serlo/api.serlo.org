import * as serloAuth from '@serlo/authorization'
import * as t from 'io-ts'
import * as R from 'ramda'

import { fromEntityTypeToEntityRevisionType } from './utils'
import { autoreviewTaxonomyIds, defaultLicenseIds } from '~/config'
import { UserInputError } from '~/errors'
import {
  assertStringIsNotEmpty,
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
  mandatoryFieldKeys: [
    keyof SetAbstractEntityInput,
    ...(keyof SetAbstractEntityInput)[],
  ]
  // TODO: the logic of this and others transformedInput's should go to DB Layer
  transformedInput?: (x: SetAbstractEntityInput) => SetAbstractEntityInput
}) {
  return async (
    _parent: unknown,
    { input }: { input: SetAbstractEntityInput },
    { dataSources, userId }: Context,
  ) => {
    assertStringIsNotEmpty(R.pick(mandatoryFieldKeys, input))

    if (transformedInput != null) input = transformedInput(input)

    const { needsReview } = input
    const forwardArgs = R.pick(
      ['changes', 'subscribeThis', 'subscribeThisByEmail'],
      input,
    )
    const fieldKeys = [
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
      R.filter((val) => val != null, R.pick(fieldKeys, input)),
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
        input.entityId == null ? 'Entity' : 'EntityRevision',
      )(scope),
    })

    const isAutoreview = await isAutoreviewEntity(
      input.entityId != null ? input.entityId : input.parentId,
      dataSources,
    )

    if (!isAutoreview && !needsReview) {
      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to skip the reviewing process.',
        guard: serloAuth.Entity.checkoutRevision(scope),
      })
    }

    const needsReviewForDBLayer = isAutoreview ? false : needsReview

    if (input.entityId != null) {
      const { success } = await dataSources.model.serlo.addEntityRevision({
        revisionType: fromEntityTypeToEntityRevisionType(entityType),
        userId,
        input: {
          ...forwardArgs,
          entityId: input.entityId,
          needsReview: needsReviewForDBLayer,
          fields,
        },
      })

      return {
        record: success
          ? await dataSources.model.serlo.getUuidWithCustomDecoder({
              id: input.entityId,
              decoder: EntityDecoder,
            })
          : null,
        success,
        query: {},
      }
    } else {
      const parent = await dataSources.model.serlo.getUuid({
        id: input.parentId,
      })
      const isParentTaxonomyTerm = TaxonomyTermDecoder.is(parent)
      const isParentEntity = EntityDecoder.is(parent)

      if (!isParentTaxonomyTerm && !isParentEntity)
        throw new UserInputError(
          `No entity or taxonomy term found for the provided id ${input.parentId}`,
        )

      const entity = await dataSources.model.serlo.createEntity({
        entityType,
        userId,
        input: {
          ...forwardArgs,
          licenseId: defaultLicenseIds[parent.instance],
          needsReview: needsReviewForDBLayer,
          ...(isParentTaxonomyTerm ? { taxonomyTermId: input.parentId } : {}),
          ...(isParentEntity ? { parentId: input.parentId } : {}),
          fields,
        },
      })

      return { record: entity, success: entity != null, query: {} }
    }
  }
}

async function isAutoreviewEntity(
  id: number,
  dataSources: Context['dataSources'],
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
        uuid.taxonomyTermIds.map((id) => isAutoreviewEntity(id, dataSources)),
      )
    ).every((x) => x)
  } else {
    return false
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
