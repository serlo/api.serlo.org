import gql from 'graphql-tag'

import { article, taxonomyTermSubject } from '../../__fixtures__'
import { Client, given, getTypenameAndId, nextUuid } from '../__utils__'
import { encodeSubjectId } from '~/schema/subject/utils'
import { Instance } from '~/types'

test('endpoint "subjects" returns list of all subjects for an instance', async () => {
  given('UuidQuery').for(taxonomyTermSubject)
  given('SubjectsQuery').for(taxonomyTermSubject, {
    ...taxonomyTermSubject,
    instance: Instance.En,
    id: nextUuid(taxonomyTermSubject.id),
  })

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
    .withVariables({ instance: taxonomyTermSubject.instance })
    .shouldReturnData({
      subject: {
        subjects: [{ taxonomyTerm: { name: taxonomyTermSubject.name } }],
      },
    })
})

test('`Subject.id` returns encoded id of subject', async () => {
  given('UuidQuery').for(taxonomyTermSubject)
  given('SubjectsQuery').for(taxonomyTermSubject)

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
    .withVariables({ instance: taxonomyTermSubject.instance })
    .shouldReturnData({
      subject: {
        subjects: [{ id: encodeSubjectId(taxonomyTermSubject.id) }],
      },
    })
})

test('`Subject.unrevisedEntities` returns list of unrevisedEntities', async () => {
  given('UuidQuery').for(taxonomyTermSubject, article)
  given('SubjectsQuery').for(taxonomyTermSubject)
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
    .withVariables({ instance: taxonomyTermSubject.instance })
    .shouldReturnData({
      subject: {
        subjects: [
          { unrevisedEntities: { nodes: [getTypenameAndId(article)] } },
        ],
      },
    })
})

test('AbstractEntity.subject', async () => {
  given('UuidQuery').for(article, taxonomyTermSubject)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on AbstractEntity {
              subject {
                taxonomyTerm {
                  name
                }
              }
            }
          }
        }
      `,
    })
    .withVariables({ id: article.id })
    .shouldReturnData({
      uuid: { subject: { taxonomyTerm: { name: taxonomyTermSubject.name } } },
    })
})
