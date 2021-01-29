/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import {
  checkoutRevisionNotificationEvent,
  createCommentNotificationEvent,
  createEntityLinkNotificationEvent,
  createEntityNotificationEvent,
  createEntityRevisionNotificationEvent,
  createTaxonomyLinkNotificationEvent,
  createTaxonomyTermNotificationEvent,
  createThreadNotificationEvent,
  getCheckoutRevisionNotificationEventDataWithoutSubResolvers,
  getCreateCommentNotificationEventDataWithoutSubResolvers,
  getCreateEntityLinkNotificationEventDataWithoutSubResolvers,
  getCreateEntityNotificationEventDataWithoutSubResolvers,
  getCreateEntityRevisionNotificationEventDataWithoutSubResolvers,
  getCreateTaxonomyLinkNotificationEventDataWithoutSubResolvers,
  getCreateTaxonomyTermNotificationEventDataWithoutSubResolvers,
  getCreateThreadNotificationEventDataWithoutSubResolvers,
  getRejectRevisionNotificationEventDataWithoutSubResolvers,
  getRemoveEntityLinkNotificationEventDataWithoutSubResolvers,
  getRemoveTaxonomyLinkNotificationEventDataWithoutSubResolvers,
  getSetLicenseNotificationEventDataWithoutSubResolvers,
  getSetTaxonomyParentNotificationEventDataWithoutSubResolvers,
  getSetTaxonomyTermNotificationEventDataWithoutSubResolvers,
  getSetThreadStateNotificationEventDataWithoutSubResolvers,
  getSetUuidStateNotificationEventDataWithoutSubResolvers,
  rejectRevisionNotificationEvent,
  removeEntityLinkNotificationEvent,
  removeTaxonomyLinkNotificationEvent,
  setLicenseNotificationEvent,
  setTaxonomyParentNotificationEvent,
  setTaxonomyTermNotificationEvent,
  setThreadStateNotificationEvent,
  setUuidStateNotificationEvent,
} from '../../__fixtures__'
import { addJsonInteraction, assertSuccessfulGraphQLQuery } from '../__utils__'
import { AbstractNotificationEventPayload } from '~/schema/notification'

async function addNotificationEventInteraction<
  T extends Pick<AbstractNotificationEventPayload, '__typename' | 'id'>
>(body: T) {
  await addJsonInteraction({
    name: `fetch data of event with id ${body.id}`,
    given: `event ${body.id} is of type ${body.__typename}`,
    path: `/event/${body.id}`,
    body,
  })
}

