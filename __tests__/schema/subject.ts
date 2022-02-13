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

import { article, taxonomyTermSubject } from '../../__fixtures__'
import {
  Client,
  given,
  givenUuid,
  getTypenameAndId,
  nextUuid,
} from '../__utils__'
import { encodeId, encodeToBase64 } from '~/internals/graphql'
import { Instance } from '~/types'

describe('SubjectsQuery', () => {
  test('endpoint "subjects" returns list of all subjects for an instance', async () => {
    givenUuid(taxonomyTermSubject)

    given('SubjectsQuery')
      .withPayload({})
      .returns({
        subjects: [
          {
            instance: taxonomyTermSubject.instance,
            taxonomyTermId: taxonomyTermSubject.id,
          },
          {
            instance: Instance.En,
            taxonomyTermId: nextUuid(taxonomyTermSubject.id),
          },
        ],
      })

    await new Client()
      .prepareQuery({
        query: gql`
          query ($instance: Instance!) {
            subject {
              subjects(instance: $instance) {
                taxonomyTerm {
                  name
                }
              }
            }
          }
        `,
        variables: { instance: taxonomyTermSubject.instance },
      })
      .shouldReturnData({
        subject: {
          subjects: [{ taxonomyTerm: { name: taxonomyTermSubject.name } }],
        },
      })
  })

  describe('endpoint "subject"', () => {
    test('returns one subject', async () => {
      givenUuid(taxonomyTermSubject)

      given('SubjectsQuery')
        .withPayload({})
        .returns({
          subjects: [
            {
              instance: taxonomyTermSubject.instance,
              taxonomyTermId: taxonomyTermSubject.id,
            },
          ],
        })

      await new Client()
        .prepareQuery({
          query: gql`
            query ($id: String!) {
              subject {
                subject(id: $id) {
                  taxonomyTerm {
                    name
                  }
                }
              }
            }
          `,
          variables: {
            id: encodeId({ prefix: 's', id: taxonomyTermSubject.id }),
          },
        })
        .shouldReturnData({
          subject: {
            subject: { taxonomyTerm: { name: taxonomyTermSubject.name } },
          },
        })
    })

    test('returns null when id does not resolve to an subject', async () => {
      given('SubjectsQuery')
        .withPayload({})
        .returns({
          subjects: [
            {
              instance: taxonomyTermSubject.instance,
              taxonomyTermId: taxonomyTermSubject.id,
            },
          ],
        })

      await new Client()
        .prepareQuery({
          query: gql`
            query ($id: String!) {
              subject {
                subject(id: $id) {
                  taxonomyTerm {
                    name
                  }
                }
              }
            }
          `,
          variables: {
            id: encodeId({ prefix: 's', id: nextUuid(taxonomyTermSubject.id) }),
          },
        })
        .shouldReturnData({ subject: { subject: null } })
    })

    describe('fails when id is invalid', () => {
      test.each([
        '1',
        encodeToBase64('sXYZ'),
        encodeId({ prefix: 'd', id: taxonomyTermSubject.id }),
      ])('id: %s', async (id) => {
        await new Client()
          .prepareQuery({
            query: gql`
              query ($id: String!) {
                subject {
                  subject(id: $id) {
                    taxonomyTerm {
                      name
                    }
                  }
                }
              }
            `,
            variables: { id },
          })
          .shouldFailWithError('BAD_USER_INPUT')
      })
    })
  })
})

describe('Subjects', () => {
  test('property "id" returns encoded id of subject', async () => {
    givenUuid(taxonomyTermSubject)

    given('SubjectsQuery')
      .withPayload({})
      .returns({
        subjects: [
          {
            instance: taxonomyTermSubject.instance,
            taxonomyTermId: taxonomyTermSubject.id,
          },
        ],
      })

    await new Client()
      .prepareQuery({
        query: gql`
          query ($id: String!) {
            subject {
              subject(id: $id) {
                id
              }
            }
          }
        `,
        variables: {
          id: encodeId({ prefix: 's', id: taxonomyTermSubject.id }),
        },
      })
      .shouldReturnData({
        subject: {
          subject: {
            id: encodeId({ prefix: 's', id: taxonomyTermSubject.id }),
          },
        },
      })
  })

  test('property "unrevisedEntities" returns list of unrevisedEntities', async () => {
    givenUuid(article)
    given('SubjectsQuery')
      .withPayload({})
      .returns({
        subjects: [
          {
            instance: taxonomyTermSubject.instance,
            taxonomyTermId: taxonomyTermSubject.id,
          },
        ],
      })
    given('UnrevisedEntitiesQuery')
      .withPayload({})
      .returns({
        unrevisedEntityIds: [article.id],
      })

    await new Client()
      .prepareQuery({
        query: gql`
          query ($id: String!) {
            subject {
              subject(id: $id) {
                unrevisedEntities {
                  nodes {
                    __typename
                    id
                  }
                }
              }
            }
          }
        `,
        variables: {
          id: encodeId({ prefix: 's', id: taxonomyTermSubject.id }),
        },
      })
      .shouldReturnData({
        subject: {
          subject: {
            unrevisedEntities: { nodes: [getTypenameAndId(article)] },
          },
        },
      })
  })
})

test('AbstractEntity.subject', async () => {
  givenUuid(article)
  givenUuid(taxonomyTermSubject)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on AbstractEntity {
              subject {
                taxonomyTerm {
                  name
                }
              }
            }
          }
        }
      `,
      variables: { id: article.id },
    })
    .shouldReturnData({
      uuid: {
        subject: {
          taxonomyTerm: { name: taxonomyTermSubject.name },
        },
      },
    })
})
