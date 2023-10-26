import gql from 'graphql-tag'
import R from 'ramda'

import {
  applet,
  article,
  course,
  coursePage,
  event,
  exercise,
  exerciseGroup,
  groupedExercise,
  taxonomyTermSubject,
  taxonomyTermRoot,
  user,
  video,
  appletRevision,
  articleRevision,
  courseRevision,
  coursePageRevision,
  eventRevision,
  exerciseRevision,
  exerciseGroupRevision,
  groupedExerciseRevision,
  videoRevision,
} from '../../../__fixtures__'
import { given, Client, nextUuid, getTypenameAndId } from '../../__utils__'
import { Model } from '~/internals/graphql'
import { DatabaseLayer } from '~/model'
import { castToUuid, DiscriminatorType, EntityType } from '~/model/decoder'
import { SetAbstractEntityInput } from '~/schema/uuid/abstract-entity/entity-set-handler'
import { fromEntityTypeToEntityRevisionType } from '~/schema/uuid/abstract-entity/utils'

interface EntityFields {
  title: string
  cohesive: boolean
  content: string
  description: string
  metaTitle: string
  metaDescription: string
  url: string
}

const ALL_POSSIBLE_FIELDS: EntityFields = {
  title: 'title',
  cohesive: false,
  content: 'content',
  description: 'description',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  url: 'https://url.org',
}

const fieldKeys: Record<
  EntityType,
  [keyof EntityFields, ...(keyof EntityFields)[]]
> = {
  [EntityType.Applet]: [
    'title',
    'content',
    'metaTitle',
    'metaDescription',
    'url',
  ],
  [EntityType.Article]: ['title', 'content', 'metaTitle', 'metaDescription'],
  [EntityType.Course]: ['title', 'content', 'metaDescription'],
  [EntityType.CoursePage]: ['title', 'content'],
  [EntityType.Event]: ['title', 'content', 'metaTitle', 'metaDescription'],
  [EntityType.Exercise]: ['content'],
  [EntityType.ExerciseGroup]: ['cohesive', 'content'],
  [EntityType.GroupedExercise]: ['content'],
  [EntityType.Video]: ['title', 'content', 'url'],
}
const entities = [
  applet,
  article,
  course,
  coursePage,
  event,
  exercise,
  exerciseGroup,
  groupedExercise,
  video,
]

class EntitySetTestCase {
  public mutationName: string
  public fields: Partial<EntityFields>

  constructor(public entity: Model<'AbstractEntity'>) {
    this.mutationName = `set${this.entityType}`
    this.fields = R.pick(fieldKeys[this.entityType], ALL_POSSIBLE_FIELDS)
  }

  get entityType() {
    return this.entity.__typename
  }

  get inputName() {
    return [EntityType.Exercise, EntityType.GroupedExercise].includes(
      this.entityType,
    )
      ? 'SetGenericEntityInput'
      : `Set${this.entityType}Input`
  }

  get parent(): Model<'AbstractEntity' | 'TaxonomyTerm'> {
    switch (this.entityType) {
      case EntityType.CoursePage:
        return course
      case EntityType.GroupedExercise:
        return exerciseGroup
      default:
        return taxonomyTermSubject
    }
  }

  get fieldsToDBLayer() {
    if (this.entityType === EntityType.ExerciseGroup) {
      return {
        cohesive: this.fields.cohesive!.toString(),
        content: this.fields.content!,
      }
    } else if (this.entityType === EntityType.Course) {
      return {
        description: this.fields.content!,
        title: this.fields.title!,
        metaDescription: this.fields.metaDescription!,
      }
    } else if (this.entityType === EntityType.Video) {
      return {
        content: this.fields.url!,
        description: this.fields.content!,
        title: this.fields.title!,
      }
    } else {
      return this.fields as Record<string, string>
    }
  }

  get revision() {
    switch (this.entityType) {
      case EntityType.Applet:
        return appletRevision
      case EntityType.Article:
        return articleRevision
      case EntityType.Course:
        return courseRevision
      case EntityType.CoursePage:
        return coursePageRevision
      case EntityType.Event:
        return eventRevision
      case EntityType.Exercise:
        return exerciseRevision
      case EntityType.ExerciseGroup:
        return exerciseGroupRevision
      case EntityType.GroupedExercise:
        return groupedExerciseRevision
      case EntityType.Video:
        return videoRevision
    }
  }
}

