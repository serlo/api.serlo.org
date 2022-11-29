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
  navigation,
  page as subjectHomepage,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
} from '../../../__fixtures__'
import { castToAlias, Client, nextUuid } from '../../__utils__'
import { Service } from '~/internals/authentication'
import { Model } from '~/internals/graphql'
import { Payload } from '~/internals/model'
import { Instance } from '~/types'

function createSetNavigationMutation(
  navigation: Payload<'serlo', 'getNavigationPayload'>
) {
  return {
    mutation: {
      query: gql`
        mutation setCache($input: CacheSetInput!) {
          _cache {
            set(input: $input) {
              success
            }
          }
        }
      `,
    },
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
    mutation: {
      query: gql`
        mutation setCache($input: CacheSetInput!) {
          _cache {
            set(input: $input) {
              success
            }
          }
        }
      `,
    },
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
    mutation: {
      query: gql`
        mutation setCache($input: CacheSetInput!) {
          _cache {
            set(input: $input) {
              success
            }
          }
        }
      `,
    },
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
    const client = new Client({ service: Service.Serlo })

    await client
      .prepareQuery(createSetPageMutation(subjectHomepage).mutation)
      .withVariables(createSetPageMutation(subjectHomepage).variables)
      .execute()

    await client
      .prepareQuery(
        createSetNavigationMutation({
          instance: Instance.De,
          data: [],
        }).mutation
      )
      .withVariables(
        createSetNavigationMutation({
          instance: Instance.De,
          data: [],
        }).variables
      )
      .execute()

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: subjectHomepage.id })
      .shouldReturnData({
        uuid: {
          navigation: null,
        },
      })
  })

  test('Subject Homepage', async () => {
    const client = new Client({ service: Service.Serlo })

    await client
      .prepareQuery(createSetPageMutation(subjectHomepage).mutation)
      .withVariables(createSetPageMutation(subjectHomepage).variables)
      .execute()

    await client
      .prepareQuery(createSetNavigationMutation(navigation).mutation)
      .withVariables(createSetNavigationMutation(navigation).variables)
      .execute()

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: subjectHomepage.id })
      .shouldReturnData({
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
      })
  })

  test('Dropdown', async () => {
    const client = new Client({ service: Service.Serlo })

    const page = {
      ...subjectHomepage,
      id: nextUuid(subjectHomepage.id),
      alias: castToAlias('/page'),
    }

    await client
      .prepareQuery(createSetPageMutation(subjectHomepage).mutation)
      .withVariables(createSetPageMutation(subjectHomepage).variables)
      .execute()

    await client
      .prepareQuery(createSetPageMutation(page).mutation)
      .withVariables(createSetPageMutation(page).variables)
      .execute()

    await client
      .prepareQuery(
        createSetNavigationMutation({
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
        }).mutation
      )
      .withVariables(
        createSetNavigationMutation({
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
        }).variables
      )
      .execute()

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: page.id })
      .shouldReturnData({
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
      })
  })
})

describe('Taxonomy Term', () => {
  test('Without navigation', async () => {
    const client = new Client({ service: Service.Serlo })

    await client
      .prepareQuery(createSetTaxonomyTermMutation(taxonomyTermRoot).mutation)
      .withVariables(createSetTaxonomyTermMutation(taxonomyTermRoot).variables)
      .execute()

    await client
      .prepareQuery(createSetTaxonomyTermMutation(taxonomyTermSubject).mutation)
      .withVariables(
        createSetTaxonomyTermMutation(taxonomyTermSubject).variables
      )
      .execute()

    await client
      .prepareQuery(
        createSetNavigationMutation({
          instance: Instance.De,
          data: [],
        }).mutation
      )
      .withVariables(
        createSetNavigationMutation({
          instance: Instance.De,
          data: [],
        }).variables
      )
      .execute()

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermSubject.id })
      .shouldReturnData({
        uuid: {
          navigation: null,
        },
      })
  })

  test('Subject', async () => {
    const client = new Client({ service: Service.Serlo })

    await client
      .prepareQuery(createSetPageMutation(subjectHomepage).mutation)
      .withVariables(createSetPageMutation(subjectHomepage).variables)
      .execute()

    await client
      .prepareQuery(createSetTaxonomyTermMutation(taxonomyTermRoot).mutation)
      .withVariables(createSetTaxonomyTermMutation(taxonomyTermRoot).variables)
      .execute()

    await client
      .prepareQuery(createSetTaxonomyTermMutation(taxonomyTermSubject).mutation)
      .withVariables(
        createSetTaxonomyTermMutation(taxonomyTermSubject).variables
      )
      .execute()

    await client
      .prepareQuery(createSetNavigationMutation(navigation).mutation)
      .withVariables(createSetNavigationMutation(navigation).variables)
      .execute()

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermSubject.id })
      .shouldReturnData({
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
      })
  })

  test('Curriculum Topic', async () => {
    const client = new Client({ service: Service.Serlo })

    await client
      .prepareQuery(createSetPageMutation(subjectHomepage).mutation)
      .withVariables(createSetPageMutation(subjectHomepage).variables)
      .execute()

    await client
      .prepareQuery(createSetTaxonomyTermMutation(taxonomyTermRoot).mutation)
      .withVariables(createSetTaxonomyTermMutation(taxonomyTermRoot).variables)
      .execute()

    await client
      .prepareQuery(createSetTaxonomyTermMutation(taxonomyTermSubject).mutation)
      .withVariables(
        createSetTaxonomyTermMutation(taxonomyTermSubject).variables
      )
      .execute()

    await client
      .prepareQuery(
        createSetTaxonomyTermMutation(taxonomyTermCurriculumTopic).mutation
      )
      .withVariables(
        createSetTaxonomyTermMutation(taxonomyTermCurriculumTopic).variables
      )
      .execute()

    await client
      .prepareQuery(createSetNavigationMutation(navigation).mutation)
      .withVariables(createSetNavigationMutation(navigation).variables)
      .execute()

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermCurriculumTopic.id })
      .shouldReturnData({
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
      })
  })
})
