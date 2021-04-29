/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
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
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  createTestClient,
} from '../../__utils__'
import { Service } from '~/internals/authentication'
import { Model } from '~/internals/graphql'
import { Payload } from '~/internals/model/types'
import { Instance } from '~/types'

function createSetNavigationMutation(
  navigation: Payload<'serlo', 'getNavigationPayload'>
) {
  return {
    mutation: gql`
      mutation($input: CacheSetInput!) {
        _cache {
          set(input: $input) {
            success
          }
        }
      }
    `,
    variables: {
      input: {
        key: `${navigation.instance}.serlo.org/api/navigation`,
        value: navigation,
      },
    },
  }
}

function createSetPageMutation(page: Model<'Page'>) {
  return {
    mutation: gql`
      mutation($input: CacheSetInput!) {
        _cache {
          set(input: $input) {
            success
          }
        }
      }
    `,
    variables: {
      input: {
        key: `de.serlo.org/api/uuid/${page.id}`,
        value: page,
      },
    },
  }
}

function createSetTaxonomyTermMutation(taxonomyTerm: Model<'TaxonomyTerm'>) {
  return {
    mutation: gql`
      mutation($input: CacheSetInput!) {
        _cache {
          set(input: $input) {
            success
          }
        }
      }
    `,
    variables: {
      input: {
        key: `de.serlo.org/api/uuid/${taxonomyTerm.id}`,
        value: taxonomyTerm,
      },
    },
  }
}

describe('Page', () => {
  test('Without navigation', async () => {
    const client = createTestClient({
      service: Service.Serlo,
      userId: null,
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
        query uuid($id: Int!) {
          uuid(id: $id) {
            ... on Page {
              navigation {
                path {
                  nodes {
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
      variables: { id: subjectHomepage.id },
      data: {
        uuid: {
          navigation: null,
        },
      },
      client,
    })
  })

  test('Subject Homepage', async () => {
    const client = createTestClient({ service: Service.Serlo, userId: null })
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
        query uuid($id: Int!) {
          uuid(id: $id) {
            ... on Page {
              navigation {
                path {
                  nodes {
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
      variables: { id: subjectHomepage.id },
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
    const client = createTestClient({ service: Service.Serlo, userId: null })
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
        query uuid($id: Int!) {
          uuid(id: $id) {
            ... on Page {
              navigation {
                path {
                  nodes {
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
      variables: { id: page.id },
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
    const client = createTestClient({
      service: Service.Serlo,
      userId: null,
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
        query uuid($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              navigation {
                path {
                  nodes {
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
      variables: { id: taxonomyTermSubject.id },
      data: {
        uuid: {
          navigation: null,
        },
      },
      client,
    })
  })

  test('Subject', async () => {
    const client = createTestClient({
      service: Service.Serlo,
      userId: null,
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
        query uuid($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              navigation {
                path {
                  nodes {
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
      variables: { id: taxonomyTermSubject.id },
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
    const client = createTestClient({
      service: Service.Serlo,
      userId: null,
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
        query uuid($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              navigation {
                path {
                  nodes {
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
      variables: { id: taxonomyTermCurriculumTopic.id },
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
