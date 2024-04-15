import gql from 'graphql-tag'
import * as R from 'ramda'

import {
  article,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
  taxonomyTermTopic,
  taxonomyTermTopicFolder,
} from '../../../__fixtures__'
import { Client, getTypenameAndId, given } from '../../__utils__'

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
          taxonomyTermRoot,
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

  test('by id (w/ path)', async () => {
    await client
      .prepareQuery({
        query: gql`
          query taxonomyTerm($id: Int!) {
            uuid(id: $id) {
              ... on TaxonomyTerm {
                path {
                  id
                  name
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: taxonomyTermRoot.id })
      .shouldReturnData({ uuid: { path: [] } })
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

  test('by id (w/ path)', async () => {
    given('UuidQuery').for(taxonomyTermSubject)

    await client
      .prepareQuery({
        query: gql`
          query taxonomyTerm($id: Int!) {
            uuid(id: $id) {
              ... on TaxonomyTerm {
                path {
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
        uuid: {
          path: [getTypenameAndId(taxonomyTermSubject)],
        },
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
})

describe('TaxonomyTerm exerciseFolder', () => {
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
