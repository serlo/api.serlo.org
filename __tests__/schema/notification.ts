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

import {
  article,
  articleRevision,
  checkoutRevisionNotificationEvent,
  comment,
  createCommentNotificationEvent,
  createEntityNotificationEvent,
  createEntityRevisionNotificationEvent,
  createThreadNotificationEvent,
  getArticleDataWithoutSubResolvers,
  getArticleRevisionDataWithoutSubResolvers,
  getCheckoutRevisionNotificationEventDataWithoutSubResolvers,
  getCreateCommentNotificationEventDataWithoutSubResolvers,
  getCreateEntityNotificationEventDataWithoutSubResolvers,
  getCreateEntityRevisionNotificationEventDataWithoutSubResolvers,
  getCreateThreadNotificationEventDataWithoutSubResolvers,
  getRejectRevisionNotificationEventDataWithoutSubResolvers,
  getSetThreadStateNotificationEventDataWithoutSubResolvers,
  rejectRevisionNotificationEvent,
  setThreadStateNotificationEvent,
  thread,
  user,
  setLicenseNotificationEvent,
  getSetLicenseNotificationEventDataWithoutSubResolvers,
  createEntityLinkNotificationEvent,
  getCreateEntityLinkNotificationEventDataWithoutSubResolvers,
  exercise,
  getExerciseDataWithoutSubResolvers,
  solution,
  getSolutionDataWithoutSubResolvers,
  removeEntityLinkNotificationEvent,
  getRemoveEntityLinkNotificationEventDataWithoutSubResolvers,
  createTaxonomyLinkNotificationEvent,
  getCreateTaxonomyLinkNotificationEventDataWithoutSubResolvers,
  taxonomyTermCurriculumTopic,
  getTaxonomyTermDataWithoutSubResolvers,
  removeTaxonomyLinkNotificationEvent,
  getRemoveTaxonomyLinkNotificationEventDataWithoutSubResolvers,
  createTaxonomyTermNotificationEvent,
  getCreateTaxonomyTermNotificationEventDataWithoutSubResolvers,
  setTaxonomyTermNotificationEvent,
  getSetTaxonomyTermNotificationEventDataWithoutSubResolvers,
} from '../../__fixtures__'
import { Service } from '../../src/graphql/schema/types'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createNotificationEventHandler,
  createTestClient,
  createUuidHandler,
} from '../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.Playground,
    user: null,
  }).client
})

describe('CheckoutRevisionNotification', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(checkoutRevisionNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on CheckoutRevisionNotificationEvent {
              id
              instance
              date
              reason
            }
          }
        }
      `,
      variables: checkoutRevisionNotificationEvent,
      data: {
        notificationEvent: getCheckoutRevisionNotificationEventDataWithoutSubResolvers(
          checkoutRevisionNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ reviewer)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CheckoutRevisionNotificationEvent {
              reviewer {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: checkoutRevisionNotificationEvent,
      data: {
        notificationEvent: {
          reviewer: user,
        },
      },
      client,
    })
  })

  test('by id (w/ repository)', async () => {
    global.server.use(createUuidHandler(article))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CheckoutRevisionNotificationEvent {
              repository {
                __typename
                ... on Article {
                  id
                  trashed
                  alias
                  instance
                  date
                }
              }
            }
          }
        }
      `,
      variables: checkoutRevisionNotificationEvent,
      data: {
        notificationEvent: {
          repository: getArticleDataWithoutSubResolvers(article),
        },
      },
      client,
    })
  })

  test('by id (w/ revision)', async () => {
    global.server.use(createUuidHandler(articleRevision))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CheckoutRevisionNotificationEvent {
              revision {
                __typename
                ... on ArticleRevision {
                  id
                  trashed
                  date
                  title
                  content
                  changes
                  metaTitle
                  metaDescription
                }
              }
            }
          }
        }
      `,
      variables: checkoutRevisionNotificationEvent,
      data: {
        notificationEvent: {
          revision: getArticleRevisionDataWithoutSubResolvers(articleRevision),
        },
      },
      client,
    })
  })
})

describe('RejectRevisionNotification', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(rejectRevisionNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on RejectRevisionNotificationEvent {
              id
              instance
              date
              reason
            }
          }
        }
      `,
      variables: rejectRevisionNotificationEvent,
      data: {
        notificationEvent: getRejectRevisionNotificationEventDataWithoutSubResolvers(
          rejectRevisionNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ reviewer)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on RejectRevisionNotificationEvent {
              reviewer {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: rejectRevisionNotificationEvent,
      data: {
        notificationEvent: {
          reviewer: user,
        },
      },
      client,
    })
  })

  test('by id (w/ repository)', async () => {
    global.server.use(createUuidHandler(article))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on RejectRevisionNotificationEvent {
              repository {
                __typename
                ... on Article {
                  id
                  trashed
                  alias
                  instance
                  date
                }
              }
            }
          }
        }
      `,
      variables: rejectRevisionNotificationEvent,
      data: {
        notificationEvent: {
          repository: getArticleDataWithoutSubResolvers(article),
        },
      },
      client,
    })
  })

  test('by id (w/ revision)', async () => {
    global.server.use(createUuidHandler(articleRevision))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on RejectRevisionNotificationEvent {
              revision {
                __typename
                ... on ArticleRevision {
                  id
                  trashed
                  date
                  title
                  content
                  changes
                  metaTitle
                  metaDescription
                }
              }
            }
          }
        }
      `,
      variables: rejectRevisionNotificationEvent,
      data: {
        notificationEvent: {
          revision: getArticleRevisionDataWithoutSubResolvers(articleRevision),
        },
      },
      client,
    })
  })
})

