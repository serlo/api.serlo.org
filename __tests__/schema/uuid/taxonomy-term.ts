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
  taxonomyTermTopic,
  taxonomyTermTopicFolder,
} from '../../../__fixtures__'
import { Client, getTypenameAndId, given } from '../../__utils__'
import { Instance } from '~/types'

const client = new Client()

describe('TaxonomyTerm root', () => {
  beforeEach(() => {
    given('UuidQuery').for(taxonomyTermRoot)
  })

  test('by id', async () => {
    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermRoot.id })
      .shouldReturnData({
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
      })
  })

  test('by id (w/ parent)', async () => {
    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermRoot.id })
      .shouldReturnData({ uuid: { parent: null } })
  })

  test('by id (w/ children)', async () => {
    given('UuidQuery').for(taxonomyTermSubject)

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermRoot.id })
      .shouldReturnData({
        uuid: {
          children: {
            nodes: [getTypenameAndId(taxonomyTermSubject)],
            totalCount: 1,
          },
        },
      })
  })

  test('by id (w/ navigation)', async () => {
    given('NavigationQuery')
      .withPayload({ instance: Instance.De })
      .returns(navigation)

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermRoot.id })
      .shouldReturnData({ uuid: { navigation: null } })
  })
})

describe('TaxonomyTerm subject', () => {
  beforeEach(() => {
    given('UuidQuery').for(taxonomyTermSubject)
  })

  test('by id', async () => {
    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermSubject.id })
      .shouldReturnData({ uuid: getTypenameAndId(taxonomyTermSubject) })
  })

  test('by id (w/ parent)', async () => {
    given('UuidQuery').for(taxonomyTermRoot)

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermSubject.id })
      .shouldReturnData({
        uuid: { parent: getTypenameAndId(taxonomyTermRoot) },
      })
  })

  test('by id (w/ children)', async () => {
    given('UuidQuery').for(taxonomyTermCurriculumTopic)

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermSubject.id })
      .shouldReturnData({
        uuid: {
          children: {
            nodes: [getTypenameAndId(taxonomyTermCurriculumTopic)],
            totalCount: 1,
          },
        },
      })
  })

  test('by id (w/ navigation)', async () => {
    given('UuidQuery').for(taxonomyTermRoot, page)
    given('NavigationQuery')
      .withPayload({ instance: Instance.De })
      .returns(navigation)

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermSubject.id })
      .shouldReturnData({
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
      })
  })
})

describe('TaxonomyTerm curriculumTopic', () => {
  beforeEach(() => {
    given('UuidQuery').for(taxonomyTermCurriculumTopic)
  })

  test('by id', async () => {
    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermCurriculumTopic.id })
      .shouldReturnData({ uuid: getTypenameAndId(taxonomyTermCurriculumTopic) })
  })

  test('by id (w/ parent)', async () => {
    given('UuidQuery').for(taxonomyTermSubject)

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermCurriculumTopic.id })
      .shouldReturnData({
        uuid: { parent: getTypenameAndId(taxonomyTermSubject) },
      })
  })

  test('by id (w/ children)', async () => {
    given('UuidQuery').for(article)

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermCurriculumTopic.id })
      .shouldReturnData({
        uuid: { children: { nodes: [getTypenameAndId(article)] } },
      })
  })

  test('by id (w/ navigation)', async () => {
    given('UuidQuery').for(taxonomyTermRoot, taxonomyTermSubject, page)
    given('NavigationQuery')
      .withPayload({ instance: Instance.De })
      .returns(navigation)

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: taxonomyTermCurriculumTopic.id })
      .shouldReturnData({
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
      })
  })
})

describe('TaxonomyTerm topicFolder', () => {
  beforeEach(() => {
    given('UuidQuery').for(taxonomyTermTopicFolder)
    given('UuidQuery').for(taxonomyTermTopic)
  })

  test('by id (check changed type)', async () => {
    await client
      .prepareQuery({
        query: gql`
          query taxonomyTerm($id: Int!) {
            uuid(id: $id) {
              ... on TaxonomyTerm {
                type
              }
            }
          }
        `,
      })
      .withVariables({ id: taxonomyTermTopicFolder.id })
      .shouldReturnData({
        uuid: { type: 'exerciseFolder' },
      })
  })
})
