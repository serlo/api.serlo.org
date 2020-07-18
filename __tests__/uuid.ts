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

describe('_setApplet', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetAppletMutation({
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetAppletMutation({
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
            ... on Applet {
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

describe('_setAppletRevision', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetAppletRevisionMutation({
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetAppletRevisionMutation({
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
            ... on AppletRevision {
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

describe('_setArticle', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
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
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
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

describe('_setCourse', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetCourseMutation({
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetCourseMutation({
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
            ... on Course {
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

describe('_setCourseRevision', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetCourseRevisionMutation({
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetCourseRevisionMutation({
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
            ... on CourseRevision {
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

describe('_setCoursePage', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetCoursePageMutation({
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetCoursePageMutation({
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
            ... on CoursePage {
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

describe('_setCoursePageRevision', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetCoursePageRevisionMutation({
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetCoursePageRevisionMutation({
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
            ... on CoursePageRevision {
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

describe('_setEvent', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetEventMutation({
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetEventMutation({
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
            ... on Event {
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

describe('_setEventRevision', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetEventRevisionMutation({
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetEventRevisionMutation({
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
            ... on EventRevision {
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
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
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
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
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
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
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
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
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
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetGroupedExerciseMutation({
          id: 1,
          currentRevisionId: 2,
          licenseId: 3,
          solutionId: 4,
          parentId: 5,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetGroupedExerciseMutation({
        id: 1,
        currentRevisionId: 2,
        licenseId: 3,
        solutionId: 4,
        parentId: 5,
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
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
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

describe('_setSolution', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
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
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
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

describe('_setUser', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
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

describe('_setVideo', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetVideoMutation({
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetVideoMutation({
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
            ... on Video {
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

describe('_setVideoRevision', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        mutation: createSetVideoRevisionMutation({
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
    const { client } = createTestClient({ service: Service.Serlo, user: null })
    await assertSuccessfulGraphQLMutation({
      mutation: createSetVideoRevisionMutation({
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
            ... on VideoRevision {
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

function createSetAppletMutation({
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
          _setApplet(
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

function createSetAppletRevisionMutation({
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
          _setAppletRevision(
            id: ${id}
            trashed: false
            date: DateTime
            authorId: ${authorId}
            repositoryId: ${repositoryId}
            url: "url"
            title: "title"
            content: "content"
            changes: "changes"
            metaTitle: "metaTitle"
            metaDescription: "metaDescription"
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
            metaTitle: "metaTitle"
            metaDescription: "metaDescription"
          )
        }
      `
}

function createSetCourseMutation({
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
          _setCourse(
            id: ${id}
            trashed: false
            instance: de
            date: "date"
            currentRevisionId: ${currentRevisionId}
            licenseId: ${licenseId}
            taxonomyTermIds: []
            pageIds: []
          )
        }
      `
}

function createSetCourseRevisionMutation({
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
          _setCourseRevision(
            id: ${id}
            trashed: false
            date: DateTime
            authorId: ${authorId}
            repositoryId: ${repositoryId}
            title: "title"
            content: "content"
            changes: "changes"
            metaDescription: "metaDescription"
          )
        }
      `
}

function createSetCoursePageMutation({
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
          _setCoursePage(
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

function createSetCoursePageRevisionMutation({
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
          _setCoursePageRevision(
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

function createSetEventMutation({
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
          _setEvent(
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

function createSetEventRevisionMutation({
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
          _setEventRevision(
            id: ${id}
            trashed: false
            date: DateTime
            authorId: ${authorId}
            repositoryId: ${repositoryId}
            title: "title"
            content: "content"
            changes: "changes"
            metaTitle: "metaTitle"
            metaDescription: "metaDescription"
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
  parentId,
}: {
  id: number
  currentRevisionId: number
  licenseId: number
  solutionId: number
  parentId: number
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
            parentId: ${parentId}
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
function createSetVideoMutation({
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
          _setVideo(
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

function createSetVideoRevisionMutation({
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
          _setVideoRevision(
            id: ${id}
            trashed: false
            date: DateTime
            authorId: ${authorId}
            repositoryId: ${repositoryId}
            title: "title"
            content: "content"
            url: "url"
            changes: "changes"
          )
        }
      `
}
