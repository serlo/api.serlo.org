/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'
import * as R from 'ramda'

import {
  navigation,
  page,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
} from '../../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../../__utils__/assertions'
import {
  addNavigationInteraction,
  addPageInteraction,
  addTaxonomyTermInteraction,
} from '../../__utils__/interactions'

test('by id (subject)', async () => {
  await addTaxonomyTermInteraction(taxonomyTermRoot)
  await addTaxonomyTermInteraction(taxonomyTermSubject)
  await addTaxonomyTermInteraction(taxonomyTermCurriculumTopic)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        uuid(id: 5) {
          __typename
          ... on TaxonomyTerm {
            id
            type
            trashed
            instance
            alias
            name
            description
            weight

            parent {
              id
              alias
            }

            children {
              id
            }
          }
        }
      }
    `,
    data: {
      uuid: {
        __typename: 'TaxonomyTerm',
        ...R.omit(['parentId', 'childrenIds'], taxonomyTermSubject),
        parent: {
          id: 3,
          alias: null,
        },
        children: [
          {
            id: 16048,
          },
        ],
      },
    },
  })
})

test('by id (subject, w/ navigation)', async () => {
  await addPageInteraction(page)
  await addTaxonomyTermInteraction(taxonomyTermRoot)
  await addTaxonomyTermInteraction(taxonomyTermSubject)
  await addTaxonomyTermInteraction(taxonomyTermCurriculumTopic)
  await addNavigationInteraction(navigation)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        uuid(id: 5) {
          __typename
          ... on TaxonomyTerm {
            id
            type
            trashed
            instance
            alias
            name
            description
            weight

            parent {
              id
            }

            children {
              id
            }

            navigation {
              data
              path {
                label
                id
                url
              }
            }
          }
        }
      }
    `,
    data: {
      uuid: {
        __typename: 'TaxonomyTerm',
        ...R.omit(['parentId', 'childrenIds'], taxonomyTermSubject),

        parent: {
          id: 3,
        },

        children: [
          {
            id: 16048,
          },
        ],

        navigation: {
          data: JSON.stringify((JSON.parse(navigation.data) as unknown[])[0]),
          path: [
            {
              label: 'Mathematik',
              id: page.id,
              url: page.alias,
            },
            {
              label: 'Alle Themen',
              id: taxonomyTermSubject.id,
              url: taxonomyTermSubject.alias,
            },
          ],
        },
      },
    },
  })
})

test('by id (curriculum-topic)', async () => {
  await addTaxonomyTermInteraction(taxonomyTermCurriculumTopic)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        uuid(id: 16048) {
          __typename
          ... on TaxonomyTerm {
            id
            type
            trashed
            instance
            alias
            name
            description
            weight
          }
        }
      }
    `,
    data: {
      uuid: {
        __typename: 'TaxonomyTerm',
        ...R.omit(['parentId', 'childrenIds'], taxonomyTermCurriculumTopic),
      },
    },
  })
})
