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

import {
  article,
  getArticleDataWithoutSubResolvers,
  getTaxonomyTermDataWithoutSubResolvers,
  navigation,
  page,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
} from '../../../__fixtures__'
import { Service } from '../../../src/graphql/schema/types'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createNavigationHandler,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: null,
  }).client
})

describe('TaxonomyTerm root', () => {
  beforeEach(() => {
    global.server.use(createUuidHandler(taxonomyTermRoot))
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
              alias
              name
              description
              weight
            }
          }
        }
      `,
      variables: taxonomyTermRoot,
      data: {
        uuid: getTaxonomyTermDataWithoutSubResolvers(taxonomyTermRoot),
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
                alias
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
    global.server.use(createUuidHandler(taxonomyTermSubject))
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
                    type
                    trashed
                    instance
                    alias
                    name
                    description
                    weight
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
            nodes: [
              getTaxonomyTermDataWithoutSubResolvers(taxonomyTermSubject),
            ],
            totalCount: 1,
          },
        },
      },
      client,
    })
  })

  test('by id (w/ navigation)', async () => {
    global.server.use(createNavigationHandler(navigation))
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
    global.server.use(createUuidHandler(taxonomyTermSubject))
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
              alias
              name
              description
              weight
            }
          }
        }
      `,
      variables: taxonomyTermSubject,
      data: {
        uuid: getTaxonomyTermDataWithoutSubResolvers(taxonomyTermSubject),
      },
      client,
    })
  })

  test('by id (w/ parent)', async () => {
    global.server.use(createUuidHandler(taxonomyTermRoot))
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
                alias
                name
                description
                weight
              }
            }
          }
        }
      `,
      variables: taxonomyTermSubject,
      data: {
        uuid: {
          parent: getTaxonomyTermDataWithoutSubResolvers(taxonomyTermRoot),
        },
      },
      client,
    })
  })

  test('by id (w/ children)', async () => {
    global.server.use(createUuidHandler(taxonomyTermCurriculumTopic))
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
                    type
                    trashed
                    instance
                    alias
                    name
                    description
                    weight
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
            nodes: [
              getTaxonomyTermDataWithoutSubResolvers(
                taxonomyTermCurriculumTopic
              ),
            ],
            totalCount: 1,
          },
        },
      },
      client,
    })
  })

  test('by id (w/ navigation)', async () => {
    global.server.use(
      createNavigationHandler(navigation),
      createUuidHandler(taxonomyTermRoot),
      createUuidHandler(page)
    )
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
    global.server.use(createUuidHandler(taxonomyTermCurriculumTopic))
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
              alias
              name
              description
              weight
            }
          }
        }
      `,
      variables: taxonomyTermCurriculumTopic,
      data: {
        uuid: getTaxonomyTermDataWithoutSubResolvers(
          taxonomyTermCurriculumTopic
        ),
      },
      client,
    })
  })

  test('by id (w/ parent)', async () => {
    global.server.use(createUuidHandler(taxonomyTermSubject))
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
                alias
                name
                description
                weight
              }
            }
          }
        }
      `,
      variables: taxonomyTermCurriculumTopic,
      data: {
        uuid: {
          parent: getTaxonomyTermDataWithoutSubResolvers(taxonomyTermSubject),
        },
      },
      client,
    })
  })

  test('by id (w/ children)', async () => {
    global.server.use(createUuidHandler(article))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query taxonomyTerm($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              children {
                nodes {
                  __typename
                  ... on Article {
                    id
                    trashed
                    alias
                    instance
                    date
                  }
                }
                totalCount
              }
            }
          }
        }
      `,
      variables: taxonomyTermCurriculumTopic,
      data: {
        uuid: {
          children: {
            nodes: [getArticleDataWithoutSubResolvers(article)],

            totalCount: 1,
          },
        },
      },
      client,
    })
  })

  test('by id (w/ navigation)', async () => {
    global.server.use(
      createNavigationHandler(navigation),
      createUuidHandler(taxonomyTermRoot),
      createUuidHandler(taxonomyTermSubject),
      createUuidHandler(page)
    )
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
