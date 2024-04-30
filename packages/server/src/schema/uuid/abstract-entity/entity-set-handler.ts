import * as serloAuth from '@serlo/authorization'
import * as t from 'io-ts'
import * as R from 'ramda'

import { fromEntityTypeToEntityRevisionType } from './utils'
import { UuidResolver } from '../abstract-uuid/resolvers'
import { autoreviewTaxonomyIds, defaultLicenseIds } from '~/config'
import { Context } from '~/context'
import { UserInputError } from '~/errors'
import {
  Model,
  assertStringIsNotEmpty,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
} from '~/internals/graphql'
import {
  EntityDecoder,
  EntityType,
  EntityTypeDecoder,
  TaxonomyTermDecoder,
} from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'

export interface SetAbstractEntityInput {
  entityType: string
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

type InputFields = keyof SetAbstractEntityInput

const mandatoryFieldsLookup: Record<EntityType, InputFields[]> = {
  [EntityType.Applet]: ['content', 'title', 'url'],
  [EntityType.Article]: ['content', 'title'],
  [EntityType.Course]: ['title'],
  [EntityType.CoursePage]: ['content', 'title'],
  [EntityType.Event]: ['content', 'title'],
  [EntityType.Exercise]: ['content'],
  [EntityType.ExerciseGroup]: ['content'],
  [EntityType.Video]: ['title', 'url'],
}

export function createSetEntityResolver() {
  return async (
    _parent: unknown,
    { input }: { input: SetAbstractEntityInput },
    context: Context,
  ): Promise<Model<'SetEntityResponse'>> => {
    const { dataSources, userId } = context
    const {
      entityType,
      changes,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
    } = input
    assertStringIsNotEmpty({
      changes,
      entityType,
    })

    if (!EntityTypeDecoder.is(entityType)) {
      throw new UserInputError(
        `The provided entityType (${entityType}) is not supported`,
      )
    }

    assertStringIsNotEmpty({
      ...mandatoryFieldsLookup[entityType],
    })

    // TODO: the logic of this and others special cases should go to DB Layer
    if (entityType === EntityType.Course) {
      input = {
        ...input,
        description: input.content,
        content: undefined,
      }
    }
    if (entityType === EntityType.Video) {
      input = {
        ...input,
        description: input.content,
        content: input.url,
        url: undefined,
      }
    }

    const forwardArgs = { changes, subscribeThis, subscribeThisByEmail }

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

    const scope = await fetchScopeOfUuid(
      { id: input.entityId != null ? input.entityId : input.parentId },
      context,
    )

    await assertUserIsAuthorized({
      context,
      message: `You are not allowed to create ${
        input.entityId == null ? 'entities' : 'revisions'
      }`,
      guard: serloAuth.Uuid.create(
        input.entityId == null ? 'Entity' : 'EntityRevision',
      )(scope),
    })

    const isAutoreview = await isAutoreviewEntity(
      input.entityId != null ? input.entityId : input.parentId,
      context,
    )

    if (!isAutoreview && !needsReview) {
      await assertUserIsAuthorized({
        context,
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
          ? await UuidResolver.resolveWithDecoder(
              EntityDecoder,
              { id: input.entityId },
              context,
            )
          : null,
        success,
        query: {},
      }
    } else {
      const parent = await UuidResolver.resolve({ id: input.parentId }, context)
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
  context: Context,
): Promise<boolean> {
  if (autoreviewTaxonomyIds.includes(id)) return true

  const uuid = await UuidResolver.resolve({ id }, context)

  if (t.type({ parentId: t.number }).is(uuid)) {
    return (
      uuid.parentId != null &&
      (await isAutoreviewEntity(uuid.parentId, context))
    )
  } else if (t.type({ taxonomyTermIds: t.array(t.number) }).is(uuid)) {
    return (
      await Promise.all(
        uuid.taxonomyTermIds.map((id) => isAutoreviewEntity(id, context)),
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
