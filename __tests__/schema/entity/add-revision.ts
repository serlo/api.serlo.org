/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'

import {
  applet,
  article,
  course,
  coursePage,
  event,
  exercise,
  exerciseGroup,
  groupedExercise,
  solution,
  user,
  video,
} from '../../../__fixtures__'
import { given, givenUuids, Client, givenUuid, nextUuid } from '../../__utils__'
import { EntityRevisionType } from '~/model/decoder'

// we may find a way of dynamically testing them all

describe('addAppletRevision', () => {
  const input = {
    changes: 'changes',
    entityId: applet.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    title: 'title',
    content: 'content',
    metaTitle: 'metaTitle',
    metaDescription: 'metaDescription',
    url: 'https://url.org',
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: AddAppletRevisionInput!) {
          entity {
            addAppletRevision(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    givenUuids(user, applet)
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('EntityAddRevision')
      .withPayload({
        input,
        userId: user.id,
        revisionType: EntityRevisionType.AppletRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addAppletRevision: { success: true } },
    })
  })

  test('updates the cache', async () => {
    // TODO
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "login"', async () => {
    const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

    givenUuid(guestUser)

    await new Client({ userId: guestUser.id })
      .prepareQuery({
        query: gql`
          mutation set($input: AddAppletRevisionInput!) {
            entity {
              addAppletRevision(input: $input) {
                success
              }
            }
          }
        `,
      })
      .withVariables({ input })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('EntityAddRevision').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevision').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addArticleRevision', () => {
  const input = {
    changes: 'changes',
    entityId: article.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    title: 'title',
    content: 'content',
    metaTitle: 'metaTitle',
    metaDescription: 'metaDescription',
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: AddArticleRevisionInput!) {
          entity {
            addArticleRevision(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    givenUuids(user, article)
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('EntityAddRevision')
      .withPayload({
        input,
        userId: user.id,
        revisionType: EntityRevisionType.ArticleRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addArticleRevision: { success: true } },
    })
  })

  test('updates the cache', async () => {
    // TODO
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "login"', async () => {
    const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

    givenUuid(guestUser)

    await new Client({ userId: guestUser.id })
      .prepareQuery({
        query: gql`
          mutation set($input: AddArticleRevisionInput!) {
            entity {
              addArticleRevision(input: $input) {
                success
              }
            }
          }
        `,
      })
      .withVariables({ input })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('EntityAddRevision').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevision').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addCourseRevision', () => {
  const input = {
    changes: 'changes',
    entityId: course.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    title: 'title',
    content: 'content',
    metaDescription: 'metaDescription',
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: AddCourseRevisionInput!) {
          entity {
            addCourseRevision(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    givenUuids(user, course)
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('EntityAddRevision')
      .withPayload({
        input,
        userId: user.id,
        revisionType: EntityRevisionType.CourseRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addCourseRevision: { success: true } },
    })
  })

  test('updates the cache', async () => {
    // TODO
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "login"', async () => {
    const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

    givenUuid(guestUser)

    await new Client({ userId: guestUser.id })
      .prepareQuery({
        query: gql`
          mutation set($input: AddCourseRevisionInput!) {
            entity {
              addCourseRevision(input: $input) {
                success
              }
            }
          }
        `,
      })
      .withVariables({ input })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('EntityAddRevision').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevision').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addCoursePageRevision', () => {
  const input = {
    changes: 'changes',
    entityId: coursePage.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    title: 'title',
    content: 'content',
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: AddCoursePageRevisionInput!) {
          entity {
            addCoursePageRevision(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    givenUuids(user, coursePage)
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('EntityAddRevision')
      .withPayload({
        input,
        userId: user.id,
        revisionType: EntityRevisionType.CoursePageRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addCoursePageRevision: { success: true } },
    })
  })

  test('updates the cache', async () => {
    // TODO
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "login"', async () => {
    const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

    givenUuid(guestUser)

    await new Client({ userId: guestUser.id })
      .prepareQuery({
        query: gql`
          mutation set($input: AddCoursePageRevisionInput!) {
            entity {
              addCoursePageRevision(input: $input) {
                success
              }
            }
          }
        `,
      })
      .withVariables({ input })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('EntityAddRevision').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevision').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addEventRevision', () => {
  const input = {
    changes: 'changes',
    entityId: event.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    title: 'title',
    content: 'content',
    metaTitle: 'metaTitle',
    metaDescription: 'metaDescription',
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: AddEventRevisionInput!) {
          entity {
            addEventRevision(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    givenUuids(user, event)
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('EntityAddRevision')
      .withPayload({
        input,
        userId: user.id,
        revisionType: EntityRevisionType.EventRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addEventRevision: { success: true } },
    })
  })

  test('updates the cache', async () => {
    // TODO
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "login"', async () => {
    const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

    givenUuid(guestUser)

    await new Client({ userId: guestUser.id })
      .prepareQuery({
        query: gql`
          mutation set($input: AddEventRevisionInput!) {
            entity {
              addEventRevision(input: $input) {
                success
              }
            }
          }
        `,
      })
      .withVariables({ input })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('EntityAddRevision').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevision').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addExerciseRevision', () => {
  const input = {
    changes: 'changes',
    entityId: exercise.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    content: 'content',
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: AddGenericRevisionInput!) {
          entity {
            addExerciseRevision(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    givenUuids(user, exercise)
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('EntityAddRevision')
      .withPayload({
        input,
        userId: user.id,
        revisionType: EntityRevisionType.ExerciseRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addExerciseRevision: { success: true } },
    })
  })

  test('updates the cache', async () => {
    // TODO
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "login"', async () => {
    const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

    givenUuid(guestUser)

    await new Client({ userId: guestUser.id })
      .prepareQuery({
        query: gql`
          mutation set($input: AddGenericRevisionInput!) {
            entity {
              addExerciseRevision(input: $input) {
                success
              }
            }
          }
        `,
      })
      .withVariables({ input })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('EntityAddRevision').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevision').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addExerciseGroupRevision', () => {
  const input = {
    changes: 'changes',
    entityId: exerciseGroup.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    cohesive: false,
    content: 'content',
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: AddExerciseGroupRevisionInput!) {
          entity {
            addExerciseGroupRevision(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    givenUuids(user, exerciseGroup)
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('EntityAddRevision')
      .withPayload({
        input,
        userId: user.id,
        revisionType: EntityRevisionType.ExerciseGroupRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addExerciseGroupRevision: { success: true } },
    })
  })

  test('updates the cache', async () => {
    // TODO
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "login"', async () => {
    const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

    givenUuid(guestUser)

    await new Client({ userId: guestUser.id })
      .prepareQuery({
        query: gql`
          mutation set($input: AddExerciseGroupRevisionInput!) {
            entity {
              addExerciseGroupRevision(input: $input) {
                success
              }
            }
          }
        `,
      })
      .withVariables({ input })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('EntityAddRevision').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevision').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addGroupedExerciseRevision', () => {
  const input = {
    changes: 'changes',
    entityId: groupedExercise.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    content: 'content',
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: AddGenericRevisionInput!) {
          entity {
            addGroupedExerciseRevision(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    givenUuids(user, groupedExercise)
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('EntityAddRevision')
      .withPayload({
        input,
        userId: user.id,
        revisionType: EntityRevisionType.GroupedExerciseRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addGroupedExerciseRevision: { success: true } },
    })
  })

  test('updates the cache', async () => {
    // TODO
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "login"', async () => {
    const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

    givenUuid(guestUser)

    await new Client({ userId: guestUser.id })
      .prepareQuery({
        query: gql`
          mutation set($input: AddGenericRevisionInput!) {
            entity {
              addGroupedExerciseRevision(input: $input) {
                success
              }
            }
          }
        `,
      })
      .withVariables({ input })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('EntityAddRevision').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevision').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addSolutionRevision', () => {
  const input = {
    changes: 'changes',
    entityId: solution.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    content: 'content',
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: AddGenericRevisionInput!) {
          entity {
            addSolutionRevision(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    givenUuids(user, solution)
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('EntityAddRevision')
      .withPayload({
        input,
        userId: user.id,
        revisionType: EntityRevisionType.SolutionRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addSolutionRevision: { success: true } },
    })
  })

  test('updates the cache', async () => {
    // TODO
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "login"', async () => {
    const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

    givenUuid(guestUser)

    await new Client({ userId: guestUser.id })
      .prepareQuery({
        query: gql`
          mutation set($input: AddGenericRevisionInput!) {
            entity {
              addSolutionRevision(input: $input) {
                success
              }
            }
          }
        `,
      })
      .withVariables({ input })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('EntityAddRevision').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevision').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addVideoRevision', () => {
  const input = {
    changes: 'changes',
    entityId: video.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    title: 'title',
    content: 'content',
    description: 'description',
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: AddVideoRevisionInput!) {
          entity {
            addVideoRevision(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    givenUuids(user, video)
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('EntityAddRevision')
      .withPayload({
        input,
        userId: user.id,
        revisionType: EntityRevisionType.VideoRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addVideoRevision: { success: true } },
    })
  })

  test('updates the cache', async () => {
    // TODO
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "login"', async () => {
    const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

    givenUuid(guestUser)

    await new Client({ userId: guestUser.id })
      .prepareQuery({
        query: gql`
          mutation set($input: AddVideoRevisionInput!) {
            entity {
              addVideoRevision(input: $input) {
                success
              }
            }
          }
        `,
      })
      .withVariables({ input })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('EntityAddRevision').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevision').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})