describe('CreateCommentNotificationEvent', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(createCommentNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on CreateCommentNotificationEvent {
              id
              instance
              date
            }
          }
        }
      `,
      variables: createCommentNotificationEvent,
      data: {
        notificationEvent: getCreateCommentNotificationEventDataWithoutSubResolvers(
          createCommentNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ author)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateCommentNotificationEvent {
              author {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: createCommentNotificationEvent,
      data: {
        notificationEvent: {
          author: user,
        },
      },
      client,
    })
  })

  test('by id (w/ thread)', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateCommentNotificationEvent {
              thread {
                id
              }
            }
          }
        }
      `,
      variables: createCommentNotificationEvent,
      data: {
        notificationEvent: {
          thread,
        },
      },
      client,
    })
  })

  test('by id (w/ comment)', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateCommentNotificationEvent {
              comment {
                id
              }
            }
          }
        }
      `,
      variables: createCommentNotificationEvent,
      data: {
        notificationEvent: {
          comment,
        },
      },
      client,
    })
  })
})

describe('CreateEntityNotificationEvent', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(createEntityNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on CreateEntityNotificationEvent {
              id
              instance
              date
            }
          }
        }
      `,
      variables: createEntityNotificationEvent,
      data: {
        notificationEvent: getCreateEntityNotificationEventDataWithoutSubResolvers(
          createEntityNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ author)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateEntityNotificationEvent {
              author {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: createEntityNotificationEvent,
      data: {
        notificationEvent: {
          author: user,
        },
      },
      client,
    })
  })

  test('by id (w/ entity)', async () => {
    global.server.use(createUuidHandler(article))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateEntityNotificationEvent {
              entity {
                __typename
                ... on Article {
                  id
                  trashed
                  alias
                  instance
                  date
                }
              }
            }
          }
        }
      `,
      variables: createEntityNotificationEvent,
      data: {
        notificationEvent: {
          entity: getArticleDataWithoutSubResolvers(article),
        },
      },
      client,
    })
  })
})

describe('CreateEntityLinkNotificationEvent', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(createEntityLinkNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on CreateEntityLinkNotificationEvent {
              id
              instance
              date
            }
          }
        }
      `,
      variables: createEntityLinkNotificationEvent,
      data: {
        notificationEvent: getCreateEntityLinkNotificationEventDataWithoutSubResolvers(
          createEntityLinkNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ actor)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateEntityLinkNotificationEvent {
              actor {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: createEntityLinkNotificationEvent,
      data: {
        notificationEvent: {
          actor: user,
        },
      },
      client,
    })
  })

  test('by id (w/ parent)', async () => {
    global.server.use(createUuidHandler(exercise))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateEntityLinkNotificationEvent {
              parent {
                __typename
                ... on Exercise {
                  id
                  trashed
                  alias
                  instance
                  date
                }
              }
            }
          }
        }
      `,
      variables: createEntityLinkNotificationEvent,
      data: {
        notificationEvent: {
          parent: getExerciseDataWithoutSubResolvers(exercise),
        },
      },
      client,
    })
  })

  test('by id (w/ child)', async () => {
    global.server.use(createUuidHandler(solution))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateEntityLinkNotificationEvent {
              child {
                __typename
                ... on Solution {
                  id
                  trashed
                  instance
                  alias
                  date
                }
              }
            }
          }
        }
      `,
      variables: createEntityLinkNotificationEvent,
      data: {
        notificationEvent: {
          child: getSolutionDataWithoutSubResolvers(solution),
        },
      },
      client,
    })
  })
})

