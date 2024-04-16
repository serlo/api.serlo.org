import gql from 'graphql-tag'
import { HttpResponse } from 'msw'
import * as R from 'ramda'

import {
  applet,
  article,
  course,
  coursePage,
  event,
  exercise,
  exerciseGroup,
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
  videoRevision,
  licenseId,
} from '../../../__fixtures__'
import { given, Client, nextUuid, getTypenameAndId } from '../../__utils__'
import { autoreviewTaxonomyIds } from '~/config'
import { Model } from '~/internals/graphql'
import { DatabaseLayer } from '~/model'
import { DiscriminatorType, EntityType } from '~/model/decoder'
import { SetAbstractEntityInput } from '~/schema/uuid/abstract-entity/entity-set-handler'
import { fromEntityTypeToEntityRevisionType } from '~/schema/uuid/abstract-entity/utils'
import { Instance } from '~/types'

interface EntityFields {
  title: string
  content: string
  description: string
  metaTitle: string
  metaDescription: string
  url: string
}

const ALL_POSSIBLE_FIELDS: EntityFields = {
  title: 'title',
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
  [EntityType.ExerciseGroup]: ['content'],
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
  { ...video, taxonomyTermIds: [taxonomyTermSubject.id] },
]

class EntitySetTestCase {
  public fields: Partial<EntityFields>

  constructor(public entity: Model<'AbstractEntity'>) {
    this.fields = R.pick(fieldKeys[this.entityType], ALL_POSSIBLE_FIELDS)
  }

  get entityType() {
    return this.entity.__typename
  }

  get parent(): Model<'AbstractEntity' | 'TaxonomyTerm'> {
    switch (this.entityType) {
      case EntityType.CoursePage:
        return course
      default:
        return taxonomyTermSubject
    }
  }

  get fieldsToDBLayer() {
    if (this.entityType === EntityType.ExerciseGroup) {
      return {
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
  describe('setAbstractEntity', () => {
    const input: SetAbstractEntityInput = {
      entityType: testCase.entityType,
      changes: 'changes',
      needsReview: true,
      subscribeThis: false,
      subscribeThisByEmail: false,
      ...testCase.fields,
    }

    const mutationWithParentId = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          mutation set($input: SetAbstractEntityInput!) {
            entity {
              setAbstractEntity(input: $input) {
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
          mutation set($input: SetAbstractEntityInput!) {
            entity {
              setAbstractEntity(input: $input) {
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
        licenseId,
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
          setAbstractEntity: {
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
          setAbstractEntity: {
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

    describe(`Cache after setAbstractEntity call`, () => {
      const newRevision = { ...testCase.revision, id: 123 }
      const anotherEntity = { ...testCase.entity, id: 456 }

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
          .isDefinedBy(() => {
            given('UuidQuery').for(
              { ...testCase.entity, currentRevisionId: newRevision.id },
              newRevision,
            )

            return HttpResponse.json({
              success: true,
              revisionId: newRevision.id,
            })
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

test('uses default license of the instance', async () => {
  const exerciseEn = { ...exercise, instance: Instance.En }

  given('UuidQuery').for(exerciseEn, taxonomyTermSubject, taxonomyTermRoot)
  given('EntityCreateMutation')
    .withPayload({
      userId: 1,
      entityType: EntityType.Exercise,
      input: {
        changes: 'changes',
        licenseId: 9,
        needsReview: true,
        subscribeThis: true,
        subscribeThisByEmail: true,
        fields: { content: 'Hello World' },
        parentId: exerciseEn.id,
      },
    })
    .returns(exercise)

  await new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation ($input: SetAbstractEntityInput!) {
          entity {
            setAbstractEntity(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withInput({
      entityType: EntityType.Exercise,
      changes: 'changes',
      subscribeThis: true,
      subscribeThisByEmail: true,
      needsReview: true,
      parentId: exerciseEn.id,
      content: 'Hello World',
    })
    .shouldReturnData({ entity: { setAbstractEntity: { success: true } } })
})

describe('Autoreview entities', () => {
  const input = {
    entityType: EntityType.Exercise,
    changes: 'changes',
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    content: 'content',
  }

  const mutation = new Client({ userId: user.id }).prepareQuery({
    query: gql`
      mutation ($input: SetAbstractEntityInput!) {
        entity {
          setAbstractEntity(input: $input) {
            record {
              ... on Exercise {
                currentRevision {
                  id
                }
              }
            }
          }
        }
      }
    `,
  })

  const oldRevisionId = exercise.currentRevisionId
  const newRevisionId = 789

  const taxonomy = { ...taxonomyTermSubject, id: 106082 }
  const entity: typeof exercise = {
    ...exercise,
    currentRevisionId: oldRevisionId,
    taxonomyTermIds: [taxonomy.id],
  }

  const newRevision = { ...exerciseRevision, id: newRevisionId }

  beforeEach(() => {
    given('UuidQuery').for(entity, exerciseRevision, article, taxonomy)

    given('EntityAddRevisionMutation').isDefinedBy(async ({ request }) => {
      const body = await request.json()

      given('UuidQuery').for(newRevision)

      if (!body.payload.input.needsReview)
        given('UuidQuery').for({ ...entity, currentRevisionId: newRevisionId })

      return HttpResponse.json({ success: true, revisionId: newRevisionId })
    })

    given('EntityCreateMutation').isDefinedBy(async ({ request }) => {
      const body = await request.json()

      given('UuidQuery').for(newRevision)

      return HttpResponse.json({
        ...entity,
        currentRevisionId: body.payload.input.needsReview
          ? oldRevisionId
          : newRevisionId,
      })
    })
  })

  describe('checks out revision without need of review, even if needsReview initially true', () => {
    test('when a new revision is added', async () => {
      await mutation
        .withInput({ ...input, entityId: entity.id })
        .shouldReturnData({
          entity: {
            setAbstractEntity: {
              record: { currentRevision: { id: newRevisionId } },
            },
          },
        })
    })

    test('when a new entity is created', async () => {
      await mutation
        .withInput({ ...input, parentId: taxonomy.id })
        .shouldReturnData({
          entity: {
            setAbstractEntity: {
              record: { currentRevision: { id: newRevisionId } },
            },
          },
        })
    })
  })

  test('autoreview is ignored when entity is also in non-autoreview taxonomy term', async () => {
    const taxonomyTermIds = [autoreviewTaxonomyIds[0], taxonomyTermRoot.id]

    given('UuidQuery').for(
      { ...exercise, taxonomyTermIds },
      { ...taxonomyTermSubject, id: autoreviewTaxonomyIds[0] },
      taxonomyTermRoot,
    )

    await mutation
      .withInput({ ...input, entityId: entity.id })
      .shouldReturnData({
        entity: {
          setAbstractEntity: {
            record: { currentRevision: { id: oldRevisionId } },
          },
        },
      })
  })
})