const testCases = entities.map((entity) => new EntitySetTestCase(entity))

beforeEach(() => {
  given('UuidQuery').for(user, taxonomyTermRoot)
})

testCases.forEach((testCase) => {
  describe(testCase.mutationName, () => {
    const input: SetAbstractEntityInput = {
      changes: 'changes',
      needsReview: true,
      subscribeThis: false,
      subscribeThisByEmail: false,
      ...testCase.fields,
    }

    const mutationWithParentId = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          mutation set($input: ${testCase.inputName}!) {
            entity {
              ${testCase.mutationName}(input: $input) {
                success
                record {
                  id
                }
              }
            }
          }
        `,
      })
      .withInput({ ...input, parentId: testCase.parent.id })

    const inputWithEntityId = { ...input, entityId: testCase.entity.id }

    const mutationWithEntityId = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          mutation set($input: ${testCase.inputName}!) {
            entity {
              ${testCase.mutationName}(input: $input) {
                success
                record {
                  id
                }
              }
            }
          }
        `,
      })
      .withInput(inputWithEntityId)

    const { changes, needsReview, subscribeThis, subscribeThisByEmail } = input

    const entityCreatePayload: DatabaseLayer.Payload<'EntityCreateMutation'> = {
      input: {
        changes,
        needsReview,
        licenseId: 1,
        subscribeThis,
        subscribeThisByEmail,
        fields: testCase.fieldsToDBLayer,
        ...(testCase.parent.__typename == DiscriminatorType.TaxonomyTerm
          ? { taxonomyTermId: testCase.parent.id }
          : {}),
        ...(testCase.parent.__typename != DiscriminatorType.TaxonomyTerm
          ? { parentId: testCase.parent.id }
          : {}),
      },
      userId: user.id,
      entityType: testCase.entityType,
    }

    const entityAddRevisionPayload: DatabaseLayer.Payload<'EntityAddRevisionMutation'> =
      {
        input: {
          changes,
          entityId: inputWithEntityId.entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields: testCase.fieldsToDBLayer,
        },
        userId: user.id,
        revisionType: fromEntityTypeToEntityRevisionType(testCase.entityType),
      }

    beforeEach(() => {
      given('UuidQuery').for(testCase.parent, taxonomyTermSubject)
    })

    test('creates an entity when parentId is provided', async () => {
      given('EntityCreateMutation')
        .withPayload(entityCreatePayload)
        .returns(testCase.entity)

      await mutationWithParentId.shouldReturnData({
        entity: {
          [testCase.mutationName]: {
            success: true,
            record: { id: testCase.entity.id },
          },
        },
      })
    })

    test('adds new entity revision when entityId is provided', async () => {
      given('UuidQuery').for(testCase.entity)

      given('EntityAddRevisionMutation')
        .withPayload(entityAddRevisionPayload)
        .returns({ success: true, revisionId: 123 })

      await mutationWithEntityId.shouldReturnData({
        entity: {
          [testCase.mutationName]: {
            success: true,
            record: { id: testCase.entity.id },
          },
        },
      })
    })

    test('fails when user is not authenticated', async () => {
      await mutationWithEntityId
        .forUnauthenticatedUser()
        .shouldFailWithError('UNAUTHENTICATED')
    })

    test('fails when user does not have role "login"', async () => {
      given('UuidQuery').for(testCase.entity)

      const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

      given('UuidQuery').for(guestUser)

      await mutationWithEntityId
        .withContext({ userId: guestUser.id })
        .shouldFailWithError('FORBIDDEN')
    })

    describe('fails when a field is empty', () => {
      test.each([
        ['empty string', ''],
        ['string with just spaces', '   '],
      ])('%s', async (_, changes) => {
        await mutationWithEntityId
          .changeInput({ changes })
          .shouldFailWithError('BAD_USER_INPUT')

        await mutationWithParentId
          .changeInput({ changes })
          .shouldFailWithError('BAD_USER_INPUT')
      })
    })

    test('fails when database layer returns a 400er response', async () => {
      given('EntityCreateMutation').returnsBadRequest()
      given('EntityAddRevisionMutation').returnsBadRequest()

      await mutationWithParentId.shouldFailWithError('BAD_USER_INPUT')

      given('UuidQuery').for(testCase.entity)
      await mutationWithEntityId.shouldFailWithError('BAD_USER_INPUT')
    })

    test('fails when database layer has an internal error', async () => {
      given('EntityCreateMutation').hasInternalServerError()
      given('EntityAddRevisionMutation').hasInternalServerError()

      await mutationWithParentId.shouldFailWithError('INTERNAL_SERVER_ERROR')

      given('UuidQuery').for(testCase.entity)
      await mutationWithEntityId.shouldFailWithError('INTERNAL_SERVER_ERROR')
    })

    test('fails when parent does not exists', async () => {
      given('UuidQuery')
        .withPayload({ id: testCase.parent.id })
        .returnsNotFound()

      await mutationWithParentId.shouldFailWithError('BAD_USER_INPUT')
    })

    describe(`Cache after ${testCase.mutationName} call`, () => {
      const newRevision = { ...testCase.revision, id: castToUuid(123) }
      const anotherEntity = { ...testCase.entity, id: castToUuid(456) }

      beforeEach(() => {
        given('UuidQuery').for(
          testCase.entity,
          testCase.revision,
          anotherEntity,
          taxonomyTermSubject,
        )

        given('EntityAddRevisionMutation')
          .withPayload(entityAddRevisionPayload)
          .returns({ success: true, revisionId: newRevision.id })

        given('EntityAddRevisionMutation')
          .withPayload({
            ...entityAddRevisionPayload,
            input: {
              ...entityAddRevisionPayload.input,
              subscribeThis: true,
              subscribeThisByEmail: true,
            },
          })
          .returns({ success: true, revisionId: newRevision.id })

        given('EntityAddRevisionMutation')
          .withPayload({
            ...entityAddRevisionPayload,
            input: { ...entityAddRevisionPayload.input, needsReview: false },
          })
          .isDefinedBy((_, res, ctx) => {
            given('UuidQuery').for(
              { ...testCase.entity, currentRevisionId: newRevision.id },
              newRevision,
            )

            return res(ctx.json({ success: true, revisionId: newRevision.id }))
          })

        given('SubscriptionsQuery')
          .withPayload({ userId: user.id })
          .returns({
            subscriptions: [{ objectId: anotherEntity.id, sendEmail: true }],
          })
      })

      test('updates the checked out revision when needsReview=false', async () => {
        const uuidQuery = new Client({ userId: user.id })
          .prepareQuery({
            query: gql`
              query ($id: Int!) {
                uuid(id: $id) {
                  id
                  __typename
                  ... on ${testCase.entityType} {
                    currentRevision {
                      id
                    }
                  }
                }
              }
            `,
          })
          .withVariables({ id: testCase.entity.id })

        await uuidQuery.shouldReturnData({
          uuid: {
            id: testCase.entity.id,
            __typename: testCase.entity.__typename,
            currentRevision: { id: testCase.entity.currentRevisionId },
          },
        })

        await mutationWithEntityId.execute()

        await uuidQuery.shouldReturnData({
          uuid: { currentRevision: { id: testCase.entity.currentRevisionId } },
        })

        await mutationWithEntityId
          .withInput({ ...inputWithEntityId, needsReview: false })
          .execute()

        await uuidQuery.shouldReturnData({
          uuid: { currentRevision: { id: newRevision.id } },
        })
      })

      test('updates the subscriptions', async () => {
        const subscritionsQuery = new Client({
          userId: user.id,
        }).prepareQuery({
          query: gql`
            query {
              subscription {
                getSubscriptions {
                  nodes {
                    object {
                      __typename
                      id
                    }
                    sendEmail
                  }
                }
              }
            }
          `,
        })

        await subscritionsQuery.shouldReturnData({
          subscription: {
            getSubscriptions: {
              nodes: [
                { object: getTypenameAndId(anotherEntity), sendEmail: true },
              ],
            },
          },
        })

        await mutationWithEntityId
          .withInput({
            ...inputWithEntityId,
            subscribeThis: true,
            subscribeThisByEmail: true,
          })
          .execute()

        await subscritionsQuery.shouldReturnData({
          subscription: {
            getSubscriptions: {
              nodes: [
                { object: getTypenameAndId(anotherEntity), sendEmail: true },
                {
                  object: getTypenameAndId(testCase.entity),
                  sendEmail: true,
                },
              ],
            },
          },
        })
      })
    })
  })
})
