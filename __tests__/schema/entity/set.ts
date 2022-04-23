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
  solution,
  taxonomyTermSubject,
  taxonomyTermRoot,
  user,
  video,
} from '../../../__fixtures__'
import {
  given,
  Client,
  nextUuid,
  ALL_POSSIBLE_FIELDS,
  appletFields,
  articleFields,
  courseFields,
  coursePageFields,
  EntityFields,
  eventFields,
  exerciseGroupFields,
  genericFields,
  videoFields,
} from '../../__utils__'
import { Model } from '~/internals/graphql'
import { DatabaseLayer } from '~/model'
import { EntityType } from '~/model/decoder'
import {
  AbstractEntitySetInput,
  fromEntityTypeToEntityRevisionType,
} from '~/schema/uuid/abstract-entity/utils'

class EntitySetWrapper {
  public mutationName: string
  public fields: Partial<EntityFields>

  constructor(
    public entityType: EntityType,
    private fieldsFromApi: (keyof EntityFields)[]
  ) {
    this.entityType = entityType
    this.mutationName = `set${this.entityType}`
    this.fields = R.pick(fieldsFromApi, ALL_POSSIBLE_FIELDS)
  }

  get entity() {
    switch (this.entityType) {
      case EntityType.Applet:
        return applet
      case EntityType.Article:
        return article
      case EntityType.Course:
        return course
      case EntityType.CoursePage:
        return coursePage
      case EntityType.Event:
        return event
      case EntityType.Exercise:
        return exercise
      case EntityType.ExerciseGroup:
        return exerciseGroup
      case EntityType.GroupedExercise:
        return groupedExercise
      case EntityType.Solution:
        return solution
      case EntityType.Video:
        return video
    }
  }

  get inputName() {
    if (
      [
        EntityType.Exercise,
        EntityType.GroupedExercise,
        EntityType.Solution,
      ].includes(this.entityType)
    ) {
      return 'SetGenericEntityInput'
    }
    return `Set${this.entityType}Input`
  }

  get parent(): Model<'AbstractEntity' | 'TaxonomyTerm'> {
    switch (this.entityType) {
      case EntityType.CoursePage:
        return course
      case EntityType.GroupedExercise:
        return exerciseGroup
      case EntityType.Solution:
        return exercise
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
    }
    const fieldsWithoutCohesive: Omit<typeof this.fields, 'cohesive'> =
      this.fields

    return fieldsWithoutCohesive
  }
}

const entitySetTypes = [
  new EntitySetWrapper(EntityType.Applet, appletFields),
  new EntitySetWrapper(EntityType.Article, articleFields),
  new EntitySetWrapper(EntityType.Course, courseFields),
  new EntitySetWrapper(EntityType.CoursePage, coursePageFields),
  new EntitySetWrapper(EntityType.Event, eventFields),
  new EntitySetWrapper(EntityType.Exercise, genericFields),
  new EntitySetWrapper(EntityType.ExerciseGroup, exerciseGroupFields),
  new EntitySetWrapper(EntityType.GroupedExercise, genericFields),
  new EntitySetWrapper(EntityType.Solution, genericFields),
  new EntitySetWrapper(EntityType.Video, videoFields),
]

type InputFromApi = Omit<AbstractEntitySetInput, 'cohesive'> & {
  cohesive?: boolean
}

