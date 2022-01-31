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
describe('UserMessage', () => {
  require('./user')
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
  LicenseQuery: {
    examples: [[{ id: 1 }, license]],
    examplePayloadForNull: { id: 100 },
  },
  UserSetDescriptionMutation: {
    examples: [[{ userId: 1, description: 'Hello World' }, { success: true }]],
  },
  UuidQuery: {
    examples: uuids.map((uuid) => [{ id: uuid.id }, uuid]),
    examplePayloadForNull: { id: 1_000_000 },
  },
}

describe.each(R.toPairs(pactSpec))('%s', (message, messageSpec) => {
  const examples = messageSpec.examples as Example[]
  test.each(examples)('%s', async (payload, response) => {
    await addSerloMessageInteraction({
      message,
      payload,
      responseStatus: 200,
      response,
    })
  })

  if (R.has('examplePayloadForNull', messageSpec)) {
    test('404 response', async () => {
      await addSerloMessageInteraction({
        message,
        payload: messageSpec.examplePayloadForNull,
        responseStatus: 404,
        response: null,
      })
    })
  }
})

async function addSerloMessageInteraction<M extends DatabaseLayer.Message>({
  message,
  payload,
  responseStatus,
  response,
}: {
  message: M
  payload: DatabaseLayer.Payload<M>
} & (
  | { responseStatus: 200; response: DatabaseLayer.Response<M> }
  | { responseStatus: 404; response: null }
)) {
  await global.pact.addInteraction({
    uponReceiving: `Message ${message} with payload ${JSON.stringify(
      payload
    )} (case ${responseStatus}-response)`,
    state: undefined,
    withRequest: {
      method: 'POST',
      path: '/',
      body: { type: message, payload },
      headers: { 'Content-Type': 'application/json' },
    },
    willRespondWith: {
      status: responseStatus,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body:
        responseStatus === 200 ? Matchers.like(response) : JSON.stringify(null),
    },
  })

  const result = await DatabaseLayer.makeRequest({ message, payload })

  expect(result).toEqual(response)
}

type PactSpec = {
  [M in DatabaseLayer.Message]: {
    examples: Example<M>[]
  } & (DatabaseLayer.Spec[M]['canBeNull'] extends true
    ? { examplePayloadForNull: DatabaseLayer.Payload<M> }
    : unknown)
}
type Example<M extends DatabaseLayer.Message = DatabaseLayer.Message> = [
  DatabaseLayer.Payload<M>,
  DatabaseLayer.Response<M>
]
