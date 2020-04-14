/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'

import { Service } from '../src/graphql/schema/types'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
} from './__utils__/assertions'
import { createTestClient } from './__utils__/test-client'

describe('_setAlias', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetAliasMutation({ id: 1 }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetUserMutation({ id: 1 }),
      client,
    })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetAliasMutation({ id: 1 }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(alias: { instance: de, path: "/path" }) {
            id
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_removeUuid', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createRemoveUuidMutation({ id: 1 }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createRemoveUuidMutation({ id: 1 }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            id
          }
        }
      `,
      data: { uuid: null },
      client,
    })
  })
})

describe('_setArticle', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetArticleMutation({
          id: 1,
          currentRevisionId: 2,
          licenseId: 3,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetArticleMutation({
        id: 1,
        currentRevisionId: 2,
        licenseId: 3,
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on Article {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_setArticleRevision', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetArticleRevisionMutation({
          id: 1,
          repositoryId: 2,
          authorId: 3,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetArticleRevisionMutation({
        id: 1,
        repositoryId: 2,
        authorId: 3,
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on ArticleRevision {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_setExercise', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetExerciseMutation({
          id: 1,
          currentRevisionId: 2,
          licenseId: 3,
          solutionId: 4,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetExerciseMutation({
        id: 1,
        currentRevisionId: 2,
        licenseId: 3,
        solutionId: 4,
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on Exercise {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_setExerciseRevision', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetExerciseRevisionMutation({
          id: 1,
          repositoryId: 2,
          authorId: 3,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetExerciseRevisionMutation({
        id: 1,
        repositoryId: 2,
        authorId: 3,
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on ExerciseRevision {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_setExerciseGroup', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetExerciseGroupMutation({
          id: 1,
          currentRevisionId: 2,
          licenseId: 3,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetExerciseGroupMutation({
        id: 1,
        currentRevisionId: 2,
        licenseId: 3,
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on ExerciseGroup {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_setExerciseGroupRevision', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetExerciseGroupRevisionMutation({
          id: 1,
          repositoryId: 2,
          authorId: 3,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetExerciseGroupRevisionMutation({
        id: 1,
        repositoryId: 2,
        authorId: 3,
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on ExerciseGroupRevision {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_setGroupedExercise', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetGroupedExerciseMutation({
          id: 1,
          currentRevisionId: 2,
          licenseId: 3,
          solutionId: 4,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetGroupedExerciseMutation({
        id: 1,
        currentRevisionId: 2,
        licenseId: 3,
        solutionId: 4,
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on GroupedExercise {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_setGroupedExerciseRevision', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetGroupedExerciseRevisionMutation({
          id: 1,
          repositoryId: 2,
          authorId: 3,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetGroupedExerciseRevisionMutation({
        id: 1,
        repositoryId: 2,
        authorId: 3,
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on GroupedExerciseRevision {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_setPage', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetPageMutation({
          id: 1,
          currentRevisionId: 2,
          licenseId: 3,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetPageMutation({
        id: 1,
        currentRevisionId: 2,
        licenseId: 3,
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on Page {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_setPageRevision', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetPageRevisonMutation({
          id: 1,
          repositoryId: 2,
          authorId: 3,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetPageRevisonMutation({
        id: 1,
        repositoryId: 2,
        authorId: 3,
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on PageRevision {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_setSolution', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetSolutionMutation({
          id: 1,
          currentRevisionId: 2,
          licenseId: 3,
          parentId: 4,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetSolutionMutation({
        id: 1,
        currentRevisionId: 2,
        licenseId: 3,
        parentId: 4,
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on Solution {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_setSolutionRevision', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetSolutionRevisionMutation({
          id: 1,
          repositoryId: 2,
          authorId: 3,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetSolutionRevisionMutation({
        id: 1,
        repositoryId: 2,
        authorId: 3,
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on SolutionRevision {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_setTaxonomyTerm', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetTaxonomyTermMutation({
          id: 1,
          parentId: 2,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetTaxonomyTermMutation({
        id: 1,
        parentId: 2,
      }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on TaxonomyTerm {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

describe('_setUser', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetUserMutation({ id: 1 }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetUserMutation({ id: 1 }),
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1) {
            ... on User {
              id
            }
          }
        }
      `,
      data: {
        uuid: {
          id: 1,
        },
      },
      client,
    })
  })
})

function createSetAliasMutation({ id }: { id: number }) {
  return gql`
        mutation {
          _setAlias(
            id: ${id}
            instance: de
            path: "/path"
            source: "/source"
            timestamp: "timestamp"
          )
        }
      `
}

export function createRemoveUuidMutation({ id }: { id: number }) {
  return gql`
        mutation {
          _removeUuid(
            id: ${id}
          )
        }
      `
}

function createSetArticleMutation({
  id,
  currentRevisionId,
  licenseId,
}: {
  id: number
  currentRevisionId: number
  licenseId: number
}) {
  return gql`
        mutation {
          _setArticle(
            id: ${id}
            trashed: false
            instance: de
            date: "date"
            currentRevisionId: ${currentRevisionId}
            licenseId: ${licenseId}
            taxonomyTermIds: []
          )
        }
      `
}

