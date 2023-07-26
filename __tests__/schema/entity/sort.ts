import { gql } from 'apollo-server'

import {
  exerciseGroup as baseExerciseGroup,
  course as baseCouse,
  user,
  groupedExercise,
  coursePage,
} from '../../../__fixtures__'
import { castToUuid, Client, given } from '../../__utils__'

const exerciseGroup = {
  ...baseExerciseGroup,
  exerciseIds: [2219, 2220].map(castToUuid),
}

const course = {
  ...baseCouse,
  pageIds: [18521, 30713].map(castToUuid),
}

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: EntitySortInput!) {
        entity {
          sort(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ childrenIds: [2220, 2219], entityId: exerciseGroup.id })

beforeEach(() => {
  given('UuidQuery').for(user, exerciseGroup, course)
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  given('EntitySortMutation').returns({ success: true })

  await mutation.shouldReturnData({ entity: { sort: { success: true } } })
  await mutation
    .withInput({ childrenIds: [30713, 18521], entityId: course.id })
    .shouldReturnData({ entity: { sort: { success: true } } })
})

test('updates the cache of groupedExercise', async () => {
  given('EntitySortMutation').isDefinedBy((req, res, ctx) => {
    const { childrenIds } = req.body.payload

    given('UuidQuery').for({
      ...exerciseGroup,
      exerciseIds: childrenIds.map(castToUuid),
    })

    return res(ctx.json({ success: true }))
  })

  given('UuidQuery').for(
    { ...groupedExercise, id: castToUuid(2219) },
    { ...groupedExercise, id: castToUuid(2220) },
  )

  const query = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on ExerciseGroup {
              exercises {
                id
              }
            }
          }
        }
      `,
    })
    .withVariables({ id: exerciseGroup.id })

  await query.shouldReturnData({
    uuid: { exercises: [{ id: 2219 }, { id: 2220 }] },
  })

  await mutation.execute()

  await query.shouldReturnData({
    uuid: { exercises: [{ id: 2220 }, { id: 2219 }] },
  })
})

test('updates the cache of Course', async () => {
  given('EntitySortMutation').isDefinedBy((req, res, ctx) => {
    const { childrenIds } = req.body.payload

    given('UuidQuery').for({
      ...course,
      pageIds: childrenIds.map(castToUuid),
    })

    return res(ctx.json({ success: true }))
  })

  given('UuidQuery').for(
    { ...coursePage, id: castToUuid(18521) },
    { ...coursePage, id: castToUuid(30713) },
  )

  const query = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on Course {
              pages {
                id
              }
            }
          }
        }
      `,
    })
    .withVariables({ id: course.id })

  await query.shouldReturnData({
    uuid: { pages: [{ id: 18521 }, { id: 30713 }] },
  })

  await mutation
    .withInput({ childrenIds: [30713, 18521], entityId: course.id })
    .execute()

  await query.shouldReturnData({
    uuid: { pages: [{ id: 30713 }, { id: 18521 }] },
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when database layer returns a 400er response', async () => {
  given('EntitySortMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('EntitySortMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
