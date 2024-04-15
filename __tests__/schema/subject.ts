import gql from 'graphql-tag'

import { article, taxonomyTermSubject } from '../../__fixtures__'
import { Client, given, getTypenameAndId, nextUuid } from '../__utils__'
import { encodeId, encodeToBase64 } from '~/internals/graphql'
import { encodeSubjectId } from '~/schema/subject/utils'
import { Instance } from '~/types'

describe('SubjectsQuery', () => {
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

  describe('endpoint "subject"', () => {
    const query = new Client().prepareQuery({
      query: gql`
        query ($id: String!) {
          subject {
            subject(id: $id) {
              taxonomyTerm {
                name
              }
            }
          }
        }
      `,
    })

    test('returns one subject', async () => {
      given('UuidQuery').for(taxonomyTermSubject)
      given('SubjectsQuery').for(taxonomyTermSubject)

      await query
        .withVariables({
          id: encodeSubjectId(taxonomyTermSubject.id),
        })
        .shouldReturnData({
          subject: {
            subject: { taxonomyTerm: { name: taxonomyTermSubject.name } },
          },
        })
    })

    test('returns null when id does not resolve to an subject', async () => {
      given('SubjectsQuery').for(taxonomyTermSubject)

      await query
        .withVariables({
          id: encodeSubjectId(nextUuid(taxonomyTermSubject.id)),
        })
        .shouldReturnData({ subject: { subject: null } })
    })

    describe('fails when id is invalid', () => {
      test.each([
        '1',
        encodeToBase64('sXYZ'),
        encodeId({ prefix: 'd', id: taxonomyTermSubject.id }),
      ])('id: %s', async (id) => {
        await query.withVariables({ id }).shouldFailWithError('BAD_USER_INPUT')
      })
    })
  })
})

describe('Subjects', () => {
  test('property "id" returns encoded id of subject', async () => {
    given('UuidQuery').for(taxonomyTermSubject)
    given('SubjectsQuery').for(taxonomyTermSubject)

    await new Client()
      .prepareQuery({
        query: gql`
          query ($id: String!) {
            subject {
              subject(id: $id) {
                id
              }
            }
          }
        `,
      })
      .withVariables({
        id: encodeSubjectId(taxonomyTermSubject.id),
      })
      .shouldReturnData({
        subject: {
          subject: {
            id: encodeSubjectId(taxonomyTermSubject.id),
          },
        },
      })
  })

  test('property "unrevisedEntities" returns list of unrevisedEntities', async () => {
    given('UuidQuery').for(article)
    given('SubjectsQuery').for(taxonomyTermSubject)
    given('UnrevisedEntitiesQuery').for(article)

    await new Client()
      .prepareQuery({
        query: gql`
          query ($id: String!) {
            subject {
              subject(id: $id) {
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
      .withVariables({
        id: encodeSubjectId(taxonomyTermSubject.id),
      })
      .shouldReturnData({
        subject: {
          subject: {
            unrevisedEntities: { nodes: [getTypenameAndId(article)] },
          },
        },
      })
  })
})
