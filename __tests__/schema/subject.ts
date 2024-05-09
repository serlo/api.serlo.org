import gql from 'graphql-tag'

import { article, emptySubjects, taxonomyTermSubject } from '../../__fixtures__'
import { Client, given, subjectQuery } from '../__utils__'

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
  given('UuidQuery').for(taxonomyTermSubject, article)
  given('UnrevisedEntitiesQuery').for(article)

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
    .withVariables({ instance: article.instance })
    .shouldReturnData({
      subject: {
        subjects: [
          {
            unrevisedEntities: {
              nodes: [{ __typename: 'Article', id: article.id }],
            },
          },
          ...emptySubjects,
        ],
      },
    })
})
