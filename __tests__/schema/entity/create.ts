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
import { AbstractEntityCreatePayload } from '~/schema/uuid/abstract-entity/resolvers'
import { Instance } from '~/types'

class EntityCreateWrapper {
  public mutationName: string
  public inputName: string
  public fields: Partial<EntityFields>

  constructor(
    public entityType: EntityType,
    public entity: Model<EntityType>,
    private fieldsAtApi: (keyof EntityFields)[]
  ) {
    this.entityType = entityType
    this.entity = entity
    this.mutationName = `create${this.entityType}`
    this.inputName = `Create${this.entityType}Input`
    this.fields = R.pick(fieldsAtApi, ALL_POSSIBLE_FIELDS)
  }

  get parent(): Model<'AbstractEntity'> | undefined {
    switch (this.entityType) {
      case EntityType.CoursePage:
        return course
      case EntityType.GroupedExercise:
        return exerciseGroup
      case EntityType.Solution:
        return exercise
      default:
        return undefined
    }
  }

  get taxonomyTerm(): Model<'TaxonomyTerm'> | undefined {
    switch (this.entityType) {
      case EntityType.CoursePage:
      case EntityType.GroupedExercise:
      case EntityType.Solution:
        return undefined
      default:
        return taxonomyTermSubject
    }
  }

  get fieldsForDBLayer() {
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

const entityCreateTypes = [
  new EntityCreateWrapper(EntityType.Applet, applet, appletFields),
  new EntityCreateWrapper(EntityType.Article, article, articleFields),
  new EntityCreateWrapper(EntityType.Course, course, courseFields),
  new EntityCreateWrapper(EntityType.CoursePage, coursePage, coursePageFields),
  new EntityCreateWrapper(EntityType.Event, event, eventFields),
  new EntityCreateWrapper(EntityType.Exercise, exercise, genericFields),
  new EntityCreateWrapper(
    EntityType.ExerciseGroup,
    exerciseGroup,
    exerciseGroupFields
  ),
  new EntityCreateWrapper(
    EntityType.GroupedExercise,
    groupedExercise,
    genericFields
  ),
  new EntityCreateWrapper(EntityType.Solution, solution, genericFields),
  new EntityCreateWrapper(EntityType.Video, video, videoFields),
]

type InputFromApi = Omit<AbstractEntityCreatePayload['input'], 'cohesive'> & {
  cohesive?: boolean
}

entityCreateTypes.forEach((entityCreateType) => {
  describe(entityCreateType.mutationName, () => {
    let input: InputFromApi = {
      changes: 'changes',
      instance: Instance.De,
      needsReview: true,
      licenseId: 1,
      subscribeThis: false,
      subscribeThisByEmail: false,
      ...entityCreateType.fields,
    }

    if (entityCreateType.parent) {
      input = { ...input, parentId: entityCreateType.parent.id }
    }

    if (entityCreateType.taxonomyTerm) {
      input = { ...input, taxonomyTermId: entityCreateType.taxonomyTerm.id }
    }

    const mutation = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          mutation set($input: ${entityCreateType.inputName}!) {
            entity {
              ${entityCreateType.mutationName}(input: $input) {
                success
                record {
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables({ input })

    beforeEach(() => {
      given('UuidQuery').for(user)

      const {
        changes,
        instance,
        licenseId,
        parentId,
        taxonomyTermId,
        needsReview,
        subscribeThis,
        subscribeThisByEmail,
      } = input

      let payload: DatabaseLayer.Payload<'EntityCreateMutation'> = {
        input: {
          changes,
          instance,
          needsReview,
          licenseId,
          subscribeThis,
          subscribeThisByEmail,
          fields: entityCreateType.fieldsForDBLayer,
        },
        userId: user.id,
        entityType: entityCreateType.entityType,
      }

      if (entityCreateType.parent) {
        given('UuidQuery').for(entityCreateType.parent)
        payload = { ...payload, input: { ...payload.input, parentId } }
      }

      if (entityCreateType.taxonomyTerm) {
        given('UuidQuery').for(entityCreateType.taxonomyTerm)
        payload = { ...payload, input: { ...payload.input, taxonomyTermId } }
      }

      given('EntityCreateMutation')
        .withPayload(payload)
        .returns(entityCreateType.entity)
    })

    test('returns { success, record } when mutation could be successfully executed', async () => {
      await mutation.shouldReturnData({
        entity: {
          [entityCreateType.mutationName]: {
            success: true,
            record: { id: entityCreateType.entity.id },
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

      given('UuidQuery').for(guestUser)

      await mutation
        .forClient(new Client({ userId: guestUser.id }))
        .withVariables({ input })
        .shouldFailWithError('FORBIDDEN')
    })

    test('fails when a field is empty', async () => {
      await mutation
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

      await mutation.shouldFailWithError('BAD_USER_INPUT')
    })

    test('fails when database layer has an internal error', async () => {
      given('EntityCreateMutation').hasInternalServerError()

      await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
    })

    if (entityCreateType.parent) {
      test('fails when parent does not exists', async () => {
        given('UuidQuery')
          .withPayload({ id: entityCreateType.parent!.id })
          .returnsNotFound()

        await mutation.shouldFailWithError('BAD_USER_INPUT')
      })
    }

    if (entityCreateType.taxonomyTerm) {
      test('fails when taxonomy term does not exists', async () => {
        given('UuidQuery')
          .withPayload({ id: entityCreateType.taxonomyTerm!.id })
          .returnsNotFound()

        await mutation.shouldFailWithError('BAD_USER_INPUT')
      })
    }
  })
})
