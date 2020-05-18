import { gql } from 'apollo-server'
import * as R from 'ramda'

import { comment, thread, threads } from '../__fixtures__/threads'
import {
  applet,
  article,
  course,
  coursePage,
  event,
  exercise,
  exerciseGroup,
  groupedExercise,
  page,
  solution,
  user,
  video,
} from '../__fixtures__/uuid'
import { DiscriminatorType, EntityType } from '../src/graphql/schema/uuid'
import { assertSuccessfulGraphQLQuery } from './__utils__/assertions'
import {
  addCommentInteraction,
  addThreadInteraction,
  addThreadsInteraction,
} from './__utils__/comments-interactions'
import {
  addAppletInteraction,
  addArticleInteraction,
  addCourseInteraction,
  addCoursePageInteraction,
  addEventInteraction,
  addExerciseGroupInteraction,
  addExerciseInteraction,
  addGroupedExerciseInteraction,
  addPageInteraction,
  addSolutionInteraction,
  addUserInteraction,
  addVideoInteraction,
} from './__utils__/interactions'

test.each([
  [
    DiscriminatorType.Page,
    {
      fixture: page,
      async setup() {
        await addPageInteraction(page)
      },
    },
  ],
  [DiscriminatorType.User, { fixture: user, async setup() {} }],
  [
    EntityType.Applet,
    {
      fixture: applet,
      async setup() {
        await addAppletInteraction(applet)
      },
    },
  ],
  [
    EntityType.Article,
    {
      fixture: article,
      async setup() {
        await addArticleInteraction(article)
      },
    },
  ],
  [
    EntityType.Applet,
    {
      fixture: applet,
      async setup() {
        await addAppletInteraction(applet)
      },
    },
  ],
  [
    EntityType.Course,
    {
      fixture: course,
      async setup() {
        await addCourseInteraction(course)
      },
    },
  ],
  [
    EntityType.CoursePage,
    {
      fixture: coursePage,
      async setup() {
        await addCoursePageInteraction(coursePage)
      },
    },
  ],
  [
    EntityType.Event,
    {
      fixture: event,
      async setup() {
        await addEventInteraction(event)
      },
    },
  ],
  [
    EntityType.Exercise,
    {
      fixture: exercise,
      async setup() {
        await addExerciseInteraction(exercise)
      },
    },
  ],
  [
    EntityType.ExerciseGroup,
    {
      fixture: exerciseGroup,
      async setup() {
        await addExerciseGroupInteraction(exerciseGroup)
      },
    },
  ],
  [
    EntityType.GroupedExercise,
    {
      fixture: groupedExercise,
      async setup() {
        await addGroupedExerciseInteraction(groupedExercise)
      },
    },
  ],
  [
    EntityType.Solution,
    {
      fixture: solution,
      async setup() {
        await addSolutionInteraction(solution)
      },
    },
  ],
  [
    EntityType.Video,
    {
      fixture: video,
      async setup() {
        await addVideoInteraction(video)
      },
    },
  ],
])('%s has threads', async (type, { fixture, setup }) => {
  await addUserInteraction(user)
  await addCommentInteraction(comment)
  await addThreadInteraction(fixture.id, thread)
  await addThreadsInteraction(fixture.id, threads)
  await setup()
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        uuid(id: ${fixture.id}) {
          ... on ${type} {
            threads {
              id
              title
              archived
              createdAt
              updatedAt
              comments {
                id
                content
                createdAt
                updatedAt
                author {
                  id
                  username
                }
              }
              uuid {
                ... on ${type} {
                  id
                }
              }
            }
          }
        }
      }
    `,
    data: {
      uuid: {
        threads: [
          {
            ...R.omit(['commentIds'], thread),
            comments: [
              {
                ...R.omit(['authorId'], comment),
                author: {
                  id: user.id,
                  username: user.username,
                },
              },
            ],
            uuid: {
              id: fixture.id,
            },
          },
        ],
      },
    },
  })
})