describe('RemoveEntityLinkNotificationEvent', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(removeEntityLinkNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on RemoveEntityLinkNotificationEvent {
              id
              instance
              date
            }
          }
        }
      `,
      variables: removeEntityLinkNotificationEvent,
      data: {
        notificationEvent: getRemoveEntityLinkNotificationEventDataWithoutSubResolvers(
          removeEntityLinkNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ actor)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on RemoveEntityLinkNotificationEvent {
              actor {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: removeEntityLinkNotificationEvent,
      data: {
        notificationEvent: {
          actor: user,
        },
      },
      client,
    })
  })

  test('by id (w/ parent)', async () => {
    global.server.use(createUuidHandler(exercise))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on RemoveEntityLinkNotificationEvent {
              parent {
                __typename
                ... on Exercise {
                  id
                  trashed
                  alias
                  instance
                  date
                }
              }
            }
          }
        }
      `,
      variables: removeEntityLinkNotificationEvent,
      data: {
        notificationEvent: {
          parent: getExerciseDataWithoutSubResolvers(exercise),
        },
      },
      client,
    })
  })

  test('by id (w/ child)', async () => {
    global.server.use(createUuidHandler(solution))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on RemoveEntityLinkNotificationEvent {
              child {
                __typename
                ... on Solution {
                  id
                  trashed
                  instance
                  alias
                  date
                }
              }
            }
          }
        }
      `,
      variables: removeEntityLinkNotificationEvent,
      data: {
        notificationEvent: {
          child: getSolutionDataWithoutSubResolvers(solution),
        },
      },
      client,
    })
  })
})

describe('CreateEntityRevisionNotificationEvent', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(createEntityRevisionNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on CreateEntityRevisionNotificationEvent {
              id
              instance
              date
            }
          }
        }
      `,
      variables: createEntityRevisionNotificationEvent,
      data: {
        notificationEvent: getCreateEntityRevisionNotificationEventDataWithoutSubResolvers(
          createEntityRevisionNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ author)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateEntityRevisionNotificationEvent {
              author {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: createEntityRevisionNotificationEvent,
      data: {
        notificationEvent: {
          author: user,
        },
      },
      client,
    })
  })

  test('by id (w/ entity)', async () => {
    global.server.use(createUuidHandler(article))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateEntityRevisionNotificationEvent {
              entity {
                __typename
                ... on Article {
                  id
                  trashed
                  alias
                  instance
                  date
                }
              }
            }
          }
        }
      `,
      variables: createEntityRevisionNotificationEvent,
      data: {
        notificationEvent: {
          entity: getArticleDataWithoutSubResolvers(article),
        },
      },
      client,
    })
  })

  test('by id (w/ entityRevision)', async () => {
    global.server.use(createUuidHandler(articleRevision))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateEntityRevisionNotificationEvent {
              entityRevision {
                __typename
                ... on ArticleRevision {
                  id
                  trashed
                  date
                  title
                  content
                  changes
                  metaTitle
                  metaDescription
                }
              }
            }
          }
        }
      `,
      variables: createEntityRevisionNotificationEvent,
      data: {
        notificationEvent: {
          entityRevision: getArticleRevisionDataWithoutSubResolvers(
            articleRevision
          ),
        },
      },
      client,
    })
  })
})

