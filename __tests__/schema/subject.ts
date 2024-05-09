import gql from 'graphql-tag'

import { article, taxonomyTermSubject } from '../../__fixtures__'
import { Client, given } from '../__utils__'
import { Instance } from '~/types'

test('endpoint "subjects" returns list of all subjects for an instance', async () => {
  given('UuidQuery').for(taxonomyTermSubject)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($instance: Instance!) {
          subject {
            subjects(instance: $instance) {
              taxonomyTerm {
                name
              }
            }
          }
        }
      `,
    })
    .withVariables({ instance: Instance.En })
    .shouldReturnData({
      subject: {
        subjects: [{ taxonomyTerm: { name: 'Math' } }],
      },
    })
})

test('`Subject.id` returns encoded id of subject', async () => {
  given('UuidQuery').for(taxonomyTermSubject)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($instance: Instance!) {
          subject {
            subjects(instance: $instance) {
              id
            }
          }
        }
      `,
    })
    .withVariables({ instance: Instance.En })
    .shouldReturnData({
      subject: {
        subjects: [{ id: 'czIzNTkz' }],
      },
    })
})

test('`Subject.unrevisedEntities` returns list of unrevisedEntities', async () => {
  given('UuidQuery').for(taxonomyTermSubject, article)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($instance: Instance!) {
          subject {
            subjects(instance: $instance) {
              unrevisedEntities {
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
    .withVariables({ instance: 'de' })
    .shouldReturnData({
      subject: {
        subjects: [
          {
            unrevisedEntities: {
              nodes: [{ __typename: 'Article', id: 34741 }],
            },
          },
          { unrevisedEntities: { nodes: [] } },
          { unrevisedEntities: { nodes: [] } },
          { unrevisedEntities: { nodes: [] } },
          {
            unrevisedEntities: {
              nodes: [
                { __typename: 'Article', id: 34907 },
                { __typename: 'Article', id: 35247 },
              ],
            },
          },
          {
            unrevisedEntities: {
              nodes: [{ __typename: 'Article', id: 26892 }],
            },
          },
          { unrevisedEntities: { nodes: [] } },
          { unrevisedEntities: { nodes: [] } },
          { unrevisedEntities: { nodes: [] } },
        ],
      },
    })
})
