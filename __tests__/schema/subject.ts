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

const query = new Client()
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

const subjects = [
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
]

test('`Subject.unrevisedEntities` returns list of unrevisedEntities', async () => {
  await query.shouldReturnData({
    subject: {
      subjects,
    },
  })
})

test('`Subject.unrevisedEntities` shows new revisions first', async () => {
  await new Client({ userId: 1 })
    .prepareQuery({
      query: gql`
        mutation {
          entity {
            setAbstractEntity(
              input: {
                entityType: "Article"
                changes: "new revision changes"
                entityId: 34907
                content: "new content"
                subscribeThis: false
                subscribeThisByEmail: false
                needsReview: true
              }
            ) {
              success
            }
          }
        }
      `,
    })
    .execute()
  const subjectsChangedOrder = [...subjects]
  ;(subjectsChangedOrder[4] = {
    unrevisedEntities: {
      nodes: [
        { __typename: 'Article', id: 35247 },
        { __typename: 'Article', id: 34907 },
      ],
    },
  }),
    await query.shouldReturnData({
      subject: {
        subjects: subjectsChangedOrder,
      },
    })
})
