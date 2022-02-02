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
import { Matchers } from '@pact-foundation/pact'
import R from 'ramda'

import {
  applet,
  appletRevision,
  article,
  articleRevision,
  comment,
  course,
  coursePage,
  coursePageRevision,
  courseRevision,
  event,
  eventRevision,
  exercise,
  exerciseRevision,
  groupedExercise,
  groupedExerciseRevision,
  license,
  page,
  pageRevision,
  solution,
  solutionRevision,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
  user,
  video,
  videoRevision,
} from '../../__fixtures__'
import { DatabaseLayer } from '~/model'

/* eslint-disable import/no-unassigned-import */
describe('AliasMessage', () => {
  require('./alias')
})
describe('EventMessage', () => {
  require('./event')
})
describe('NavigationMessage', () => {
  require('./navigation')
})
describe('NotificationMessage', () => {
  require('./notification')
})
describe('SubjectMessage', () => {
  require('./subject')
})
describe('SubscriptionMessage', () => {
  require('./subscription')
})
describe('ThreadMessage', () => {
  require('./thread')
})
describe('UuidMessage', () => {
  require('./uuid')
})

const uuids = [
  applet,
  appletRevision,
  article,
  articleRevision,
  comment,
  course,
  courseRevision,
  coursePage,
  coursePageRevision,
  event,
  eventRevision,
  exercise,
  exerciseRevision,
  groupedExercise,
  groupedExerciseRevision,
  page,
  pageRevision,
  solution,
  solutionRevision,
  taxonomyTermRoot,
  taxonomyTermSubject,
  taxonomyTermCurriculumTopic,
  user,
  video,
  videoRevision,
]
const pactSpec: PactSpec = {
  ActiveAuthorsQuery: {
    examples: [[undefined, [user.id]]],
  },
  ActiveReviewersQuery: {
    examples: [[undefined, [user.id]]],
  },
  ActivityByTypeQuery: {
    examples: [
      [
        { userId: user.id },
        { edits: 10, comments: 11, reviews: 0, taxonomy: 3 },
      ],
    ],
  },
  LicenseQuery: {
    examples: [[{ id: 1 }, license]],
    examplePayloadForNull: { id: 100 },
  },
  UserDeleteBotsMutation: {
    examples: [],
  },
  UserSetDescriptionMutation: {
    examples: [[{ userId: 1, description: 'Hello World' }, { success: true }]],
  },
  UserSetEmailMutation: {
    examples: [
      [
        { userId: user.id, email: 'test@example.org' },
        { success: true, username: user.username },
      ],
    ],
  },
  UuidSetStateMutation: {
    examples: [
      [{ ids: [article.id], userId: user.id, trashed: true }, undefined],
    ],
  },
  UuidQuery: {
    examples: uuids.map((uuid) => [{ id: uuid.id }, uuid]),
    examplePayloadForNull: { id: 1_000_000 },
  },
}

describe.each(R.toPairs(pactSpec))('%s', (type, messageSpec) => {
  const examples = messageSpec.examples as Example[]

  if (examples.length === 0) return

  test.each(examples)('%s', async (payload, response) => {
    if (response === undefined) {
      await addInteraction({
        type,
        payload,
        responseStatus: 200,
        expectedResponse: undefined,
      })
    } else {
      const toSingletonList = (x: unknown) =>
        Array.isArray(x) ? x.slice(0, 1) : x
      await addInteraction({
        type,
        payload,
        responseStatus: 200,
        responseHeaders: { 'Content-Type': 'application/json; charset=utf-8' },
        responseBody: generalMap(toMatcher, response),
        expectedResponse: generalMap(toSingletonList, response),
      })
    }
  })

  if (R.has('examplePayloadForNull', messageSpec)) {
    test('404 response', async () => {
      await addInteraction({
        type,
        payload: messageSpec.examplePayloadForNull,
        responseStatus: 404,
        expectedResponse: null,
      })
    })
  }
})

async function addInteraction<M extends DatabaseLayer.MessageType>(arg: {
  type: M
  payload: DatabaseLayer.Payload<M>
  responseStatus: number
  expectedResponse: unknown
  responseHeaders?: Record<string, string>
  responseBody?: unknown
}) {
  const { type, payload } = arg
  const payloadJson = JSON.stringify(payload)

  await global.pact.addInteraction({
    uponReceiving: `Message ${arg.type} with payload ${payloadJson} (case ${arg.responseStatus}-response)`,
    state: undefined,
    withRequest: {
      method: 'POST',
      path: '/',
      body: { type, payload },
      headers: { 'Content-Type': 'application/json' },
    },
    willRespondWith: {
      status: arg.responseStatus,
      headers: arg.responseHeaders ?? {},
      body: arg.responseBody,
    },
  })

  const result = await DatabaseLayer.makeRequest(type, payload)

  expect(result).toEqual(arg.expectedResponse)
}

function toMatcher(value: unknown) {
  if (value == null) {
    return null
  } else if (Array.isArray(value) && value.length > 0) {
    return Matchers.eachLike(value[0])
  } else {
    return Matchers.like(value)
  }
}

function generalMap(
  func: (x: unknown) => unknown,
  value: Record<string, unknown> | Array<unknown>
): unknown {
  return Array.isArray(value)
    ? func(value)
    : R.fromPairs(R.toPairs(value).map(([key, value]) => [key, func(value)]))
}

type PactSpec = {
  [M in DatabaseLayer.MessageType]: {
    examples: Example<M>[]
  } & (DatabaseLayer.Spec[M]['canBeNull'] extends true
    ? { examplePayloadForNull: DatabaseLayer.Payload<M> }
    : unknown)
}
type Example<M extends DatabaseLayer.MessageType = DatabaseLayer.MessageType> =
  [DatabaseLayer.Payload<M>, DatabaseLayer.Response<M>]
