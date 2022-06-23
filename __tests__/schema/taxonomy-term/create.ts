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
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
  taxonomyTermTopic,
  user as baseUser,
} from '../../../__fixtures__'
import { Client, given } from '../../__utils__'
import { TaxonomyTypeCreateOptions } from '~/types'

describe('TaxonomyTermCreateMutation', () => {
  const user = { ...baseUser, roles: ['de_architect'] }

  describe('create Topic', () => {
    const input = {
      parentId: taxonomyTermSubject.id,
      name: 'a name ',
      description: 'a description',
      taxonomyType: TaxonomyTypeCreateOptions.Topic,
    }

    const mutation = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          mutation set($input: TaxonomyTermCreateInput!) {
            taxonomyTerm {
              create(input: $input) {
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

    const payload = {
      ...input,
      taxonomyType: 'topic' as const,
      userId: user.id,
    }

    beforeEach(() => {
      given('UuidQuery').for(user, taxonomyTermSubject)

      given('TaxonomyTermCreateMutation')
        .withPayload(payload)
        .returns(taxonomyTermTopic)
    })

    test('returns { success, record } when mutation could be successfully executed', async () => {
      await mutation.shouldReturnData({
        taxonomyTerm: {
          create: {
            success: true,
            record: { id: taxonomyTermTopic.id },
          },
        },
      })
    })

    test('updates the cache', async () => {
      given('UuidQuery').for(taxonomyTermCurriculumTopic)

      given('TaxonomyTermCreateMutation')
        .withPayload(payload)
        .isDefinedBy((_req, res, ctx) => {
          given('UuidQuery').for(taxonomyTermTopic)

          const updatedParent = {
            ...taxonomyTermSubject,
            childrenIds: [
              ...taxonomyTermSubject.childrenIds,
              taxonomyTermTopic.id,
            ],
          }
          given('UuidQuery').for(updatedParent)
          return res(ctx.json(taxonomyTermTopic))
        })

      const query = new Client({ userId: user.id }).prepareQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on TaxonomyTerm {
                name
                children {
                  nodes {
                    ... on TaxonomyTerm {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { id: taxonomyTermSubject.id },
      })

      await query.shouldReturnData({
        uuid: {
          name: taxonomyTermSubject.name,
          children: {
            nodes: [
              {
                id: taxonomyTermSubject.childrenIds[0],
                name: taxonomyTermCurriculumTopic.name,
              },
            ],
          },
        },
      })

      await mutation.execute()

      await query.shouldReturnData({
        uuid: {
          name: taxonomyTermSubject.name,
          children: {
            nodes: [
              {
                id: taxonomyTermSubject.childrenIds[0],
                name: taxonomyTermCurriculumTopic.name,
              },
              {
                id: taxonomyTermTopic.id,
                name: taxonomyTermTopic.name,
              },
            ],
          },
        },
      })
    })

    test('fails when parent does not accept topic', async () => {
      given('UuidQuery').for(taxonomyTermRoot)

      await mutation
        .withVariables({ ...input, parentId: taxonomyTermRoot.id })
        .shouldFailWithError('BAD_USER_INPUT')
    })

    test('fails when user is not authenticated', async () => {
      await mutation
        .forUnauthenticatedUser()
        .shouldFailWithError('UNAUTHENTICATED')
    })

    test('fails when user does not have role "architect"', async () => {
      await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
    })

    test('fails when database layer returns a 400er response', async () => {
      given('TaxonomyTermCreateMutation').returnsBadRequest()

      await mutation.shouldFailWithError('BAD_USER_INPUT')
    })

    test('fails when database layer has an internal error', async () => {
      given('TaxonomyTermCreateMutation').hasInternalServerError()

      await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
    })
  })

  describe('create ExerciseFolder', () => {
    const input = {
      parentId: taxonomyTermSubject.id,
      name: 'a name ',
      description: 'a description',
      taxonomyType: TaxonomyTypeCreateOptions.Topic,
    }

    const mutation = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          mutation set($input: TaxonomyTermCreateInput!) {
            taxonomyTerm {
              create(input: $input) {
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

    const payload = {
      ...input,
      taxonomyType: 'topic' as const,
      userId: user.id,
    }

    beforeEach(() => {
      given('UuidQuery').for(user, taxonomyTermSubject)

      given('TaxonomyTermCreateMutation')
        .withPayload(payload)
        .returns(taxonomyTermTopic)
    })

    test('returns { success, record } when mutation could be successfully executed', async () => {
      await mutation.shouldReturnData({
        taxonomyTerm: {
          create: {
            success: true,
            record: { id: taxonomyTermTopic.id },
          },
        },
      })
    })

    test('fails when parent does not accept exerciseFolder', async () => {
      await mutation
        .withVariables({ ...input, parentId: taxonomyTermSubject.id })
        .shouldFailWithError('BAD_USER_INPUT')
    })
  })
})
