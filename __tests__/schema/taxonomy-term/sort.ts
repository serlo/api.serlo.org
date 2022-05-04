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
  article,
  taxonomyTermSubject,
  user as baseUser,
} from '../../../__fixtures__'
import { castToUuid, Client, given } from '../../__utils__'

const user = { ...baseUser, roles: ['de_architect'] }

const taxonomyTerm = {
  ...taxonomyTermSubject,
  childrenIds: [23453, 1454, 1394].map(castToUuid),
}
const input = {
  childrenIds: [1394, 23453, 1454].map(castToUuid),
  taxonomyTermId: taxonomyTerm.id,
}

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: TaxonomyTermSortInput!) {
        taxonomyTerm {
          sort(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withVariables({ input })

beforeEach(() => {
  given('UuidQuery').for(user, taxonomyTerm)
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  given('TaxonomyTermSortMutation')
    .withPayload({ ...input, userId: user.id })
    .returns({ success: true })

  await mutation.shouldReturnData({
    taxonomyTerm: { sort: { success: true } },
  })
})

// test('fails when parent or at least one of the children is not a taxonomy term', async () => {
//   given('UuidQuery').for(article)

//   const inputWithWrongChild = {
//     childrenIds: [taxonomyTermSubject.id, article.id],
//     destination: taxonomyTermCurriculumTopic.id,
//   }

//   await mutation
//     .withVariables({ input: inputWithWrongChild })
//     .shouldFailWithError('BAD_USER_INPUT')

//   const inputWithWrongParent = {
//     childrenIds: [taxonomyTermSubject.id, taxonomyTermSubject2.id],
//     destination: article.id,
//   }

//   await mutation
//     .withVariables({ input: inputWithWrongParent })
//     .shouldFailWithError('BAD_USER_INPUT')
// })

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "architect"', async () => {
  await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('TaxonomyTermSortMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('TaxonomyTermMoveMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})

test('updates the cache', async () => {
  given('UuidQuery').for(
    user,
    taxonomyTerm,
    { ...article, id: castToUuid(1394) },
    { ...taxonomyTermSubject, id: castToUuid(23453) },
    { ...article, id: castToUuid(1454) }
  )

  given('TaxonomyTermSortMutation')
    .withPayload({
      childrenIds: [1394, 23453, 1454],
      taxonomyTermId: taxonomyTerm.id,
      userId: user.id,
    })
    .isDefinedBy((req, res, ctx) => {
      given('UuidQuery').for({
        ...taxonomyTerm,
        childrenIds: req.body.payload.childrenIds.map(castToUuid),
      })

      //     given('UuidQuery').for({
      //       ...taxonomyTermRoot,
      //       childrenIds: [],
      //     })
      //       given('UuidQuery').for({
      //         ...taxonomyTermCurriculumTopic,
      //         childrenIds: [
      //           ...taxonomyTermCurriculumTopic.childrenIds,
      //           taxonomyTermSubject.id,
      //         ],
      //       })

      return res(ctx.json({ success: true }))
    })

  const query = new Client({ userId: user.id }).prepareQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          ... on TaxonomyTerm {
            children {
              nodes {
                id
              }
            }
          }
        }
      }
    `,
  })

  await query.withVariables({ id: taxonomyTerm.id }).shouldReturnData({
    uuid: {
      children: {
        nodes: [{ id: 23453 }, { id: 1454 }, { id: 1394 }],
      },
    },
  })

  await new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation ($input: TaxonomyTermSortInput!) {
          taxonomyTerm {
            sort(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({
      input: {
        childrenIds: [1394, 23453, 1454],
        taxonomyTermId: taxonomyTerm.id,
      },
    })
    .shouldReturnData({
      taxonomyTerm: { sort: { success: true } },
    })

  await query.withVariables({ id: taxonomyTerm.id }).shouldReturnData({
    uuid: {
      children: {
        nodes: [{ id: 1394 }, { id: 23453 }, { id: 1454 }],
      },
    },
  })

  //   await query.withVariables({ id: taxonomyTermSubject.id }).shouldReturnData({
  //     uuid: {
  //       parent: { id: taxonomyTermCurriculumTopic.id },
  //     },
  //   })

  //   await query.withVariables({ id: taxonomyTermRoot.id }).shouldReturnData({
  //     uuid: {
  //       children: { nodes: [] },
  //     },
  //   })

  //   await query
  //     .withVariables({ id: taxonomyTermCurriculumTopic.id })
  //     .shouldReturnData({
  //       uuid: {
  //         children: {
  //           nodes: [
  //             { id: taxonomyTermCurriculumTopic.childrenIds[0] },
  //             { id: taxonomyTermSubject.id },
  //           ],
  //         },
  //       },
  //     })
  // })
})
