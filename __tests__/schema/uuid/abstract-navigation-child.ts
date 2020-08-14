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
  navigation,
  page as subjectHomepage,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
} from '../../../__fixtures__'
import {
  NavigationPayload,
  PagePayload,
  TaxonomyTermPayload,
} from '../../../src/graphql/schema'
import { Service } from '../../../src/graphql/schema/types'
import { Instance } from '../../../src/types'
import {
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  createTestClient,
} from '../../__utils__'

function createSetNavigationMutation(navigation: NavigationPayload) {
  return {
    mutation: gql`
      mutation _setCache($key: String!, $value: JSON!) {
        _setCache(key: $key, value: $value)
      }
    `,
    variables: {
      key: `${navigation.instance}.serlo.org/api/navigation`,
      value: navigation,
    },
  }
}

function createSetPageMutation(page: PagePayload) {
  return {
    mutation: gql`
      mutation _setCache($key: String!, $value: JSON!) {
        _setCache(key: $key, value: $value)
      }
    `,
    variables: {
      key: `de.serlo.org/api/uuid/${page.id}`,
      value: page,
    },
  }
}

function createSetTaxonomyTermMutation(taxonomyTerm: TaxonomyTermPayload) {
  return {
    mutation: gql`
      mutation _setCache($key: String!, $value: JSON!) {
        _setCache(key: $key, value: $value)
      }
    `,
    variables: {
      key: `de.serlo.org/api/uuid/${taxonomyTerm.id}`,
      value: taxonomyTerm,
    },
  }
}

describe('Page', () => {
  test('Without navigation', async () => {
    const { client } = createTestClient({
      service: Service.Serlo,
      user: null,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetPageMutation(subjectHomepage),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetNavigationMutation({
        instance: Instance.De,
        data: [],
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${subjectHomepage.id}) {
            ... on Page {
              navigation {
                path {
                  nodes{
                    label
                    url
                    id
                  }
                  totalCount
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          navigation: null,
        },
      },
      client,
    })
  })

  test('Subject Homepage', async () => {
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      ...createSetPageMutation(subjectHomepage),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetNavigationMutation(navigation),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${subjectHomepage.id}) {
            ... on Page {
              navigation {
                path {
                  nodes{
                    label
                    url
                    id
                  }
                  totalCount
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          navigation: {
            path: {
              nodes: [
                {
                  label: 'Mathematik',
                  url: subjectHomepage.alias,
                  id: subjectHomepage.id,
                },
              ],
              totalCount: 1,
            },
          },
        },
      },
      client,
    })
  })

  test('Dropdown', async () => {
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      ...createSetPageMutation(subjectHomepage),
      client,
    })
    const page = {
      ...subjectHomepage,
      id: subjectHomepage.id + 1,
      alias: '/page',
    }
    await assertSuccessfulGraphQLMutation({
      ...createSetPageMutation(page),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetNavigationMutation({
        instance: Instance.De,
        data: [
          {
            label: 'Mathematik',
            id: subjectHomepage.id,
            children: [
              {
                label: 'Dropdown',
                children: [
                  {
                    label: 'Page',
                    id: page.id,
                  },
                ],
              },
            ],
          },
        ],
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${page.id}) {
            ... on Page {
              navigation {
                path {nodes{
                  label
                  url
                  id
                }
                  totalCount
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          navigation: {
            path: {
              nodes: [
                {
                  label: 'Mathematik',
                  url: subjectHomepage.alias,
                  id: subjectHomepage.id,
                },
                {
                  label: 'Dropdown',
                  url: null,
                  id: null,
                },
                {
                  label: 'Page',
                  url: page.alias,
                  id: page.id,
                },
              ],
              totalCount: 3,
            },
          },
        },
      },
      client,
    })
  })
})

describe('Taxonomy Term', () => {
  test('Without navigation', async () => {
    const { client } = createTestClient({
      service: Service.Serlo,
      user: null,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetTaxonomyTermMutation(taxonomyTermRoot),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetTaxonomyTermMutation(taxonomyTermSubject),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetNavigationMutation({
        instance: Instance.De,
        data: [],
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${taxonomyTermSubject.id}) {
            ... on TaxonomyTerm {
              navigation {
                path {nodes{
                  label
                  url
                  id
                }
                  totalCount
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          navigation: null,
        },
      },
      client,
    })
  })

  test('Subject', async () => {
    const { client } = createTestClient({
      service: Service.Serlo,
      user: null,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetPageMutation(subjectHomepage),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetTaxonomyTermMutation(taxonomyTermRoot),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetTaxonomyTermMutation(taxonomyTermSubject),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetNavigationMutation(navigation),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${taxonomyTermSubject.id}) {
            ... on TaxonomyTerm {
              navigation {
                path {nodes{
                  label
                  url
                  id
                }
                  totalCount
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          navigation: {
            path: {
              nodes: [
                {
                  label: 'Mathematik',
                  url: subjectHomepage.alias,
                  id: subjectHomepage.id,
                },
                {
                  label: 'Alle Themen',
                  url: taxonomyTermSubject.alias,
                  id: taxonomyTermSubject.id,
                },
              ],
              totalCount: 2,
            },
          },
        },
      },
      client,
    })
  })

  test('Curriculum Topic', async () => {
    const { client } = createTestClient({
      service: Service.Serlo,
      user: null,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetPageMutation(subjectHomepage),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetTaxonomyTermMutation(taxonomyTermRoot),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetTaxonomyTermMutation(taxonomyTermSubject),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetTaxonomyTermMutation(taxonomyTermCurriculumTopic),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...createSetNavigationMutation(navigation),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${taxonomyTermCurriculumTopic.id}) {
            ... on TaxonomyTerm {
              navigation {
                path {nodes{
                  label
                  url
                  id
                }
                  totalCount
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          navigation: {
            path: {
              nodes: [
                {
                  label: 'Mathematik',
                  url: subjectHomepage.alias,
                  id: subjectHomepage.id,
                },
                {
                  label: 'Alle Themen',
                  url: taxonomyTermSubject.alias,
                  id: taxonomyTermSubject.id,
                },
                {
                  label: taxonomyTermCurriculumTopic.name,
                  url: taxonomyTermCurriculumTopic.alias,
                  id: taxonomyTermCurriculumTopic.id,
                },
              ],
              totalCount: 3,
            },
          },
        },
      },
      client,
    })
  })
})