entitySetTypes.forEach((entitySetType) => {
  describe(entitySetType.mutationName, () => {
    const input: InputFromApi = {
      changes: 'changes',
      needsReview: true,
      subscribeThis: false,
      subscribeThisByEmail: false,
      ...entitySetType.fields,
    }

    const inputWithEntityId = { ...input, entityId: entitySetType.entity.id }

    const mutationWithEntityId = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          mutation set($input: ${entitySetType.inputName}!) {
            entity {
              ${entitySetType.mutationName}(input: $input) {
                success
                record {
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables({ input: inputWithEntityId })

    const mutationWithParentId = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          mutation set($input: ${entitySetType.inputName}!) {
            entity {
              ${entitySetType.mutationName}(input: $input) {
                success
                record {
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables({ input: { ...input, parentId: entitySetType.parent.id } })

    beforeEach(() => {
      given('UuidQuery').for(
        entitySetType.parent,
        taxonomyTermSubject,
        taxonomyTermRoot,
        user
      )
    })

    test('creates an entity when parentId is provided', async () => {
      const { changes, needsReview, subscribeThis, subscribeThisByEmail } =
        input

      let payload: DatabaseLayer.Payload<'EntityCreateMutation'> = {
        input: {
          changes,
          instance: entitySetType.parent.instance,
          needsReview,
          licenseId: 1,
          subscribeThis,
          subscribeThisByEmail,
          fields: entitySetType.fieldsToDBLayer,
        },
        userId: user.id,
        entityType: entitySetType.entityType,
      }

      if (entitySetType.parent.__typename == 'TaxonomyTerm') {
        payload = {
          ...payload,
          input: { ...payload.input, taxonomyTermId: entitySetType.parent.id },
        }
      } else {
        payload = {
          ...payload,
          input: { ...payload.input, parentId: entitySetType.parent.id },
        }
      }

      given('EntityCreateMutation')
        .withPayload(payload)
        .returns(entitySetType.entity)

      await mutationWithParentId.shouldReturnData({
        entity: {
          [entitySetType.mutationName]: {
            success: true,
            record: { id: entitySetType.entity.id },
          },
        },
      })
    })

    test('adds new entity revision when entityId is provided', async () => {
      given('UuidQuery').for(entitySetType.entity)

      const {
        changes,
        needsReview,
        subscribeThis,
        subscribeThisByEmail,
        entityId,
      } = inputWithEntityId

      const payload: DatabaseLayer.Payload<'EntityAddRevisionMutation'> = {
        input: {
          changes,
          entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields: entitySetType.fieldsToDBLayer,
        },
        userId: user.id,
        revisionType: fromEntityTypeToEntityRevisionType(
          entitySetType.entityType
        ),
      }

      given('EntityAddRevisionMutation')
        .withPayload(payload)
        .returns({ success: true, revisionId: 123 })

      await mutationWithEntityId.shouldReturnData({
        entity: {
          [entitySetType.mutationName]: {
            success: true,
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
      given('UuidQuery').for(entitySetType.entity)

      const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

      given('UuidQuery').for(guestUser)

      await mutationWithEntityId
        .forClient(new Client({ userId: guestUser.id }))
        .shouldFailWithError('FORBIDDEN')
    })

    test('fails when a field is empty', async () => {
      await mutationWithEntityId
        .withVariables({
          input: {
            ...input,
            changes: '',
          },
        })
        .shouldFailWithError('BAD_USER_INPUT')

      await mutationWithParentId
        .withVariables({
          input: {
            ...input,
            changes: '',
          },
        })
        .shouldFailWithError('BAD_USER_INPUT')
    })

    test('fails when database layer returns a 400er response', async () => {
      given('EntityCreateMutation').returnsBadRequest()
      given('EntityAddRevisionMutation').returnsBadRequest()

      await mutationWithParentId.shouldFailWithError('BAD_USER_INPUT')

      given('UuidQuery').for(entitySetType.entity)
      await mutationWithEntityId.shouldFailWithError('BAD_USER_INPUT')
    })

    test('fails when database layer has an internal error', async () => {
      given('EntityCreateMutation').hasInternalServerError()
      given('EntityAddRevisionMutation').hasInternalServerError()

      await mutationWithParentId.shouldFailWithError('INTERNAL_SERVER_ERROR')

      given('UuidQuery').for(entitySetType.entity)
      await mutationWithEntityId.shouldFailWithError('INTERNAL_SERVER_ERROR')
    })

    test('fails when parent does not exists', async () => {
      given('UuidQuery')
        .withPayload({ id: entitySetType.parent.id })
        .returnsNotFound()

      await mutationWithParentId.shouldFailWithError('BAD_USER_INPUT')
    })
  })
})
