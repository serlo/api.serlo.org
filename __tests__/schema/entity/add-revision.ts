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
import { gql } from 'apollo-server'

import {
  applet,
  article,
  course,
  coursePage,
  event,
  exercise,
  exerciseGroup,
  groupedExercise,
  solution,
  solutionRevision,
  user,
  video,
} from '../../../__fixtures__'
import {
  given,
  givenUuids,
  Client,
  getTypenameAndId,
  givenUuid,
  nextUuid,
  Database,
  returnsUuidsFromDatabase,
} from '../../__utils__'
import { Model } from '~/internals/graphql'
import { EntityType, EntityRevisionType } from '~/model/decoder'

class EntityAddRevisionWrapper {
  static ALL_POSSIBLE_FIELDS: {
    title: string
    cohesive: boolean
    content: string
    description: string
    metaTitle: string
    metaDescription: string
    url: string
  } = {
    title: 'title',
    cohesive: false,
    content: 'content',
    description: 'description',
    metaTitle: 'metaTitle',
    metaDescription: 'metaDescription',
    url: 'https://url.org',
  }
  public entity: Model<EntityType>
  public revisionType: EntityRevisionType
  public mutationName: string
  public inputName: string
  public fields: Partial<typeof EntityAddRevisionWrapper.ALL_POSSIBLE_FIELDS>
  public fieldsForDBLayer: { [key: string]: string }

  constructor(
    revisionType: EntityRevisionType,
    entity: Model<EntityType>,
    fieldsAtApi: (keyof typeof EntityAddRevisionWrapper.ALL_POSSIBLE_FIELDS)[]
  ) {
    this.revisionType = revisionType
    this.entity = entity
    this.mutationName = `add${this.revisionType}`
    this.inputName = this.setInputName()
    this.fields = this.setFields(fieldsAtApi)
    this.fieldsForDBLayer = this.setFieldsForDBlayer()
  }

  setInputName() {
    if (
      [
        EntityRevisionType.ExerciseRevision,
        EntityRevisionType.GroupedExerciseRevision,
        EntityRevisionType.SolutionRevision,
      ].includes(this.revisionType)
    ) {
      return 'AddGenericRevisionInput'
    }
    return `Add${this.revisionType}Input`
  }

  setFields(
    fields: (keyof typeof EntityAddRevisionWrapper.ALL_POSSIBLE_FIELDS)[]
  ) {
    const filteredFields: { [key: string]: string | boolean } = {}
    for (const key of fields) {
      filteredFields[key] = EntityAddRevisionWrapper.ALL_POSSIBLE_FIELDS[key]
    }
    return filteredFields
  }

  setFieldsForDBlayer() {
    if (this.revisionType === EntityRevisionType.ExerciseGroupRevision) {
      return {
        cohesive: this.fields.cohesive!.toString(),
        content: this.fields.content!,
      }
    } else if (this.revisionType === EntityRevisionType.CourseRevision) {
      return {
        description: this.fields.content!,
        title: this.fields.title!,
        metaDescription: this.fields.metaDescription!,
      }
    } else if (this.revisionType === EntityRevisionType.VideoRevision) {
      return {
        content: this.fields.url!,
        description: this.fields.content!,
        title: this.fields.title!,
      }
    }
    delete this.fields.cohesive
    const fieldsWithoutCohesive: Omit<typeof this.fields, 'cohesive'> =
      this.fields

    return fieldsWithoutCohesive
  }
}

const entityAddRevisionTypes = [
  new EntityAddRevisionWrapper(EntityRevisionType.AppletRevision, applet, [
    'title',
    'content',
    'metaTitle',
    'metaDescription',
    'url',
  ]),
  new EntityAddRevisionWrapper(EntityRevisionType.ArticleRevision, article, [
    'title',
    'content',
    'metaTitle',
    'metaDescription',
  ]),
  new EntityAddRevisionWrapper(EntityRevisionType.CourseRevision, course, [
    'title',
    'content',
    'metaDescription',
  ]),
  new EntityAddRevisionWrapper(
    EntityRevisionType.CoursePageRevision,
    coursePage,
    ['title', 'content']
  ),
  new EntityAddRevisionWrapper(EntityRevisionType.EventRevision, event, [
    'title',
    'content',
    'metaTitle',
    'metaDescription',
  ]),
  new EntityAddRevisionWrapper(EntityRevisionType.ExerciseRevision, exercise, [
    'content',
  ]),
  new EntityAddRevisionWrapper(
    EntityRevisionType.ExerciseGroupRevision,
    exerciseGroup,
    ['cohesive', 'content']
  ),
  new EntityAddRevisionWrapper(
    EntityRevisionType.GroupedExerciseRevision,
    groupedExercise,
    ['content']
  ),
  new EntityAddRevisionWrapper(EntityRevisionType.SolutionRevision, solution, [
    'content',
  ]),
  new EntityAddRevisionWrapper(EntityRevisionType.VideoRevision, video, [
    'title',
    'content',
    'url',
  ]),
]

