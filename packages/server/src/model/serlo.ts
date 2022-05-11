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
import { option as O } from 'fp-ts'
import * as t from 'io-ts'
import * as R from 'ramda'

import * as DatabaseLayer from './database-layer'
import {
  NavigationDataDecoder,
  EntityRevisionDecoder,
  EntityDecoder,
  PageRevisionDecoder,
  PageDecoder,
  castToUuid,
  TaxonomyTermDecoder,
} from './decoder'
import {
  createMutation,
  createQuery,
  createRequest,
} from '~/internals/data-source-helper'
import { Environment } from '~/internals/environment'
import { Model } from '~/internals/graphql'
import { isInstance } from '~/schema/instance/utils'
import { isSupportedNotificationEvent } from '~/schema/notification/utils'
import { isSupportedUuid } from '~/schema/uuid/abstract-uuid/utils'
import { decodePath, encodePath } from '~/schema/uuid/alias/utils'
import { Instance } from '~/types'
import { isDefined } from '~/utils'

export function createSerloModel({
  environment,
}: {
  environment: Environment
}) {
  const getUuid = createQuery(
    {
      decoder: DatabaseLayer.getDecoderFor('UuidQuery'),
      enableSwr: true,
      getCurrentValue: async (payload: DatabaseLayer.Payload<'UuidQuery'>) => {
        const uuid = await DatabaseLayer.makeRequest('UuidQuery', payload)
        return isSupportedUuid(uuid) ? uuid : null
      },
      staleAfter: { day: 1 },
      getKey: ({ id }) => {
        return `de.serlo.org/api/uuid/${id}`
      },
      getPayload: (key) => {
        if (!key.startsWith('de.serlo.org/api/uuid/')) return O.none
        const id = parseInt(key.replace('de.serlo.org/api/uuid/', ''), 10)
        return O.some({ id })
      },
      examplePayload: { id: 1 },
    },
    environment
  )

  async function getUuidWithCustomDecoder<
    S extends Model<'AbstractUuid'> | null
  >({ id, decoder }: { id: number; decoder: t.Type<S, unknown> }): Promise<S> {
    return getUuid._querySpec.queryWithDecoder({ id }, decoder)
  }

  const setUuidState = createMutation({
    decoder: DatabaseLayer.getDecoderFor('UuidSetStateMutation'),
    mutate(payload: DatabaseLayer.Payload<'UuidSetStateMutation'>) {
      return DatabaseLayer.makeRequest('UuidSetStateMutation', payload)
    },
    async updateCache({ ids, trashed }) {
      await getUuid._querySpec.setCache({
        payloads: ids.map((id) => {
          return { id }
        }),
        getValue(current) {
          if (!current || current.trashed === trashed) {
            return
          }
          return { ...current, trashed }
        },
      })
    },
  })

  const getActiveAuthorIds = createQuery(
    {
      decoder: DatabaseLayer.getDecoderFor('ActiveAuthorsQuery'),
      enableSwr: true,
      getCurrentValue() {
        return DatabaseLayer.makeRequest('ActiveAuthorsQuery', undefined)
      },
      staleAfter: { hour: 1 },
      getKey: () => {
        return 'de.serlo.org/api/user/active-authors'
      },
      getPayload: (key: string) => {
        if (key !== 'de.serlo.org/api/user/active-authors') return O.none
        return O.some(undefined)
      },
      examplePayload: undefined,
    },
    environment
  )

  const getActiveReviewerIds = createQuery(
    {
      decoder: DatabaseLayer.getDecoderFor('ActiveReviewersQuery'),
      enableSwr: true,
      getCurrentValue() {
        return DatabaseLayer.makeRequest('ActiveReviewersQuery', undefined)
      },
      staleAfter: { hour: 1 },
      getKey: () => {
        return 'de.serlo.org/api/user/active-reviewers'
      },
      getPayload: (key: string) => {
        if (key !== 'de.serlo.org/api/user/active-reviewers') return O.none
        return O.some(undefined)
      },
      examplePayload: undefined,
    },
    environment
  )

  const getActivityByType = createQuery(
    {
      decoder: DatabaseLayer.getDecoderFor('ActivityByTypeQuery'),
      enableSwr: true,
      getCurrentValue: (
        payload: DatabaseLayer.Payload<'ActivityByTypeQuery'>
      ) => {
        return DatabaseLayer.makeRequest('ActivityByTypeQuery', payload)
      },
      staleAfter: { minutes: 10 },
      getKey: ({ userId }) => {
        return `de.serlo.org/api/user/activity-by-type/${userId}`
      },
      getPayload: (key) => {
        if (!key.startsWith('de.serlo.org/api/user/activity-by-type/'))
          return O.none
        const userId = parseInt(
          key.replace('de.serlo.org/api/user/activity-by-type/', '')
        )
        if (Number.isNaN(userId)) return O.none
        return O.some({ userId })
      },
      examplePayload: { userId: 1 },
    },
    environment
  )

  const getPotentialSpamUsers = createRequest({
    decoder: DatabaseLayer.getDecoderFor('UserPotentialSpamUsersQuery'),
    getCurrentValue(
      payload: DatabaseLayer.Payload<'UserPotentialSpamUsersQuery'>
    ) {
      return DatabaseLayer.makeRequest('UserPotentialSpamUsersQuery', payload)
    },
  })

  const deleteBots = createMutation({
    decoder: DatabaseLayer.getDecoderFor('UserDeleteBotsMutation'),
    mutate(payload: DatabaseLayer.Payload<'UserDeleteBotsMutation'>) {
      return DatabaseLayer.makeRequest('UserDeleteBotsMutation', payload)
    },
    async updateCache({ botIds }) {
      await getUuid._querySpec.removeCache({
        payloads: botIds.map((id) => {
          return { id }
        }),
      })
    },
  })

  const deleteRegularUsers = createMutation({
    decoder: DatabaseLayer.getDecoderFor('UserDeleteRegularUsersMutation'),
    mutate: (
      payload: DatabaseLayer.Payload<'UserDeleteRegularUsersMutation'>
    ) => {
      return DatabaseLayer.makeRequest(
        'UserDeleteRegularUsersMutation',
        payload
      )
    },
    async updateCache({ userId }, { success }) {
      if (success) {
        await getUuid._querySpec.removeCache({ payload: { id: userId } })
      }
    },
  })

  const setDescription = createMutation({
    decoder: DatabaseLayer.getDecoderFor('UserSetDescriptionMutation'),
    mutate: (payload: DatabaseLayer.Payload<'UserSetDescriptionMutation'>) => {
      return DatabaseLayer.makeRequest('UserSetDescriptionMutation', payload)
    },
    updateCache: async ({ userId, description }, { success }) => {
      if (success) {
        await getUuid._querySpec.setCache({
          payload: { id: userId },
          getValue(current) {
            if (!current) return

            return { ...current, description: description }
          },
        })
      }
    },
  })

  const setEmail = createMutation({
    decoder: DatabaseLayer.getDecoderFor('UserSetEmailMutation'),
    mutate(payload: DatabaseLayer.Payload<'UserSetEmailMutation'>) {
      return DatabaseLayer.makeRequest('UserSetEmailMutation', payload)
    },
  })

  const getNavigationPayload = createQuery(
    {
      decoder: DatabaseLayer.getDecoderFor('NavigationQuery'),
      getCurrentValue: (payload: DatabaseLayer.Payload<'NavigationQuery'>) => {
        return DatabaseLayer.makeRequest('NavigationQuery', payload)
      },
      enableSwr: true,
      staleAfter: { hour: 1 },
      getKey: ({ instance }) => {
        return `${instance}.serlo.org/api/navigation`
      },
      getPayload: (key: string) => {
        const instance = getInstanceFromKey(key)
        return instance && key === `${instance}.serlo.org/api/navigation`
          ? O.some({ instance })
          : O.none
      },
      examplePayload: { instance: Instance.De },
    },
    environment
  )

  const getNavigation = createRequest({
    decoder: t.union([NavigationDataDecoder, t.null]),
    async getCurrentValue({
      instance,
      id,
    }: {
      instance: Instance
      id: number
    }) {
      const payload = await getNavigationPayload({ instance })
      const { data } = payload

      type NodeData = typeof data[number]

      const leaves: Record<string, number> = {}

      const findLeaves = (node: NodeData): number[] => {
        return [
          ...(node.id ? [node.id] : []),
          ...R.flatten(R.map(findLeaves, node.children || [])),
        ]
      }

      for (let i = 0; i < data.length; i++) {
        findLeaves(data[i]).forEach((id) => {
          leaves[id] = i
        })
      }

      const treeIndex = leaves[id]

      if (treeIndex === undefined) return null

      const findPathToLeaf = (node: NodeData, leaf: number): NodeData[] => {
        if (node.id !== undefined && node.id === leaf) {
          return [node]
        }

        if (node.children === undefined) return []

        const childPaths = node.children.map((childNode) => {
          return findPathToLeaf(childNode, leaf)
        })
        const goodPaths = childPaths.filter((path) => {
          return path.length > 0
        })
        if (goodPaths.length === 0) return []
        return [node, ...goodPaths[0]]
      }

      const nodes = findPathToLeaf(data[treeIndex], id)
      const path = []

      for (let i = 0; i < nodes.length; i++) {
        const nodeData = nodes[i]
        const uuid = nodeData.id ? await getUuid({ id: nodeData.id }) : null
        const node = {
          label: nodeData.label,
          url: (uuid ? uuid.alias : null) || nodeData.url || null,
          id: uuid ? uuid.id : null,
        }
        path.push(node)
      }

      return {
        data: data[treeIndex],
        path,
      }
    },
  })

  const getAlias = createQuery(
    {
      decoder: DatabaseLayer.getDecoderFor('AliasQuery'),
      getCurrentValue: ({
        path,
        instance,
      }: DatabaseLayer.Payload<'AliasQuery'>) => {
        return DatabaseLayer.makeRequest('AliasQuery', {
          instance,
          path: decodePath(path),
        })
      },
      enableSwr: true,
      staleAfter: { day: 1 },
      getKey: ({ path, instance }) => {
        const cleanPath = encodePath(decodePath(path))
        return `${instance}.serlo.org/api/alias${cleanPath}`
      },
      getPayload: (key) => {
        const instance = getInstanceFromKey(key)
        const prefix = `${instance || ''}.serlo.org/api/alias`
        return instance && key.startsWith(`${prefix}/`)
          ? O.some({ instance, path: key.replace(prefix, '') })
          : O.none
      },
      examplePayload: { path: '/math', instance: Instance.En },
    },
    environment
  )

  const getSubjects = createQuery(
    {
      decoder: DatabaseLayer.getDecoderFor('SubjectsQuery'),
      getCurrentValue: () => {
        return DatabaseLayer.makeRequest('SubjectsQuery', {})
      },
      enableSwr: true,
      staleAfter: { day: 1 },
      getKey: () => 'serlo.org/subjects',
      getPayload: (key) => {
        return key === 'serlo.org/subjects' ? O.some(undefined) : O.none
      },
      examplePayload: undefined,
    },
    environment
  )

  const getUnrevisedEntities = createQuery(
    {
      decoder: DatabaseLayer.getDecoderFor('UnrevisedEntitiesQuery'),
      getCurrentValue: () => {
        return DatabaseLayer.makeRequest('UnrevisedEntitiesQuery', {})
      },
      enableSwr: true,
      staleAfter: { minutes: 2 },
      maxAge: { hour: 1 },
      getKey: () => 'serlo.org/unrevised',
      getPayload: (key) => {
        return key === 'serlo.org/unrevised' ? O.some(undefined) : O.none
      },
      examplePayload: undefined,
    },
    environment
  )

  const getUnrevisedEntitiesPerSubject = createRequest({
    decoder: t.record(t.string, t.union([t.array(t.number), t.null])),
    async getCurrentValue(_payload: undefined) {
      const { unrevisedEntityIds } = await getUnrevisedEntities()
      const result: Record<string, number[] | null> = {}

      for (const entityId of unrevisedEntityIds) {
        const entity = await getUuidWithCustomDecoder({
          id: entityId,
          decoder: EntityDecoder,
        })
        const key = entity.canonicalSubjectId?.toString() ?? '__no_subject'

        result[key] ??= []
        result[key]?.push(entity.id)
      }

      return result
    },
  })

  const getNotificationEvent = createQuery(
    {
      decoder: DatabaseLayer.getDecoderFor('EventQuery'),
      async getCurrentValue(payload: DatabaseLayer.Payload<'EventQuery'>) {
        const event = await DatabaseLayer.makeRequest('EventQuery', payload)

        return isSupportedNotificationEvent(event) ? event : null
      },
      enableSwr: true,
      staleAfter: { day: 1 },
      getKey: ({ id }) => {
        return `de.serlo.org/api/event/${id}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/event/'
        return key.startsWith(prefix)
          ? O.some({ id: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
      examplePayload: { id: 1 },
    },
    environment
  )

  const getEventsAfter = createRequest({
    decoder: DatabaseLayer.getDecoderFor('EventsQuery'),
    async getCurrentValue(
      payload: DatabaseLayer.Payload<'EventsQuery'> & { after: number }
    ) {
      return DatabaseLayer.makeRequest('EventsQuery', payload)
    },
  })

  const getEvents = createQuery(
    {
      decoder: DatabaseLayer.getDecoderFor('EventsQuery'),
      async getCurrentValue(payload: DatabaseLayer.Payload<'EventsQuery'>) {
        return DatabaseLayer.makeRequest('EventsQuery', payload)
      },
      getKey(payload) {
        return 'serlo/events/' + JSON.stringify(payload)
      },
      getPayload(key: string) {
        if (!key.startsWith('serlo/events/')) return O.none

        try {
          const payloadJson = key.substring('serlo/events/'.length)
          const payload = JSON.parse(payloadJson) as unknown

          return DatabaseLayer.getPayloadDecoderFor('EventsQuery').is(payload)
            ? O.some(payload)
            : O.none
        } catch (e) {
          return O.none
        }
      },
      enableSwr: true,
      staleAfter: { minute: 2 },
      maxAge: { hour: 1 },
      examplePayload: { first: 5 },
    },
    environment
  )

  const getNotifications = createQuery(
    {
      decoder: DatabaseLayer.getDecoderFor('NotificationsQuery'),
      getCurrentValue(payload: DatabaseLayer.Payload<'NotificationsQuery'>) {
        return DatabaseLayer.makeRequest('NotificationsQuery', payload)
      },
      enableSwr: true,
      staleAfter: { minutes: 5 },
      maxAge: { minutes: 30 },
      getKey: ({ userId }) => {
        return `de.serlo.org/api/notifications/${userId}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/notifications/'
        return key.startsWith(prefix)
          ? O.some({ userId: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
      examplePayload: { userId: 1 },
    },
    environment
  )

  const setNotificationState = createMutation({
    decoder: DatabaseLayer.getDecoderFor('NotificationSetStateMutation'),
    mutate(payload: DatabaseLayer.Payload<'NotificationSetStateMutation'>) {
      return DatabaseLayer.makeRequest('NotificationSetStateMutation', payload)
    },
    async updateCache({ ids, userId, unread }) {
      await getNotifications._querySpec.setCache({
        payload: { userId },
        getValue(current) {
          if (!current) return

          const notifications = current.notifications.map((notification) =>
            ids.includes(notification.id)
              ? { ...notification, unread }
              : notification
          )
          return { ...current, notifications }
        },
      })
    },
  })

  const getSubscriptions = createQuery(
    {
      decoder: DatabaseLayer.getDecoderFor('SubscriptionsQuery'),
      enableSwr: true,
      getCurrentValue: (
        payload: DatabaseLayer.Payload<'SubscriptionsQuery'>
      ) => {
        return DatabaseLayer.makeRequest('SubscriptionsQuery', payload)
      },
      staleAfter: { hour: 1 },
      getKey: ({ userId }) => {
        return `de.serlo.org/api/subscriptions/${userId}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/subscriptions/'
        return key.startsWith(prefix)
          ? O.some({ userId: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
      examplePayload: { userId: 1 },
    },
    environment
  )

  const setSubscription = createMutation({
    decoder: DatabaseLayer.getDecoderFor('SubscriptionSetMutation'),
    async mutate(payload: DatabaseLayer.Payload<'SubscriptionSetMutation'>) {
      await DatabaseLayer.makeRequest('SubscriptionSetMutation', payload)
    },
    updateCache: async ({ ids, sendEmail, userId, subscribe }) => {
      await getSubscriptions._querySpec.setCache({
        payload: { userId },
        getValue(current) {
          if (!current) return

          const currentWithoutNew = current.subscriptions.filter(
            ({ objectId }) => !ids.includes(objectId)
          )

          // remove
          if (!subscribe) {
            return { subscriptions: currentWithoutNew }
          }

          // merge
          const newEntries = ids.map((objectId) => ({ objectId, sendEmail }))
          return {
            subscriptions: newEntries
              .concat(currentWithoutNew)
              .sort((a, b) => a.objectId - b.objectId),
          }
        },
      })
    },
  })

  const getAllThreads = createRequest({
    decoder: DatabaseLayer.getDecoderFor('AllThreadsQuery'),
    async getCurrentValue(payload: DatabaseLayer.Payload<'AllThreadsQuery'>) {
      return DatabaseLayer.makeRequest('AllThreadsQuery', payload)
    },
  })

  const getThreadIds = createQuery(
    {
      decoder: DatabaseLayer.getDecoderFor('ThreadsQuery'),
      async getCurrentValue(payload: DatabaseLayer.Payload<'ThreadsQuery'>) {
        return DatabaseLayer.makeRequest('ThreadsQuery', payload)
      },
      enableSwr: true,
      staleAfter: { day: 1 },
      getKey: ({ id }) => {
        return `de.serlo.org/api/threads/${id}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/threads/'
        return key.startsWith(prefix)
          ? O.some({ id: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
      examplePayload: { id: 1 },
    },
    environment
  )

  const createThread = createMutation({
    decoder: DatabaseLayer.getDecoderFor('ThreadCreateThreadMutation'),
    async mutate(payload: DatabaseLayer.Payload<'ThreadCreateThreadMutation'>) {
      return DatabaseLayer.makeRequest('ThreadCreateThreadMutation', payload)
    },
    updateCache: async (payload, value) => {
      if (value !== null) {
        await getUuid._querySpec.setCache({
          payload: { id: value.id },
          value,
        })
        await getThreadIds._querySpec.setCache({
          payload: { id: payload.objectId },
          getValue(current) {
            if (!current) return
            current.firstCommentIds.unshift(value.id) //new thread on first pos
            return current
          },
        })
      }
    },
  })

  const createComment = createMutation({
    decoder: DatabaseLayer.getDecoderFor('ThreadCreateCommentMutation'),
    async mutate(
      payload: DatabaseLayer.Payload<'ThreadCreateCommentMutation'>
    ) {
      return DatabaseLayer.makeRequest('ThreadCreateCommentMutation', payload)
    },
    async updateCache(payload, value) {
      if (value !== null) {
        await getUuid._querySpec.setCache({
          payload: { id: value.id },
          value,
        })
        await getUuid._querySpec.setCache({
          payload: { id: payload.threadId },
          getValue(current) {
            if (!current || current.__typename !== 'Comment') return
            current.childrenIds.push(value.id) // new comment on last pos in thread
            return current
          },
        })
      }
    },
  })

  const archiveThread = createMutation({
    decoder: DatabaseLayer.getDecoderFor('ThreadSetThreadArchivedMutation'),
    async mutate(
      payload: DatabaseLayer.Payload<'ThreadSetThreadArchivedMutation'>
    ) {
      return DatabaseLayer.makeRequest(
        'ThreadSetThreadArchivedMutation',
        payload
      )
    },
    async updateCache({ ids, archived }) {
      await getUuid._querySpec.setCache({
        payloads: ids.map((id) => {
          return { id }
        }),
        getValue(current) {
          if (!current || current.__typename !== 'Comment') return
          return {
            ...current,
            archived: ids.includes(current.id) ? archived : current.archived,
          }
        },
      })
    },
  })

  const createEntity = createMutation({
    decoder: DatabaseLayer.getDecoderFor('EntityCreateMutation'),
    mutate: (payload: DatabaseLayer.Payload<'EntityCreateMutation'>) => {
      return DatabaseLayer.makeRequest('EntityCreateMutation', payload)
    },
    async updateCache({ input }, newEntity) {
      if (newEntity) {
        const { parentId, taxonomyTermId } = input
        if (parentId) {
          await getUuid._querySpec.removeCache({ payload: { id: parentId } })
        }
        if (taxonomyTermId) {
          await getUuid._querySpec.removeCache({
            payload: { id: taxonomyTermId },
          })
        }
        await getUnrevisedEntities._querySpec.removeCache({
          payload: undefined,
        })
      }
    },
  })

  const addEntityRevision = createMutation({
    decoder: DatabaseLayer.getDecoderFor('EntityAddRevisionMutation'),
    mutate: (payload: DatabaseLayer.Payload<'EntityAddRevisionMutation'>) => {
      return DatabaseLayer.makeRequest('EntityAddRevisionMutation', payload)
    },
    updateCache: async ({ input, userId }, { success }) => {
      if (success) {
        await getUuid._querySpec.removeCache({
          payload: { id: input.entityId },
        })

        await getUnrevisedEntities._querySpec.removeCache({
          payload: undefined,
        })

        if (input.subscribeThis) {
          await getSubscriptions._querySpec.setCache({
            payload: { userId },
            getValue(current) {
              if (!current) return

              const currentWithoutNew = current.subscriptions.filter(
                ({ objectId }) => input.entityId !== objectId
              )

              const newEntry = {
                objectId: castToUuid(input.entityId),
                sendEmail: input.subscribeThisByEmail,
              }

              return {
                subscriptions: [...currentWithoutNew, newEntry].sort(
                  (a, b) => a.objectId - b.objectId
                ),
              }
            },
          })
        }
      }
    },
  })

  const checkoutEntityRevision = createMutation({
    decoder: DatabaseLayer.getDecoderFor('EntityCheckoutRevisionMutation'),
    async mutate(
      payload: DatabaseLayer.Payload<'EntityCheckoutRevisionMutation'>
    ) {
      return DatabaseLayer.makeRequest(
        'EntityCheckoutRevisionMutation',
        payload
      )
    },
    async updateCache({ revisionId }) {
      const revision = await getUuidWithCustomDecoder({
        id: revisionId,
        decoder: EntityRevisionDecoder,
      })

      await getUuid._querySpec.setCache({
        payload: { id: revision.repositoryId },
        getValue(current) {
          if (!EntityDecoder.is(current)) return

          current.currentRevisionId = revisionId

          return current
        },
      })

      await getUuid._querySpec.setCache({
        payload: { id: revisionId },
        getValue(current) {
          if (!EntityRevisionDecoder.is(current)) return

          return { ...current, trashed: false }
        },
      })

      await getUnrevisedEntities._querySpec.removeCache({ payload: undefined })
    },
  })

  const createPage = createMutation({
    decoder: DatabaseLayer.getDecoderFor('PageCreateMutation'),
    mutate: (payload: DatabaseLayer.Payload<'PageCreateMutation'>) => {
      return DatabaseLayer.makeRequest('PageCreateMutation', payload)
    },
  })

  const addPageRevision = createMutation({
    decoder: DatabaseLayer.getDecoderFor('PageAddRevisionMutation'),
    mutate: (payload: DatabaseLayer.Payload<'PageAddRevisionMutation'>) => {
      return DatabaseLayer.makeRequest('PageAddRevisionMutation', payload)
    },
    updateCache: async (_, { success }) => {
      if (success) {
        await getUnrevisedEntities._querySpec.removeCache({
          payload: undefined,
        })
      }
    },
  })

  const checkoutPageRevision = createMutation({
    decoder: DatabaseLayer.getDecoderFor('PageCheckoutRevisionMutation'),
    mutate(payload: DatabaseLayer.Payload<'PageCheckoutRevisionMutation'>) {
      return DatabaseLayer.makeRequest('PageCheckoutRevisionMutation', payload)
    },
    async updateCache({ revisionId }) {
      const revision = await getUuidWithCustomDecoder({
        id: revisionId,
        decoder: PageRevisionDecoder,
      })

      await getUuid._querySpec.setCache({
        payload: { id: revision.repositoryId },
        getValue(current) {
          if (!PageDecoder.is(current)) return

          current.currentRevisionId = revisionId

          return current
        },
      })

      await getUuid._querySpec.setCache({
        payload: { id: revisionId },
        getValue(current) {
          if (!PageRevisionDecoder.is(current)) return

          return { ...current, trashed: false }
        },
      })
    },
  })

  const rejectEntityRevision = createMutation({
    decoder: DatabaseLayer.getDecoderFor('EntityRejectRevisionMutation'),
    mutate(payload: DatabaseLayer.Payload<'EntityRejectRevisionMutation'>) {
      return DatabaseLayer.makeRequest('EntityRejectRevisionMutation', payload)
    },
    async updateCache({ revisionId }) {
      await getUuid._querySpec.setCache({
        payload: { id: revisionId },
        getValue(current) {
          if (!EntityRevisionDecoder.is(current)) return

          return { ...current, trashed: true }
        },
      })

      await getUnrevisedEntities._querySpec.removeCache({ payload: undefined })
    },
  })

  const rejectPageRevision = createMutation({
    decoder: DatabaseLayer.getDecoderFor('PageRejectRevisionMutation'),
    mutate(payload: DatabaseLayer.Payload<'PageRejectRevisionMutation'>) {
      return DatabaseLayer.makeRequest('PageRejectRevisionMutation', payload)
    },
    async updateCache({ revisionId }) {
      await getUuid._querySpec.setCache({
        payload: { id: revisionId },
        getValue(current) {
          if (!PageRevisionDecoder.is(current)) return

          return { ...current, trashed: true }
        },
      })
    },
  })

  const getEntitiesMetadata = createRequest({
    decoder: DatabaseLayer.getDecoderFor('EntitiesMetadataQuery'),
    async getCurrentValue(
      payload: DatabaseLayer.Payload<'EntitiesMetadataQuery'>
    ) {
      return DatabaseLayer.makeRequest('EntitiesMetadataQuery', payload)
    },
  })

  const linkEntitiesToTaxonomy = createMutation({
    decoder: DatabaseLayer.getDecoderFor('TaxonomyCreateEntityLinksMutation'),
    mutate: (
      payload: DatabaseLayer.Payload<'TaxonomyCreateEntityLinksMutation'>
    ) => {
      return DatabaseLayer.makeRequest(
        'TaxonomyCreateEntityLinksMutation',
        payload
      )
    },
    async updateCache({ taxonomyTermId, entityIds }, { success }) {
      if (success) {
        await Promise.all(
          [...entityIds, taxonomyTermId].map(
            async (id) =>
              await getUuid._querySpec.removeCache({ payload: { id } })
          )
        )
      }
    },
  })

  const unlinkEntitiesFromTaxonomy = createMutation({
    decoder: DatabaseLayer.getDecoderFor('TaxonomyDeleteEntityLinksMutation'),
    mutate: (
      payload: DatabaseLayer.Payload<'TaxonomyDeleteEntityLinksMutation'>
    ) => {
      return DatabaseLayer.makeRequest(
        'TaxonomyDeleteEntityLinksMutation',
        payload
      )
    },
    async updateCache({ taxonomyTermId, entityIds }, { success }) {
      if (success) {
        await Promise.all(
          [...entityIds, taxonomyTermId].map(
            async (id) =>
              await getUuid._querySpec.removeCache({ payload: { id } })
          )
        )
      }
    },
  })

  const createTaxonomyTerm = createMutation({
    decoder: DatabaseLayer.getDecoderFor('TaxonomyTermCreateMutation'),
    mutate: (payload: DatabaseLayer.Payload<'TaxonomyTermCreateMutation'>) => {
      return DatabaseLayer.makeRequest('TaxonomyTermCreateMutation', payload)
    },
    async updateCache({ parentId }) {
      if (parentId) {
        await getUuid._querySpec.removeCache({ payload: { id: parentId } })
      }
    },
  })

  const moveTaxonomyTerm = createMutation({
    decoder: DatabaseLayer.getDecoderFor('TaxonomyTermMoveMutation'),
    mutate: (payload: DatabaseLayer.Payload<'TaxonomyTermMoveMutation'>) => {
      return DatabaseLayer.makeRequest('TaxonomyTermMoveMutation', payload)
    },

    async updateCache({ childrenIds, destination }) {
      // the cached children still have their old parent id
      const children = await Promise.all(
        childrenIds.map((childId) =>
          getUuidWithCustomDecoder({
            id: childId,
            decoder: TaxonomyTermDecoder,
          })
        )
      )
      const oldParentIds = children.map((child) => child.parentId)

      const allAffectedTaxonomyIds = R.uniq([
        ...childrenIds,
        ...oldParentIds,
        destination,
      ]).filter(isDefined)

      await getUuid._querySpec.removeCache({
        payloads: allAffectedTaxonomyIds.map((id) => {
          return { id }
        }),
      })
    },
  })

  const setEntityLicense = createMutation({
    decoder: DatabaseLayer.getDecoderFor(
      'EntitySetLicenseMutation'
    ),
    mutate: (
      payload: DatabaseLayer.Payload<'EntitySetLicenseMutation'>
    ) => {
      return DatabaseLayer.makeRequest(
        'EntitySetLicenseMutation',
        payload
      )
    },
    async updateCache({ entityId, licenseId, userId }, { success }) {
      if (success) {
        await getUuid._querySpec.setCache({
          payload: { id: entityId},
          getValue(current) {
            if (!current) return
            /*
            if (EntityDecoder.is(current)) {
              current.licenseId = licenseId
            }
            return current

             */
            return { ...current, licenseId }
          }
        })
      }
    },
  })

  const setTaxonomyTermNameAndDescription = createMutation({
    decoder: DatabaseLayer.getDecoderFor(
      'TaxonomyTermSetNameAndDescriptionMutation'
    ),
    mutate: (
      payload: DatabaseLayer.Payload<'TaxonomyTermSetNameAndDescriptionMutation'>
    ) => {
      return DatabaseLayer.makeRequest(
        'TaxonomyTermSetNameAndDescriptionMutation',
        payload
      )
    },
    async updateCache({ id, name, description }, { success }) {
      if (success) {
        await getUuid._querySpec.setCache({
          payload: { id },
          getValue(current) {
            if (!current) return

            return { ...current, name, description }
          },
        })
      }
    },
  })

  return {
    addEntityRevision,
    addPageRevision,
    archiveThread,
    checkoutEntityRevision,
    checkoutPageRevision,
    createComment,
    createEntity,
    createPage,
    createTaxonomyTerm,
    createThread,
    deleteBots,
    deleteRegularUsers,
    getActiveAuthorIds,
    getActiveReviewerIds,
    getActivityByType,
    getAlias,
    getAllThreads,
    getEntitiesMetadata,
    getEvents,
    getEventsAfter,
    getNavigation,
    getNavigationPayload,
    getNotificationEvent,
    getNotifications,
    getPotentialSpamUsers,
    getSubjects,
    getSubscriptions,
    getThreadIds,
    getUnrevisedEntities,
    getUnrevisedEntitiesPerSubject,
    getUuid,
    getUuidWithCustomDecoder,
    linkEntitiesToTaxonomy,
    rejectEntityRevision,
    rejectPageRevision,
    setDescription,
    setEmail,
    setEntityLicense,
    setNotificationState,
    setSubscription,
    setTaxonomyTermNameAndDescription,
    moveTaxonomyTerm,
    setUuidState,
    unlinkEntitiesFromTaxonomy,
  }
}

function getInstanceFromKey(key: string): Instance | null {
  const instance = key.slice(0, 2)
  return key.startsWith(`${instance}.serlo.org`) && isInstance(instance)
    ? instance
    : null
}
