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
  solutionRevision,
  user,
  video,
} from '../../../__fixtures__'
import {
  given,
  givenUuids,
  Client,
  getTypenameAndId,
  givenUuid,
  nextUuid,
  Database,
  returnsUuidsFromDatabase,
} from '../../__utils__'
import { Model } from '~/internals/graphql'
import { EntityRevisionType } from '~/model/decoder'

// we may find a way of dynamically testing them all

describe('addAppletRevision', () => {
  const fields = {
    title: 'title',
    content: 'content',
    metaTitle: 'metaTitle',
    metaDescription: 'metaDescription',
    url: 'https://url.org',
  }
  const input = {
    changes: 'changes',
    entityId: applet.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    ...fields,
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
    const {
      changes,
      entityId,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
    } = input
    given('EntityAddRevisionMutation')
      .withPayload({
        input: {
          changes,
          entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields,
        },
        userId: user.id,
        revisionType: EntityRevisionType.AppletRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addAppletRevision: { success: true } },
    })
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
    given('EntityAddRevisionMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevisionMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addArticleRevision', () => {
  const fields = {
    title: 'title',
    content: 'content',
    metaTitle: 'metaTitle',
    metaDescription: 'metaDescription',
  }

  const input = {
    changes: 'changes',
    entityId: article.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    ...fields,
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
    const {
      changes,
      entityId,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
    } = input
    given('EntityAddRevisionMutation')
      .withPayload({
        input: {
          changes,
          entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields,
        },
        userId: user.id,
        revisionType: EntityRevisionType.ArticleRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addArticleRevision: { success: true } },
    })
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
    given('EntityAddRevisionMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevisionMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addCourseRevision', () => {
  const fields = {
    title: 'title',
    content: 'content',
    metaDescription: 'metaDescription',
  }
  const input = {
    changes: 'changes',
    entityId: course.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    ...fields,
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
    const {
      changes,
      entityId,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
    } = input
    given('EntityAddRevisionMutation')
      .withPayload({
        input: {
          changes,
          entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields,
        },
        userId: user.id,
        revisionType: EntityRevisionType.CourseRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addCourseRevision: { success: true } },
    })
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
    given('EntityAddRevisionMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevisionMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addCoursePageRevision', () => {
  const fields = {
    title: 'title',
    content: 'content',
  }

  const input = {
    changes: 'changes',
    entityId: coursePage.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    ...fields,
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
    const {
      changes,
      entityId,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
    } = input
    given('EntityAddRevisionMutation')
      .withPayload({
        input: {
          changes,
          entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields,
        },
        userId: user.id,
        revisionType: EntityRevisionType.CoursePageRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addCoursePageRevision: { success: true } },
    })
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
    given('EntityAddRevisionMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevisionMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addEventRevision', () => {
  const fields = {
    title: 'title',
    content: 'content',
    metaTitle: 'metaTitle',
    metaDescription: 'metaDescription',
  }

  const input = {
    changes: 'changes',
    entityId: event.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    ...fields,
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
    const {
      changes,
      entityId,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
    } = input
    given('EntityAddRevisionMutation')
      .withPayload({
        input: {
          changes,
          entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields,
        },
        userId: user.id,
        revisionType: EntityRevisionType.EventRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addEventRevision: { success: true } },
    })
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
    given('EntityAddRevisionMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevisionMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addExerciseRevision', () => {
  const fields = {
    content: 'content',
  }

  const input = {
    changes: 'changes',
    entityId: exercise.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    ...fields,
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
    const {
      changes,
      entityId,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
    } = input
    given('EntityAddRevisionMutation')
      .withPayload({
        input: {
          changes,
          entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields,
        },
        userId: user.id,
        revisionType: EntityRevisionType.ExerciseRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addExerciseRevision: { success: true } },
    })
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
    given('EntityAddRevisionMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevisionMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addExerciseGroupRevision', () => {
  const fields = {
    cohesive: false,
    content: 'content',
  }
  const input = {
    changes: 'changes',
    entityId: exerciseGroup.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    ...fields,
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
    const {
      changes,
      entityId,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
    } = input
    given('EntityAddRevisionMutation')
      .withPayload({
        input: {
          changes,
          entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields: { ...fields, cohesive: 'false' },
        },
        userId: user.id,
        revisionType: EntityRevisionType.ExerciseGroupRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addExerciseGroupRevision: { success: true } },
    })
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
    given('EntityAddRevisionMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevisionMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addGroupedExerciseRevision', () => {
  const fields = {
    content: 'content',
  }

  const input = {
    changes: 'changes',
    entityId: groupedExercise.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    ...fields,
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
    const {
      changes,
      entityId,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
    } = input
    given('EntityAddRevisionMutation')
      .withPayload({
        input: {
          changes,
          entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields,
        },
        userId: user.id,
        revisionType: EntityRevisionType.GroupedExerciseRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addGroupedExerciseRevision: { success: true } },
    })
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
    given('EntityAddRevisionMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevisionMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addSolutionRevision', () => {
  const fields = {
    content: 'content',
  }

  const input = {
    changes: 'changes',
    entityId: solution.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    ...fields,
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
    const {
      changes,
      entityId,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
    } = input
    given('EntityAddRevisionMutation')
      .withPayload({
        input: {
          changes,
          entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields,
        },
        userId: user.id,
        revisionType: EntityRevisionType.SolutionRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addSolutionRevision: { success: true } },
    })
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
    given('EntityAddRevisionMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevisionMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('addVideoRevision', () => {
  const fields = {
    title: 'title',
    content: 'content',
    description: 'description',
  }

  const input = {
    changes: 'changes',
    entityId: video.id,
    needsReview: true,
    subscribeThis: false,
    subscribeThisByEmail: false,
    ...fields,
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
    const {
      changes,
      entityId,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
    } = input
    given('EntityAddRevisionMutation')
      .withPayload({
        input: {
          changes,
          entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields,
        },
        userId: user.id,
        revisionType: EntityRevisionType.VideoRevision,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      entity: { addVideoRevision: { success: true } },
    })
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
    given('EntityAddRevisionMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('EntityAddRevisionMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('Cache after EntityAddRevisionMutation call', () => {
  const fields = {
    content: 'content',
  }

  const input = {
    changes: 'changes',
    entityId: solution.id,
    needsReview: false,
    subscribeThis: true,
    subscribeThisByEmail: true,
    ...fields,
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

  let newSolutionRevision: Model<'SolutionRevision'>

  beforeEach(() => {
    const database = new Database()
    database.hasUuids([user, solution, solutionRevision, article])
    given('UuidQuery').isDefinedBy(returnsUuidsFromDatabase(database))

    const {
      changes,
      entityId,
      needsReview,
      subscribeThis,
      subscribeThisByEmail,
    } = input
    given('EntityAddRevisionMutation')
      .withPayload({
        input: {
          changes,
          entityId,
          needsReview,
          subscribeThis,
          subscribeThisByEmail,
          fields,
        },
        userId: user.id,
        revisionType: EntityRevisionType.SolutionRevision,
      })
      .isDefinedBy((req, res, ctx) => {
        const { input } = req.body.payload

        newSolutionRevision = {
          ...solutionRevision,
          id: nextUuid(solutionRevision.id),
        }
        database.hasUuid(newSolutionRevision)

        if (!input.needsReview) {
          database.changeUuid(solution.id, {
            currentRevisionId: newSolutionRevision.id,
          })
        }
        return res(ctx.json({ success: true }))
      })
  })

  test('updates the checked out revision when needsReview=false', async () => {
    const uuidQuery = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on Solution {
                currentRevision {
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: solution.id })

    await uuidQuery.shouldReturnData({
      uuid: { currentRevision: { id: solution.currentRevisionId } },
    })

    await mutation.withVariables({ ...input, needsReview: true }).execute()

    await uuidQuery.shouldReturnData({
      uuid: { currentRevision: { id: solution.currentRevisionId } },
    })

    await mutation.execute()

    await uuidQuery.shouldReturnData({
      uuid: { currentRevision: { id: newSolutionRevision.id } },
    })
  })

  test('updates the subscriptions', async () => {
    given('SubscriptionsQuery')
      .withPayload({ userId: user.id })
      .returns({
        subscriptions: [{ objectId: article.id, sendEmail: true }],
      })

    const subscritionsQuery = new Client({ userId: user.id }).prepareQuery({
      query: gql`
        query {
          subscription {
            getSubscriptions {
              nodes {
                object {
                  __typename
                  id
                }
                sendEmail
              }
            }
          }
        }
      `,
    })

    await subscritionsQuery.shouldReturnData({
      subscription: {
        getSubscriptions: {
          nodes: [{ object: getTypenameAndId(article), sendEmail: true }],
        },
      },
    })

    await mutation.execute()

    await subscritionsQuery.shouldReturnData({
      subscription: {
        getSubscriptions: {
          nodes: [
            { object: getTypenameAndId(article), sendEmail: true },
            { object: getTypenameAndId(solution), sendEmail: true },
          ],
        },
      },
    })
  })
})