entityAddRevisionTypes.forEach((entityAddRevisionType) => {
  describe(entityAddRevisionType.mutationName, () => {
    const input = {
      changes: 'changes',
      entityId: entityAddRevisionType.entity.id,
      needsReview: true,
      subscribeThis: false,
      subscribeThisByEmail: false,
      ...entityAddRevisionType.fields,
    }

    const mutation = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          mutation set($input: ${entityAddRevisionType.inputName}!) {
            entity {
              ${entityAddRevisionType.mutationName}(input: $input) {
                success
                revisionId
              }
            }
          }
        `,
      })
      .withVariables({ input })

    beforeEach(() => {
      givenUuids(user, entityAddRevisionType.entity)
    })

    test('returns "{ success: true }" when mutation could be successfully executed', async () => {
      const {
        changes,
        entityId,
        needsReview,
        subscribeThis,
        subscribeThisByEmail,
      } = input

      given('EntityAddRevisionMutation')
        .withPayload({
          input: {
            changes,
            entityId,
            needsReview,
            subscribeThis,
            subscribeThisByEmail,
            fields: entityAddRevisionType.fieldsForDBLayer,
          },
          userId: user.id,
          revisionType: entityAddRevisionType.revisionType,
        })
        .returns({ success: true, revisionId: 123 })

      await mutation.shouldReturnData({
        entity: {
          [entityAddRevisionType.mutationName]: {
            success: true,
            revisionId: 123,
          },
        },
      })
    })

    test('fails when user is not authenticated', async () => {
      await mutation
        .forUnauthenticatedUser()
        .shouldFailWithError('UNAUTHENTICATED')
    })

    test('fails when user does not have role "login"', async () => {
      const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

      givenUuid(guestUser)

      await new Client({ userId: guestUser.id })
        .prepareQuery({
          query: gql`
            mutation set($input: ${entityAddRevisionType.inputName}!) {
              entity {
                ${entityAddRevisionType.mutationName}(input: $input) {
                  success
                }
              }
            }
          `,
        })
        .withVariables({ input })
        .shouldFailWithError('FORBIDDEN')
    })

    test('fails when a field is empty', async () => {
      await mutation
        .withVariables({
          input: {
            ...input,
            content: '',
          },
        })
        .shouldFailWithError('BAD_USER_INPUT')
    })

    test('fails when database layer returns a 400er response', async () => {
      given('EntityAddRevisionMutation').returnsBadRequest()

      await mutation.shouldFailWithError('BAD_USER_INPUT')
    })

    test('fails when database layer has an internal error', async () => {
      given('EntityAddRevisionMutation').hasInternalServerError()

      await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
    })
  })
})

describe('Cache after EntityAddRevisionMutation call', () => {
  const fields = {
    content: 'content',
  }

  const input = {
    changes: 'changes',
    entityId: solution.id,
    needsReview: false,
    subscribeThis: true,
    subscribeThisByEmail: true,
    ...fields,
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: AddGenericRevisionInput!) {
          entity {
            addSolutionRevision(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  let newSolutionRevision: Model<'SolutionRevision'>

  beforeEach(() => {
    const database = new Database()
    database.hasUuids([user, solution, solutionRevision, article])
    given('UuidQuery').isDefinedBy(returnsUuidsFromDatabase(database))

    const {
      changes,
      entityId,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
    } = input
    given('EntityAddRevisionMutation')
      .withPayload({
        input: {
          changes,
          entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields,
        },
        userId: user.id,
        revisionType: EntityRevisionType.SolutionRevision,
      })
      .isDefinedBy((req, res, ctx) => {
        const { input } = req.body.payload

        newSolutionRevision = {
          ...solutionRevision,
          id: nextUuid(solutionRevision.id),
        }
        database.hasUuid(newSolutionRevision)

        if (!input.needsReview) {
          database.changeUuid(solution.id, {
            currentRevisionId: newSolutionRevision.id,
          })
        }
        return res(
          ctx.json({ success: true, revisionId: newSolutionRevision.id })
        )
      })
  })

  test('updates the checked out revision when needsReview=false', async () => {
    const uuidQuery = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on Solution {
                currentRevision {
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: solution.id })

    await uuidQuery.shouldReturnData({
      uuid: { currentRevision: { id: solution.currentRevisionId } },
    })

    await mutation.withVariables({ ...input, needsReview: true }).execute()

    await uuidQuery.shouldReturnData({
      uuid: { currentRevision: { id: solution.currentRevisionId } },
    })

    await mutation.execute()

    await uuidQuery.shouldReturnData({
      uuid: { currentRevision: { id: newSolutionRevision.id } },
    })
  })

  test('updates the subscriptions', async () => {
    given('SubscriptionsQuery')
      .withPayload({ userId: user.id })
      .returns({
        subscriptions: [{ objectId: article.id, sendEmail: true }],
      })

    const subscritionsQuery = new Client({ userId: user.id }).prepareQuery({
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
          nodes: [{ object: getTypenameAndId(article), sendEmail: true }],
        },
      },
    })

    await mutation.execute()

    await subscritionsQuery.shouldReturnData({
      subscription: {
        getSubscriptions: {
          nodes: [
            { object: getTypenameAndId(article), sendEmail: true },
            { object: getTypenameAndId(solution), sendEmail: true },
          ],
        },
      },
    })
  })
})