function createSetArticleRevisionMutation({
  id,
  repositoryId,
  authorId,
}: {
  id: number
  repositoryId: number
  authorId: number
}) {
  return gql`
        mutation {
          _setArticleRevision(
            id: ${id}
            trashed: false
            date: DateTime
            authorId: ${authorId}
            repositoryId: ${repositoryId}
            title: "title"
            content: "content"
            changes: "changes"
          )
        }
      `
}

function createSetExerciseMutation({
  id,
  currentRevisionId,
  licenseId,
  solutionId,
}: {
  id: number
  currentRevisionId: number
  licenseId: number
  solutionId: number
}) {
  return gql`
        mutation {
          _setExercise(
            id: ${id}
            trashed: false
            instance: de
            date: "date"
            currentRevisionId: ${currentRevisionId}
            licenseId: ${licenseId}
            solutionId: ${solutionId}
            taxonomyTermIds: []
          )
        }
      `
}

function createSetExerciseRevisionMutation({
  id,
  repositoryId,
  authorId,
}: {
  id: number
  repositoryId: number
  authorId: number
}) {
  return gql`
        mutation {
          _setExerciseRevision(
            id: ${id}
            trashed: false
            date: DateTime
            authorId: ${authorId}
            repositoryId: ${repositoryId}
            content: "content"
            changes: "changes"
          )
        }
      `
}

function createSetExerciseGroupMutation({
  id,
  currentRevisionId,
  licenseId,
}: {
  id: number
  currentRevisionId: number
  licenseId: number
}) {
  return gql`
        mutation {
          _setExerciseGroup(
            id: ${id}
            trashed: false
            instance: de
            date: "date"
            currentRevisionId: ${currentRevisionId}
            licenseId: ${licenseId}
            exerciseIds: []
            taxonomyTermIds: []
          )
        }
      `
}

function createSetExerciseGroupRevisionMutation({
  id,
  repositoryId,
  authorId,
}: {
  id: number
  repositoryId: number
  authorId: number
}) {
  return gql`
        mutation {
          _setExerciseGroupRevision(
            id: ${id}
            trashed: false
            date: DateTime
            authorId: ${authorId}
            repositoryId: ${repositoryId}
            content: "content"
            changes: "changes"
          )
        }
      `
}

function createSetGroupedExerciseMutation({
  id,
  currentRevisionId,
  licenseId,
  solutionId,
}: {
  id: number
  currentRevisionId: number
  licenseId: number
  solutionId: number
}) {
  return gql`
        mutation {
          _setGroupedExercise(
            id: ${id}
            trashed: false
            instance: de
            date: "date"
            currentRevisionId: ${currentRevisionId}
            licenseId: ${licenseId}
            solutionId: ${solutionId}
          )
        }
      `
}

function createSetGroupedExerciseRevisionMutation({
  id,
  repositoryId,
  authorId,
}: {
  id: number
  repositoryId: number
  authorId: number
}) {
  return gql`
        mutation {
          _setGroupedExerciseRevision(
            id: ${id}
            trashed: false
            date: DateTime
            authorId: ${authorId}
            repositoryId: ${repositoryId}
            content: "content"
            changes: "changes"
          )
        }
      `
}

function createSetPageMutation({
  id,
  currentRevisionId,
  licenseId,
}: {
  id: number
  currentRevisionId: number
  licenseId: number
}) {
  return gql`
        mutation {
          _setPage(
            id: ${id}
            instance: de
            alias: "alias"
            trashed: false
            currentRevisionId: ${currentRevisionId}
            licenseId: ${licenseId}
          )
        }
      `
}

function createSetPageRevisonMutation({
  id,
  repositoryId,
  authorId,
}: {
  id: number
  repositoryId: number
  authorId: number
}) {
  return gql`
        mutation {
          _setPageRevision(
            id: ${id}
            trashed: false
            title: "title"
            content: "content"
            date: DateTime
            authorId: ${authorId}
            repositoryId: ${repositoryId}
          )
        }
      `
}

function createSetSolutionMutation({
  id,
  currentRevisionId,
  licenseId,
  parentId,
}: {
  id: number
  currentRevisionId: number
  licenseId: number
  parentId: number
}) {
  return gql`
        mutation {
          _setSolution(
            id: ${id}
            trashed: false
            instance: de
            date: "date"
            currentRevisionId: ${currentRevisionId}
            licenseId: ${licenseId}
            parentId: ${parentId}
          )
        }
      `
}

function createSetSolutionRevisionMutation({
  id,
  repositoryId,
  authorId,
}: {
  id: number
  repositoryId: number
  authorId: number
}) {
  return gql`
        mutation {
          _setSolutionRevision(
            id: ${id}
            trashed: false
            date: DateTime
            authorId: ${authorId}
            repositoryId: ${repositoryId}
            content: "content"
            changes: "changes"
          )
        }
      `
}

function createSetUserMutation({ id }: { id: number }) {
  return gql`
      mutation {
        _setUser(
          id: ${id}
          trashed: false
          username: "username"
          date: "date"
          lastLogin: "lastLogin"
          description: "description"
        )
      }
    `
}

function createSetTaxonomyTermMutation({
  id,
  parentId,
}: {
  id: number
  parentId: number
}) {
  return gql`
      mutation {
        _setTaxonomyTerm(
          id: ${id}
          trashed: false
          type: root
          instance: de
          alias: "alias"
          name: "name"
          description: "description"
          weight: 0
          parentId: ${parentId}
          childrenIds: []
        )
      }
    `
}
