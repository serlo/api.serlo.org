import { gql } from 'apollo-server'
import * as R from 'ramda'

import { license } from '../../__fixtures__/license'
import {
  solution,
  solutionAlias,
  solutionRevision,
  user,
} from '../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../__utils__/assertions'
import {
  addAliasInteraction,
  addLicenseInteraction,
  addSolutionInteraction,
  addSolutionRevisionInteraction,
  addUserInteraction,
} from '../__utils__/interactions'

describe('Solution', () => {
  test('by alias', async () => {
    await addSolutionInteraction(solution)
    await addAliasInteraction(solutionAlias)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${solutionAlias.path}"
              }
            ) {
              __typename
              ... on Solution {
                id
                trashed
                instance
                alias
                date
                currentRevision {
                  id
                }
                license {
                  id
                }
              }
            }
          }
        `,
      data: {
        uuid: {
          __typename: 'Solution',
          ...R.omit(['currentRevisionId', 'licenseId'], solution),
          currentRevision: {
            id: solution.currentRevisionId,
          },
          license: {
            id: solution.licenseId,
          },
        },
      },
    })
  })

  test('by alias (w/ license)', async () => {
    await addSolutionInteraction(solution)
    await addAliasInteraction(solutionAlias)
    await addLicenseInteraction(license)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "${solutionAlias.path}"
            }
          ) {
            __typename
            ... on Solution {
              id
              trashed
              instance
              alias
              date
              currentRevision {
                id
              }
              license {
                id
                title
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'Solution',
          ...R.omit(['currentRevisionId', 'licenseId'], solution),
          currentRevision: {
            id: solution.currentRevisionId,
          },
          license: {
            id: license.id,
            title: license.title,
          },
        },
      },
    })
  })

  test('by alias (w/ currentRevision)', async () => {
    await addSolutionInteraction(solution)
    await addAliasInteraction(solutionAlias)
    await addSolutionRevisionInteraction(solutionRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${solutionAlias.path}"
              }
            ) {
              __typename
              ... on Solution {
                id
                trashed
                instance
                alias
                date
                currentRevision {
                  id
                  content
                  changes
                }
              }
            }
          }
        `,
      data: {
        uuid: {
          __typename: 'Solution',
          ...R.omit(['currentRevisionId', 'licenseId'], solution),
          currentRevision: {
            id: solutionRevision.id,
            content: solutionRevision.content,
            changes: solutionRevision.changes,
          },
        },
      },
    })
  })

  test('by id', async () => {
    await addSolutionInteraction(solution)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${solution.id}) {
            __typename
            ... on Solution {
              id
              trashed
              alias
              instance
              date
              currentRevision {
                id
              }
              license {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'Solution',
          ...R.omit(['currentRevisionId', 'licenseId'], solution),
          currentRevision: {
            id: solutionRevision.id,
          },
          license: {
            id: license.id,
          },
        },
      },
    })
  })
})

describe('SolutionRevision', () => {
  test('by id', async () => {
    await addSolutionRevisionInteraction(solutionRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${solutionRevision.id}) {
            __typename
            ... on SolutionRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
              }
              solution {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'SolutionRevision',
          ...R.omit(['authorId', 'repositoryId'], solutionRevision),
          author: {
            id: solutionRevision.authorId,
          },
          solution: {
            id: solutionRevision.repositoryId,
          },
        },
      },
    })
  })

  test('by id (w/ author)', async () => {
    await addSolutionRevisionInteraction(solutionRevision)
    await addUserInteraction(user)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${solutionRevision.id}) {
            __typename
            ... on SolutionRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
                username
              }
              solution {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'SolutionRevision',
          ...R.omit(['authorId', 'repositoryId'], solutionRevision),
          author: {
            id: user.id,
            username: user.username,
          },
          solution: {
            id: solutionRevision.repositoryId,
          },
        },
      },
    })
  })

  test('by id (w/ solution)', async () => {
    await addSolutionRevisionInteraction(solutionRevision)
    await addSolutionInteraction(solution)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${solutionRevision.id}) {
            __typename
            ... on SolutionRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
              }
              solution {
                id
                currentRevision {
                  id
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'SolutionRevision',
          ...R.omit(['authorId', 'repositoryId'], solutionRevision),
          author: {
            id: solutionRevision.authorId,
          },
          solution: {
            id: solution.id,
            currentRevision: {
              id: solution.currentRevisionId,
            },
          },
        },
      },
    })
  })
})
