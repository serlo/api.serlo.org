import gql from 'graphql-tag'

import { Client, subjectQuery } from '../__utils__'

test('endpoint "subjects" returns list of all subjects for an instance', async () => {
  await subjectQuery.withVariables({ instance: 'en' }).shouldReturnData({
    subject: { subjects: [{ taxonomyTerm: { name: 'Math' } }] },
  })
})

test('`Subject.id` returns encoded id of subject', async () => {
  await subjectQuery.withVariables({ instance: 'en' }).shouldReturnData({
    subject: { subjects: [{ id: 'czIzNTkz' }] },
  })
})

test('`Subject.unrevisedEntities` returns list of unrevisedEntities', async () => {
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