describe('CreateTaxonomyTermNotificationEvent', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(createTaxonomyTermNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on CreateTaxonomyTermNotificationEvent {
              id
              instance
              date
            }
          }
        }
      `,
      variables: createTaxonomyTermNotificationEvent,
      data: {
        notificationEvent: getCreateTaxonomyTermNotificationEventDataWithoutSubResolvers(
          createTaxonomyTermNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ author)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateTaxonomyTermNotificationEvent {
              author {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: createTaxonomyTermNotificationEvent,
      data: {
        notificationEvent: {
          author: user,
        },
      },
      client,
    })
  })

  test('by id (w/ taxonomyTerm)', async () => {
    global.server.use(createUuidHandler(taxonomyTermCurriculumTopic))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateTaxonomyTermNotificationEvent {
              taxonomyTerm {
                __typename
                id
                type
                trashed
                instance
                alias
                name
                description
                weight
              }
            }
          }
        }
      `,
      variables: createTaxonomyTermNotificationEvent,
      data: {
        notificationEvent: {
          taxonomyTerm: getTaxonomyTermDataWithoutSubResolvers(
            taxonomyTermCurriculumTopic
          ),
        },
      },
      client,
    })
  })
})

describe('SetTaxonomyTermNotificationEvent', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(setTaxonomyTermNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on SetTaxonomyTermNotificationEvent {
              id
              instance
              date
            }
          }
        }
      `,
      variables: setTaxonomyTermNotificationEvent,
      data: {
        notificationEvent: getSetTaxonomyTermNotificationEventDataWithoutSubResolvers(
          setTaxonomyTermNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ author)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on SetTaxonomyTermNotificationEvent {
              author {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: setTaxonomyTermNotificationEvent,
      data: {
        notificationEvent: {
          author: user,
        },
      },
      client,
    })
  })

  test('by id (w/ taxonomyTerm)', async () => {
    global.server.use(createUuidHandler(taxonomyTermCurriculumTopic))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on SetTaxonomyTermNotificationEvent {
              taxonomyTerm {
                __typename
                id
                type
                trashed
                instance
                alias
                name
                description
                weight
              }
            }
          }
        }
      `,
      variables: setTaxonomyTermNotificationEvent,
      data: {
        notificationEvent: {
          taxonomyTerm: getTaxonomyTermDataWithoutSubResolvers(
            taxonomyTermCurriculumTopic
          ),
        },
      },
      client,
    })
  })
})

describe('CreateTaxonomyLinkNotificationEvent', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(createTaxonomyLinkNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on CreateTaxonomyLinkNotificationEvent {
              id
              instance
              date
            }
          }
        }
      `,
      variables: createTaxonomyLinkNotificationEvent,
      data: {
        notificationEvent: getCreateTaxonomyLinkNotificationEventDataWithoutSubResolvers(
          createTaxonomyLinkNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ actor)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateTaxonomyLinkNotificationEvent {
              actor {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: createTaxonomyLinkNotificationEvent,
      data: {
        notificationEvent: {
          actor: user,
        },
      },
      client,
    })
  })

  test('by id (w/ parent)', async () => {
    global.server.use(createUuidHandler(taxonomyTermCurriculumTopic))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateTaxonomyLinkNotificationEvent {
              parent {
                __typename
                ... on TaxonomyTerm {
                  id
                  type
                  trashed
                  instance
                  alias
                  name
                  description
                  weight
                }
              }
            }
          }
        }
      `,
      variables: createTaxonomyLinkNotificationEvent,
      data: {
        notificationEvent: {
          parent: getTaxonomyTermDataWithoutSubResolvers(
            taxonomyTermCurriculumTopic
          ),
        },
      },
      client,
    })
  })

  test('by id (w/ child)', async () => {
    global.server.use(createUuidHandler(article))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateTaxonomyLinkNotificationEvent {
              child {
                __typename
                ... on Article {
                  id
                  trashed
                  instance
                  alias
                  date
                }
              }
            }
          }
        }
      `,
      variables: createTaxonomyLinkNotificationEvent,
      data: {
        notificationEvent: {
          child: getArticleDataWithoutSubResolvers(article),
        },
      },
      client,
    })
  })
})

describe('RemoveTaxonomyLinkNotificationEvent', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(removeTaxonomyLinkNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on RemoveTaxonomyLinkNotificationEvent {
              id
              instance
              date
            }
          }
        }
      `,
      variables: removeTaxonomyLinkNotificationEvent,
      data: {
        notificationEvent: getRemoveTaxonomyLinkNotificationEventDataWithoutSubResolvers(
          removeTaxonomyLinkNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ actor)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on RemoveTaxonomyLinkNotificationEvent {
              actor {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: removeTaxonomyLinkNotificationEvent,
      data: {
        notificationEvent: {
          actor: user,
        },
      },
      client,
    })
  })

  test('by id (w/ parent)', async () => {
    global.server.use(createUuidHandler(taxonomyTermCurriculumTopic))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on RemoveTaxonomyLinkNotificationEvent {
              parent {
                __typename
                ... on TaxonomyTerm {
                  id
                  type
                  trashed
                  instance
                  alias
                  name
                  description
                  weight
                }
              }
            }
          }
        }
      `,
      variables: removeTaxonomyLinkNotificationEvent,
      data: {
        notificationEvent: {
          parent: getTaxonomyTermDataWithoutSubResolvers(
            taxonomyTermCurriculumTopic
          ),
        },
      },
      client,
    })
  })

  test('by id (w/ child)', async () => {
    global.server.use(createUuidHandler(article))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on RemoveTaxonomyLinkNotificationEvent {
              child {
                __typename
                ... on Article {
                  id
                  trashed
                  instance
                  alias
                  date
                }
              }
            }
          }
        }
      `,
      variables: removeTaxonomyLinkNotificationEvent,
      data: {
        notificationEvent: {
          child: getArticleDataWithoutSubResolvers(article),
        },
      },
      client,
    })
  })
})

