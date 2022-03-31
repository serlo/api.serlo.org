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
  article,
  navigation,
  page,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
} from '../../../__fixtures__'
import {
  assertSuccessfulGraphQLQuery,
  LegacyClient,
  createTestClient,
  getTypenameAndId,
  given,
} from '../../__utils__'
import { Instance } from '~/types'

let client: LegacyClient

beforeEach(() => {
  client = createTestClient()
})

describe('TaxonomyTerm root', () => {
  beforeEach(() => {
    given('UuidQuery').for(taxonomyTermRoot)
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query taxonomyTerm($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on TaxonomyTerm {
              id
              type
              trashed
              instance
              name
              description
              weight
            }
          }
        }
      `,
      variables: taxonomyTermRoot,
      data: {
        uuid: R.pick(
          [
            '__typename',
            'id',
            'type',
            'trashed',
            'instance',
            'name',
            'description',
            'weight',
          ],
          taxonomyTermRoot
        ),
      },
      client,
    })
  })

  test('by id (w/ parent)', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query taxonomyTerm($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              parent {
                __typename
                id
                type
                trashed
                instance
                name
                description
                weight
              }
            }
          }
        }
      `,
      variables: taxonomyTermRoot,
      data: {
        uuid: {
          parent: null,
        },
      },
      client,
    })
  })

  test('by id (w/ children)', async () => {
    given('UuidQuery').for(taxonomyTermSubject)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query taxonomyTerm($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              children {
                nodes {
                  __typename
                  ... on TaxonomyTerm {
                    id
                  }
                }
                totalCount
              }
            }
          }
        }
      `,
      variables: taxonomyTermRoot,
      data: {
        uuid: {
          children: {
            nodes: [getTypenameAndId(taxonomyTermSubject)],
            totalCount: 1,
          },
        },
      },
      client,
    })
  })

  test('by id (w/ navigation)', async () => {
    given('NavigationQuery')
      .withPayload({ instance: Instance.De })
      .returns(navigation)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query taxonomyTerm($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              navigation {
                data
                path {
                  nodes {
                    id
                    label
                    url
                  }
                }
              }
            }
          }
        }
      `,
      variables: taxonomyTermRoot,
      data: {
        uuid: {
          navigation: null,
        },
      },
      client,
    })
  })
})

describe('TaxonomyTerm subject', () => {
  beforeEach(() => {
    given('UuidQuery').for(taxonomyTermSubject)
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query taxonomyTerm($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on TaxonomyTerm {
              id
            }
          }
        }
      `,
      variables: taxonomyTermSubject,
      data: {
        uuid: getTypenameAndId(taxonomyTermSubject),
      },
      client,
    })
  })

  test('by id (w/ parent)', async () => {
    given('UuidQuery').for(taxonomyTermRoot)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query taxonomyTerm($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              parent {
                __typename
                id
              }
            }
          }
        }
      `,
      variables: taxonomyTermSubject,
      data: {
        uuid: {
          parent: getTypenameAndId(taxonomyTermRoot),
        },
      },
      client,
    })
  })

  test('by id (w/ children)', async () => {
    given('UuidQuery').for(taxonomyTermCurriculumTopic)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query taxonomyTerm($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              children {
                nodes {
                  __typename
                  ... on TaxonomyTerm {
                    id
                  }
                }
                totalCount
              }
            }
          }
        }
      `,
      variables: taxonomyTermSubject,
      data: {
        uuid: {
          children: {
            nodes: [getTypenameAndId(taxonomyTermCurriculumTopic)],
            totalCount: 1,
          },
        },
      },
      client,
    })
  })

  test('by id (w/ navigation)', async () => {
    given('UuidQuery').for(taxonomyTermRoot, page)
    given('NavigationQuery')
      .withPayload({ instance: Instance.De })
      .returns(navigation)

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query taxonomyTerm($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              navigation {
                data
                path {
                  nodes {
                    id
                    label
                    url
                  }
                }
              }
            }
          }
        }
      `,
      variables: taxonomyTermSubject,
      data: {
        uuid: {
          navigation: {
            data: {
              id: page.id,
              label: navigation.data[0].label,
              children: [
                {
                  id: taxonomyTermSubject.id,
                  label: navigation.data[0].children?.[0].label,
                },
              ],
            },
            path: {
              nodes: [
                {
                  id: page.id,
                  label: navigation.data[0].label,
                  url: page.alias,
                },
                {
                  id: taxonomyTermSubject.id,
                  label: navigation.data[0].children?.[0].label,
                  url: taxonomyTermSubject.alias,
                },
              ],
            },
          },
        },
      },
      client,
    })
  })
})

describe('TaxonomyTerm curriculumTopic', () => {
  beforeEach(() => {
    given('UuidQuery').for(taxonomyTermCurriculumTopic)
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query taxonomyTerm($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on TaxonomyTerm {
              id
            }
          }
        }
      `,
      variables: taxonomyTermCurriculumTopic,
      data: {
        uuid: getTypenameAndId(taxonomyTermCurriculumTopic),
      },
      client,
    })
  })

  test('by id (w/ parent)', async () => {
    given('UuidQuery').for(taxonomyTermSubject)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query taxonomyTerm($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              parent {
                __typename
                id
              }
            }
          }
        }
      `,
      variables: taxonomyTermCurriculumTopic,
      data: {
        uuid: {
          parent: getTypenameAndId(taxonomyTermSubject),
        },
      },
      client,
    })
  })

  test('by id (w/ children)', async () => {
    given('UuidQuery').for(article)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query taxonomyTerm($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              children {
                nodes {
                  __typename
                  id
                }
              }
            }
          }
        }
      `,
      variables: taxonomyTermCurriculumTopic,
      data: {
        uuid: {
          children: { nodes: [getTypenameAndId(article)] },
        },
      },
      client,
    })
  })

  test('by id (w/ navigation)', async () => {
    given('UuidQuery').for(taxonomyTermRoot, taxonomyTermSubject, page)
    given('NavigationQuery')
      .withPayload({ instance: Instance.De })
      .returns(navigation)

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query taxonomyTerm($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              navigation {
                data
                path {
                  nodes {
                    id
                    label
                    url
                  }
                }
              }
            }
          }
        }
      `,
      variables: taxonomyTermCurriculumTopic,
      data: {
        uuid: {
          navigation: {
            data: {
              id: page.id,
              label: navigation.data[0].label,
              children: [
                {
                  id: taxonomyTermSubject.id,
                  label: navigation.data[0].children?.[0].label,
                },
              ],
            },
            path: {
              nodes: [
                {
                  id: page.id,
                  label: navigation.data[0].label,
                  url: page.alias,
                },
                {
                  id: taxonomyTermSubject.id,
                  label: navigation.data[0].children?.[0].label,
                  url: taxonomyTermSubject.alias,
                },
                {
                  id: taxonomyTermCurriculumTopic.id,
                  label: taxonomyTermCurriculumTopic.name,
                  url: taxonomyTermCurriculumTopic.alias,
                },
              ],
            },
          },
        },
      },
      client,
    })
  })
})
