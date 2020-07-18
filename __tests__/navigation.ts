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
  createSetTaxonomyTermMutation,
  navigation,
  page as subjectHomepage,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
} from '../__fixtures__/uuid'
import { Service } from '../src/graphql/schema/types'
import { setPage } from '../src/graphql/schema/uuid'
import { setNavigation } from '../src/graphql/schema/uuid/navigation'
import { Instance } from '../src/types'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
} from './__utils__/assertions'
import { createTestClient } from './__utils__/test-client'

describe('Page', () => {
  test('Without navigation', async () => {
    const { client } = createTestClient({
      service: Service.Serlo,
      user: null,
    })
    await assertSuccessfulGraphQLMutation({
      ...setPage(subjectHomepage),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...setNavigation({
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
                  label
                  url
                  id
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
      ...setPage(subjectHomepage),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...setNavigation(navigation),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${subjectHomepage.id}) {
            ... on Page {
              navigation {
                path {
                  label
                  url
                  id
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          navigation: {
            path: [
              {
                label: 'Mathematik',
                url: subjectHomepage.alias,
                id: subjectHomepage.id,
              },
            ],
          },
        },
      },
      client,
    })
  })

  test('Dropdown', async () => {
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      ...setPage(subjectHomepage),
      client,
    })
    const page = {
      ...subjectHomepage,
      id: subjectHomepage.id + 1,
      alias: '/page',
    }
    await assertSuccessfulGraphQLMutation({
      ...setPage(page),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      ...setNavigation({
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
                path {
                  label
                  url
                  id
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          navigation: {
            path: [
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
      ...setNavigation({
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
                path {
                  label
                  url
                  id
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
      ...setPage(subjectHomepage),
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
      ...setNavigation(navigation),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${taxonomyTermSubject.id}) {
            ... on TaxonomyTerm {
              navigation {
                path {
                  label
                  url
                  id
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          navigation: {
            path: [
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
      ...setPage(subjectHomepage),
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
      ...setNavigation(navigation),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${taxonomyTermCurriculumTopic.id}) {
            ... on TaxonomyTerm {
              navigation {
                path {
                  label
                  url
                  id
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          navigation: {
            path: [
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
          },
        },
      },
      client,
    })
  })
})

describe('_setNavigation', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        ...setNavigation(navigation),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })
})