describe('CreateThreadNotificationEvent', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(createThreadNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on CreateThreadNotificationEvent {
              id
              instance
              date
            }
          }
        }
      `,
      variables: createThreadNotificationEvent,
      data: {
        notificationEvent: getCreateThreadNotificationEventDataWithoutSubResolvers(
          createThreadNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ author)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateThreadNotificationEvent {
              author {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: createThreadNotificationEvent,
      data: {
        notificationEvent: {
          author: user,
        },
      },
      client,
    })
  })

  test('by id (w/ object)', async () => {
    global.server.use(createUuidHandler(article))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateThreadNotificationEvent {
              object {
                __typename
                ... on Article {
                  id
                  trashed
                  alias
                  instance
                  date
                }
              }
            }
          }
        }
      `,
      variables: createThreadNotificationEvent,
      data: {
        notificationEvent: {
          object: getArticleDataWithoutSubResolvers(article),
        },
      },
      client,
    })
  })

  test('by id (w/ thread)', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on CreateThreadNotificationEvent {
              thread {
                id
              }
            }
          }
        }
      `,
      variables: createThreadNotificationEvent,
      data: {
        notificationEvent: {
          thread,
        },
      },
      client,
    })
  })
})

describe('SetLicenseNotification', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(setLicenseNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on SetLicenseNotificationEvent {
              id
              instance
              date
            }
          }
        }
      `,
      variables: setLicenseNotificationEvent,
      data: {
        notificationEvent: getSetLicenseNotificationEventDataWithoutSubResolvers(
          setLicenseNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ actor)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on SetLicenseNotificationEvent {
              actor {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: setLicenseNotificationEvent,
      data: {
        notificationEvent: {
          actor: user,
        },
      },
      client,
    })
  })

  test('by id (w/ repository)', async () => {
    global.server.use(createUuidHandler(article))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on SetLicenseNotificationEvent {
              repository {
                __typename
                ... on Article {
                  id
                  trashed
                  alias
                  instance
                  date
                }
              }
            }
          }
        }
      `,
      variables: setLicenseNotificationEvent,
      data: {
        notificationEvent: {
          repository: getArticleDataWithoutSubResolvers(article),
        },
      },
      client,
    })
  })
})

describe('SetThreadStateNotificationEvent', () => {
  beforeEach(() => {
    global.server.use(
      createNotificationEventHandler(setThreadStateNotificationEvent)
    )
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            __typename
            ... on SetThreadStateNotificationEvent {
              id
              instance
              date
              archived
            }
          }
        }
      `,
      variables: setThreadStateNotificationEvent,
      data: {
        notificationEvent: getSetThreadStateNotificationEventDataWithoutSubResolvers(
          setThreadStateNotificationEvent
        ),
      },
      client,
    })
  })

  test('by id (w/ actor)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on SetThreadStateNotificationEvent {
              actor {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: setThreadStateNotificationEvent,
      data: {
        notificationEvent: {
          actor: user,
        },
      },
      client,
    })
  })

  test('by id (w/ thread)', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notificationEvent($id: Int!) {
          notificationEvent(id: $id) {
            ... on SetThreadStateNotificationEvent {
              thread {
                id
              }
            }
          }
        }
      `,
      variables: setThreadStateNotificationEvent,
      data: {
        notificationEvent: {
          thread,
        },
      },
      client,
    })
  })
})
