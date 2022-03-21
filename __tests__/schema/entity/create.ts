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
  taxonomyTermSubject,
  user,
  video,
} from '../../../__fixtures__'
import { given, Client, givenUuid, nextUuid } from '../../__utils__'
import { Model } from '~/internals/graphql'
import { DatabaseLayer } from '~/model'
import { EntityType } from '~/model/decoder'
import { Instance } from '~/types'

class EntityCreateWrapper {
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
  public entityType: EntityType
  public mutationName: string
  public inputName: string
  public fields: Partial<typeof EntityCreateWrapper.ALL_POSSIBLE_FIELDS>
  public fieldsForDBLayer: { [key: string]: string }
  public parent?: Model<'AbstractEntity'>
  public taxonomyTerm?: Model<'TaxonomyTerm'>

  constructor(
    entityType: EntityType,
    entity: Model<EntityType>,
    fieldsAtApi: (keyof typeof EntityCreateWrapper.ALL_POSSIBLE_FIELDS)[]
  ) {
    this.entityType = entityType
    this.entity = entity
    this.mutationName = `create${this.entityType}`
    this.inputName = `Create${this.entityType}Input`
    this.fields = this.setFields(fieldsAtApi)
    this.fieldsForDBLayer = this.setFieldsForDBlayer()
    this.parent = this.setParent()
    this.taxonomyTerm = this.setTaxonomyTerm()
  }

  setParent() {
    if (this.entityType === EntityType.CoursePage) return course

    if (this.entityType === EntityType.GroupedExercise) return exerciseGroup

    if (this.entityType === EntityType.Solution) return exercise

    return undefined
  }

  setTaxonomyTerm() {
    if (
      this.entityType === EntityType.CoursePage ||
      this.entityType === EntityType.GroupedExercise ||
      this.entityType === EntityType.Solution
    )
      return undefined
    return taxonomyTermSubject
  }

  setFields(fields: (keyof typeof EntityCreateWrapper.ALL_POSSIBLE_FIELDS)[]) {
    const filteredFields: { [key: string]: string | boolean } = {}
    for (const key of fields) {
      filteredFields[key] = EntityCreateWrapper.ALL_POSSIBLE_FIELDS[key]
    }
    return filteredFields
  }

  setFieldsForDBlayer() {
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
    delete this.fields.cohesive
    const fieldsWithoutCohesive: Omit<typeof this.fields, 'cohesive'> =
      this.fields

    return fieldsWithoutCohesive
  }
}

const entityCreateTypes = [
  new EntityCreateWrapper(EntityType.Applet, applet, [
    'title',
    'content',
    'metaTitle',
    'metaDescription',
    'url',
  ]),
  new EntityCreateWrapper(EntityType.Article, article, [
    'title',
    'content',
    'metaTitle',
    'metaDescription',
  ]),
  new EntityCreateWrapper(EntityType.Course, course, [
    'title',
    'content',
    'metaDescription',
  ]),
  new EntityCreateWrapper(EntityType.CoursePage, coursePage, [
    'title',
    'content',
  ]),
  new EntityCreateWrapper(EntityType.Event, event, [
    'title',
    'content',
    'metaTitle',
    'metaDescription',
  ]),
  new EntityCreateWrapper(EntityType.Exercise, exercise, ['content']),
  new EntityCreateWrapper(EntityType.ExerciseGroup, exerciseGroup, [
    'cohesive',
    'content',
  ]),
  new EntityCreateWrapper(EntityType.GroupedExercise, groupedExercise, [
    'content',
  ]),
  new EntityCreateWrapper(EntityType.Solution, solution, ['content']),
  new EntityCreateWrapper(EntityType.Video, video, ['title', 'content', 'url']),
]

entityCreateTypes.forEach((entityCreateType) => {
  describe(entityCreateType.mutationName, () => {
    let input: {
      changes: string
      instance: Instance
      licenseId: number
      needsReview: boolean
      subscribeThis: boolean
      subscribeThisByEmail: boolean
      parentId?: number
      taxonomyTermId?: number
      cohesive?: boolean
      content?: string
      description?: string
      metaDescription?: string
      metaTitle?: string
      title?: string
      url?: string
    } = {
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
      givenUuid(user)

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
        givenUuid(entityCreateType.parent)
        payload = { ...payload, input: { ...payload.input, parentId } }
      }

      if (entityCreateType.taxonomyTerm) {
        givenUuid(entityCreateType.taxonomyTerm)
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

      givenUuid(guestUser)

      await new Client({ userId: guestUser.id })
        .prepareQuery({
          query: gql`
            mutation set($input: ${entityCreateType.inputName}!) {
              entity {
                ${entityCreateType.mutationName}(input: $input) {
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
          .returnsNull()

        await mutation.shouldFailWithError('BAD_USER_INPUT')
      })
    }

    if (entityCreateType.taxonomyTerm) {
      test('fails when taxonomy term does not exists', async () => {
        given('UuidQuery')
          .withPayload({ id: entityCreateType.taxonomyTerm!.id })
          .returnsNull()

        await mutation.shouldFailWithError('BAD_USER_INPUT')
      })
    }
  })
})