test('CheckoutRevisionNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: checkoutRevisionNotificationEvent.__typename,
    id: checkoutRevisionNotificationEvent.id,
    instance: Matchers.string(checkoutRevisionNotificationEvent.instance),
    date: Matchers.iso8601DateTime(checkoutRevisionNotificationEvent.date),
    actorId: Matchers.integer(checkoutRevisionNotificationEvent.actorId),
    objectId: Matchers.integer(checkoutRevisionNotificationEvent.objectId),
    repositoryId: Matchers.integer(
      checkoutRevisionNotificationEvent.repositoryId
    ),
    revisionId: Matchers.integer(checkoutRevisionNotificationEvent.revisionId),
    reason: Matchers.string(checkoutRevisionNotificationEvent.reason),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on CheckoutRevisionNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('RejectRevisionNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: rejectRevisionNotificationEvent.__typename,
    id: rejectRevisionNotificationEvent.id,
    instance: Matchers.string(rejectRevisionNotificationEvent.instance),
    date: Matchers.iso8601DateTime(rejectRevisionNotificationEvent.date),
    actorId: Matchers.integer(rejectRevisionNotificationEvent.actorId),
    objectId: Matchers.integer(rejectRevisionNotificationEvent.objectId),
    repositoryId: Matchers.integer(
      rejectRevisionNotificationEvent.repositoryId
    ),
    revisionId: Matchers.integer(rejectRevisionNotificationEvent.revisionId),
    reason: Matchers.string(rejectRevisionNotificationEvent.reason),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on RejectRevisionNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('CreateCommentNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: createCommentNotificationEvent.__typename,
    id: createCommentNotificationEvent.id,
    instance: Matchers.string(createCommentNotificationEvent.instance),
    date: Matchers.iso8601DateTime(createCommentNotificationEvent.date),
    actorId: Matchers.integer(createCommentNotificationEvent.actorId),
    objectId: Matchers.integer(createCommentNotificationEvent.objectId),
    threadId: Matchers.integer(createCommentNotificationEvent.threadId),
    commentId: Matchers.integer(createCommentNotificationEvent.commentId),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on CreateCommentNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('CreateEntityNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: createEntityNotificationEvent.__typename,
    id: createEntityNotificationEvent.id,
    instance: Matchers.string(createEntityNotificationEvent.instance),
    date: Matchers.iso8601DateTime(createEntityNotificationEvent.date),
    actorId: Matchers.integer(createEntityNotificationEvent.actorId),
    objectId: Matchers.integer(createEntityNotificationEvent.objectId),
    entityId: Matchers.integer(createEntityNotificationEvent.entityId),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on CreateEntityNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('CreateEntityLinkNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: createEntityLinkNotificationEvent.__typename,
    id: createEntityLinkNotificationEvent.id,
    instance: Matchers.string(createEntityLinkNotificationEvent.instance),
    date: Matchers.iso8601DateTime(createEntityLinkNotificationEvent.date),
    actorId: Matchers.integer(createEntityLinkNotificationEvent.actorId),
    objectId: Matchers.integer(createEntityLinkNotificationEvent.objectId),
    parentId: Matchers.integer(createEntityLinkNotificationEvent.parentId),
    childId: Matchers.integer(createEntityLinkNotificationEvent.childId),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on CreateEntityLinkNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('RemoveEntityLinkNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: removeEntityLinkNotificationEvent.__typename,
    id: removeEntityLinkNotificationEvent.id,
    instance: Matchers.string(removeEntityLinkNotificationEvent.instance),
    date: Matchers.iso8601DateTime(removeEntityLinkNotificationEvent.date),
    actorId: Matchers.integer(removeEntityLinkNotificationEvent.actorId),
    objectId: Matchers.integer(removeEntityLinkNotificationEvent.objectId),
    childId: Matchers.integer(removeEntityLinkNotificationEvent.childId),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on RemoveEntityLinkNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('CreateEntityRevisionNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: createEntityRevisionNotificationEvent.__typename,
    id: createEntityRevisionNotificationEvent.id,
    instance: Matchers.string(createEntityRevisionNotificationEvent.instance),
    date: Matchers.iso8601DateTime(createEntityRevisionNotificationEvent.date),
    actorId: Matchers.integer(createEntityRevisionNotificationEvent.actorId),
    objectId: Matchers.integer(createEntityRevisionNotificationEvent.objectId),
    entityId: Matchers.integer(createEntityRevisionNotificationEvent.entityId),
    entityRevisionId: Matchers.integer(
      createEntityRevisionNotificationEvent.entityRevisionId
    ),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on CreateEntityRevisionNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('CreateTaxonomyTermNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: createTaxonomyTermNotificationEvent.__typename,
    id: createTaxonomyTermNotificationEvent.id,
    instance: Matchers.string(createTaxonomyTermNotificationEvent.instance),
    date: Matchers.iso8601DateTime(createTaxonomyTermNotificationEvent.date),
    actorId: Matchers.integer(createTaxonomyTermNotificationEvent.actorId),
    objectId: Matchers.integer(createTaxonomyTermNotificationEvent.objectId),
    taxonomyTermId: Matchers.integer(
      createTaxonomyTermNotificationEvent.taxonomyTermId
    ),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on CreateTaxonomyTermNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('SetTaxonomyTermNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: setTaxonomyTermNotificationEvent.__typename,
    id: setTaxonomyTermNotificationEvent.id,
    instance: Matchers.string(setTaxonomyTermNotificationEvent.instance),
    date: Matchers.iso8601DateTime(setTaxonomyTermNotificationEvent.date),
    actorId: Matchers.integer(setTaxonomyTermNotificationEvent.actorId),
    objectId: Matchers.integer(setTaxonomyTermNotificationEvent.objectId),
    taxonomyTermId: Matchers.integer(
      setTaxonomyTermNotificationEvent.taxonomyTermId
    ),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on SetTaxonomyTermNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('CreateTaxonomyLinkNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: createTaxonomyLinkNotificationEvent.__typename,
    id: createTaxonomyLinkNotificationEvent.id,
    instance: Matchers.string(createTaxonomyLinkNotificationEvent.instance),
    date: Matchers.iso8601DateTime(createTaxonomyLinkNotificationEvent.date),
    actorId: Matchers.integer(createTaxonomyLinkNotificationEvent.actorId),
    objectId: Matchers.integer(createTaxonomyLinkNotificationEvent.objectId),
    parentId: Matchers.integer(createTaxonomyLinkNotificationEvent.parentId),
    childId: Matchers.integer(createTaxonomyLinkNotificationEvent.childId),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on CreateTaxonomyLinkNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('RemoveTaxonomyLinkNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: removeTaxonomyLinkNotificationEvent.__typename,
    id: removeTaxonomyLinkNotificationEvent.id,
    instance: Matchers.string(removeTaxonomyLinkNotificationEvent.instance),
    date: Matchers.iso8601DateTime(removeTaxonomyLinkNotificationEvent.date),
    actorId: Matchers.integer(removeTaxonomyLinkNotificationEvent.actorId),
    objectId: Matchers.integer(removeTaxonomyLinkNotificationEvent.objectId),
    parentId: Matchers.integer(removeTaxonomyLinkNotificationEvent.parentId),
    childId: Matchers.integer(removeTaxonomyLinkNotificationEvent.childId),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on RemoveTaxonomyLinkNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('SetTaxonomyParentNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: setTaxonomyParentNotificationEvent.__typename,
    id: setTaxonomyParentNotificationEvent.id,
    instance: Matchers.string(setTaxonomyParentNotificationEvent.instance),
    date: Matchers.iso8601DateTime(setTaxonomyParentNotificationEvent.date),
    actorId: Matchers.integer(setTaxonomyParentNotificationEvent.actorId),
    objectId: Matchers.integer(setTaxonomyParentNotificationEvent.objectId),
    previousParentId:
      setTaxonomyParentNotificationEvent.previousParentId === null
        ? null
        : Matchers.integer(setTaxonomyParentNotificationEvent.previousParentId),
    parentId:
      setTaxonomyParentNotificationEvent.parentId === null
        ? null
        : Matchers.integer(setTaxonomyParentNotificationEvent.parentId),
    childId: Matchers.integer(setTaxonomyParentNotificationEvent.childId),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on SetTaxonomyParentNotificationEvent {
            id
            instance
            date
            objectId
          }
        }
      }
    `,
    variables: setTaxonomyParentNotificationEvent,
    data: {
      notificationEvent: getSetTaxonomyParentNotificationEventDataWithoutSubResolvers(
        setTaxonomyParentNotificationEvent
      ),
    },
  })
})

test('CreateThreadNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: createThreadNotificationEvent.__typename,
    id: createThreadNotificationEvent.id,
    instance: Matchers.string(createThreadNotificationEvent.instance),
    date: Matchers.iso8601DateTime(createThreadNotificationEvent.date),
    actorId: Matchers.integer(createThreadNotificationEvent.actorId),
    objectId: Matchers.integer(createThreadNotificationEvent.objectId),
    threadId: Matchers.integer(createThreadNotificationEvent.threadId),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on CreateThreadNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('SetLicenseNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: setLicenseNotificationEvent.__typename,
    id: setLicenseNotificationEvent.id,
    instance: Matchers.string(setLicenseNotificationEvent.instance),
    date: Matchers.iso8601DateTime(setLicenseNotificationEvent.date),
    actorId: Matchers.integer(setLicenseNotificationEvent.actorId),
    objectId: Matchers.integer(setLicenseNotificationEvent.objectId),
    repositoryId: Matchers.integer(setLicenseNotificationEvent.repositoryId),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on SetLicenseNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('SetThreadStateNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: setThreadStateNotificationEvent.__typename,
    id: setThreadStateNotificationEvent.id,
    instance: Matchers.string(setThreadStateNotificationEvent.instance),
    date: Matchers.iso8601DateTime(setThreadStateNotificationEvent.date),
    actorId: Matchers.integer(setThreadStateNotificationEvent.actorId),
    objectId: Matchers.integer(setThreadStateNotificationEvent.objectId),
    threadId: Matchers.integer(setThreadStateNotificationEvent.threadId),
    archived: Matchers.boolean(setThreadStateNotificationEvent.archived),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on SetThreadStateNotificationEvent {
            id
            instance
            date
            objectId
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
  })
})

test('SetUuidStateNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: setUuidStateNotificationEvent.__typename,
    id: setUuidStateNotificationEvent.id,
    instance: Matchers.string(setUuidStateNotificationEvent.instance),
    date: Matchers.iso8601DateTime(setUuidStateNotificationEvent.date),
    actorId: Matchers.integer(setUuidStateNotificationEvent.actorId),
    objectId: Matchers.integer(setUuidStateNotificationEvent.objectId),
    trashed: Matchers.boolean(setUuidStateNotificationEvent.trashed),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on SetUuidStateNotificationEvent {
            id
            instance
            date
            objectId
            trashed
          }
        }
      }
    `,
    variables: setUuidStateNotificationEvent,
    data: {
      notificationEvent: getSetUuidStateNotificationEventDataWithoutSubResolvers(
        setUuidStateNotificationEvent
      ),
    },
  })
})
