import { option as O } from 'fp-ts'
import * as t from 'io-ts'

import { executePrompt } from './ai'
import * as Database from './database'
import * as DatabaseLayer from './database-layer'
import {
  castToUuid,
  DiscriminatorType,
  EntityDecoder,
  EntityRevisionDecoder,
  PageDecoder,
  PageRevisionDecoder,
  UserDecoder,
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

export function createSerloModel({
  environment,
}: {
  environment: Environment
}) {
  const getUuid = createQuery(
    {
      type: 'UuidQuery',
      decoder: DatabaseLayer.getDecoderFor('UuidQuery'),
      enableSwr: true,
      getCurrentValue: async (payload: DatabaseLayer.Payload<'UuidQuery'>) => {
        const uuid = await DatabaseLayer.makeRequest('UuidQuery', payload)
        return isSupportedUuid(uuid) ? uuid : null
      },
      staleAfter: { days: 1 },
      maxAge: { days: 7 },
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
    environment,
  )

  async function getUuidWithCustomDecoder<
    S extends Model<'AbstractUuid'> | null,
  >({ id, decoder }: { id: number; decoder: t.Type<S, unknown> }): Promise<S> {
    return getUuid._querySpec.queryWithDecoder({ id }, decoder)
  }

  const setUuidState = createMutation({
    type: 'UuidSetStateMutation',
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
      type: 'ActiveAuthorsQuery',
      decoder: DatabaseLayer.getDecoderFor('ActiveAuthorsQuery'),
      enableSwr: true,
      getCurrentValue() {
        return DatabaseLayer.makeRequest('ActiveAuthorsQuery', undefined)
        //could be used instead but test cases need adapting:
        //return Database.activeAuthorsQuery()
      },
      staleAfter: { hours: 1 },
      getKey: () => {
        return 'de.serlo.org/api/user/active-authors'
      },
      getPayload: (key: string) => {
        if (key !== 'de.serlo.org/api/user/active-authors') return O.none
        return O.some(undefined)
      },
      examplePayload: undefined,
    },
    environment,
  )

  const getActiveReviewerIds = createQuery(
    {
      type: 'ActiveReviewersQuery',
      decoder: DatabaseLayer.getDecoderFor('ActiveReviewersQuery'),
      enableSwr: true,
      getCurrentValue() {
        return DatabaseLayer.makeRequest('ActiveReviewersQuery', undefined)
      },
      staleAfter: { hours: 1 },
      getKey: () => {
        return 'de.serlo.org/api/user/active-reviewers'
      },
      getPayload: (key: string) => {
        if (key !== 'de.serlo.org/api/user/active-reviewers') return O.none
        return O.some(undefined)
      },
      examplePayload: undefined,
    },
    environment,
  )

  const getActivityByType = createQuery(
    {
      type: 'ActivityByTypeQuery',
      decoder: DatabaseLayer.getDecoderFor('ActivityByTypeQuery'),
      enableSwr: true,
      getCurrentValue: (
        payload: DatabaseLayer.Payload<'ActivityByTypeQuery'>,
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
          key.replace('de.serlo.org/api/user/activity-by-type/', ''),
        )
        if (Number.isNaN(userId)) return O.none
        return O.some({ userId })
      },
      examplePayload: { userId: 1 },
    },
    environment,
  )

  const getPotentialSpamUsers = createRequest({
    type: 'UserPotentialSpamUsersQuery',
    decoder: DatabaseLayer.getDecoderFor('UserPotentialSpamUsersQuery'),
    getCurrentValue(
      payload: DatabaseLayer.Payload<'UserPotentialSpamUsersQuery'>,
    ) {
      return DatabaseLayer.makeRequest('UserPotentialSpamUsersQuery', payload)
    },
  })

  const deleteBots = createMutation({
    type: 'UserDeleteBotsMutation',
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
    type: 'UserDeleteRegularUsersMutation',
    decoder: DatabaseLayer.getDecoderFor('UserDeleteRegularUsersMutation'),
    mutate: (
      payload: DatabaseLayer.Payload<'UserDeleteRegularUsersMutation'>,
    ) => {
      return DatabaseLayer.makeRequest(
        'UserDeleteRegularUsersMutation',
        payload,
      )
    },
    async updateCache({ userId }, { success }) {
      if (success) {
        await getUuid._querySpec.removeCache({ payload: { id: userId } })
      }
    },
  })

  const setDescription = createMutation({
    type: 'UserSetDescriptionMutation',
    decoder: DatabaseLayer.getDecoderFor('UserSetDescriptionMutation'),
    mutate: (payload: DatabaseLayer.Payload<'UserSetDescriptionMutation'>) => {
      return Database.setUserDescription(payload.description, payload.userId)
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
    type: 'UserSetEmailMutation',
    decoder: DatabaseLayer.getDecoderFor('UserSetEmailMutation'),
    mutate(payload: DatabaseLayer.Payload<'UserSetEmailMutation'>) {
      return DatabaseLayer.makeRequest('UserSetEmailMutation', payload)
    },
  })

  const getAlias = createQuery(
    {
      type: 'AliasQuery',
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
      staleAfter: { days: 1 },
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
    environment,
  )

  const getSubjects = createQuery(
    {
      type: 'SubjectsQuery',
      decoder: DatabaseLayer.getDecoderFor('SubjectsQuery'),
      getCurrentValue: () => {
        return DatabaseLayer.makeRequest('SubjectsQuery', {})
      },
      enableSwr: true,
      staleAfter: { days: 1 },
      getKey: () => 'serlo.org/subjects',
      getPayload: (key) => {
        return key === 'serlo.org/subjects' ? O.some(undefined) : O.none
      },
      examplePayload: undefined,
    },
    environment,
  )

  const getUnrevisedEntities = createQuery(
    {
      type: 'UnrevisedEntitiesQuery',
      decoder: DatabaseLayer.getDecoderFor('UnrevisedEntitiesQuery'),
      getCurrentValue: () => {
        return DatabaseLayer.makeRequest('UnrevisedEntitiesQuery', {})
      },
      enableSwr: true,
      staleAfter: { minutes: 2 },
      maxAge: { hours: 1 },
      getKey: () => 'serlo.org/unrevised',
      getPayload: (key) => {
        return key === 'serlo.org/unrevised' ? O.some(undefined) : O.none
      },
      examplePayload: undefined,
    },
    environment,
  )

  const getUnrevisedEntitiesPerSubject = createRequest({
    type: 'getUnrevisedEntitiesPerSubject',
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
      type: 'EventQuery',
      decoder: DatabaseLayer.getDecoderFor('EventQuery'),
      async getCurrentValue(payload: DatabaseLayer.Payload<'EventQuery'>) {
        const event = await DatabaseLayer.makeRequest('EventQuery', payload)

        return isSupportedNotificationEvent(event) ? event : null
      },
      enableSwr: true,
      staleAfter: { days: 1 },
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
    environment,
  )

  const getEventsAfter = createRequest({
    type: 'getEventsAfter',
    decoder: DatabaseLayer.getDecoderFor('EventsQuery'),
    async getCurrentValue(
      payload: DatabaseLayer.Payload<'EventsQuery'> & { after: number },
    ) {
      return DatabaseLayer.makeRequest('EventsQuery', payload)
    },
  })

  const getEvents = createQuery(
    {
      type: 'EventsQuery',
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
      staleAfter: { minutes: 2 },
      maxAge: { hours: 1 },
      examplePayload: { first: 5 },
    },
    environment,
  )

  const getNotifications = createQuery(
    {
      type: 'NotificationsQuery',
      decoder: DatabaseLayer.getDecoderFor('NotificationsQuery'),
      getCurrentValue(payload: DatabaseLayer.Payload<'NotificationsQuery'>) {
        return DatabaseLayer.makeRequest('NotificationsQuery', payload)
      },
      enableSwr: true,
      staleAfter: { minutes: 1 },
      maxAge: { minutes: 10 },
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
    environment,
  )

  const setNotificationState = createMutation({
    type: 'NotificationSetStateMutation',
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
              : notification,
          )
          return { ...current, notifications }
        },
      })
    },
  })

  const getSubscriptions = createQuery(
    {
      type: 'SubjectsQuery',
      decoder: DatabaseLayer.getDecoderFor('SubscriptionsQuery'),
      enableSwr: true,
      getCurrentValue: (
        payload: DatabaseLayer.Payload<'SubscriptionsQuery'>,
      ) => {
        return DatabaseLayer.makeRequest('SubscriptionsQuery', payload)
      },
      staleAfter: { hours: 1 },
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
    environment,
  )

  const setSubscription = createMutation({
    type: 'SubscriptionSetMutation',
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
            ({ objectId }) => !ids.includes(objectId),
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

  const getThreadIds = createQuery(
    {
      type: 'ThreadsQuery',
      decoder: DatabaseLayer.getDecoderFor('ThreadsQuery'),
      async getCurrentValue(payload: DatabaseLayer.Payload<'ThreadsQuery'>) {
        return DatabaseLayer.makeRequest('ThreadsQuery', payload)
      },
      enableSwr: true,
      staleAfter: { days: 1 },
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
    environment,
  )

  const createThread = createMutation({
    type: 'ThreadCreateThreadMutation',
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
    type: 'ThreadCreateCommentMutation',
    decoder: DatabaseLayer.getDecoderFor('ThreadCreateCommentMutation'),
    async mutate(
      payload: DatabaseLayer.Payload<'ThreadCreateCommentMutation'>,
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
            if (!current || current.__typename !== DiscriminatorType.Comment)
              return
            current.childrenIds.push(value.id) // new comment on last pos in thread
            return current
          },
        })
      }
    },
  })

  const archiveThread = createMutation({
    type: 'ThreadSetThreadArchivedMutation',
    decoder: DatabaseLayer.getDecoderFor('ThreadSetThreadArchivedMutation'),
    async mutate(
      payload: DatabaseLayer.Payload<'ThreadSetThreadArchivedMutation'>,
    ) {
      return DatabaseLayer.makeRequest(
        'ThreadSetThreadArchivedMutation',
        payload,
      )
    },
    async updateCache({ ids, archived }) {
      await getUuid._querySpec.setCache({
        payloads: ids.map((id) => {
          return { id }
        }),
        getValue(current) {
          if (!current || current.__typename !== DiscriminatorType.Comment)
            return
          return {
            ...current,
            archived: ids.includes(current.id) ? archived : current.archived,
          }
        },
      })
    },
  })

  const setThreadStatus = createMutation({
    type: 'ThreadSetThreadStatusMutation',
    decoder: DatabaseLayer.getDecoderFor('ThreadSetThreadStatusMutation'),
    async mutate(
      payload: DatabaseLayer.Payload<'ThreadSetThreadStatusMutation'>,
    ) {
      return DatabaseLayer.makeRequest('ThreadSetThreadStatusMutation', payload)
    },
    async updateCache({ ids, status }) {
      await getUuid._querySpec.setCache({
        payloads: ids.map((id) => {
          return { id }
        }),
        getValue(current) {
          if (!current || current.__typename !== DiscriminatorType.Comment)
            return
          return { ...current, status }
        },
      })
    },
  })

  const createEntity = createMutation({
    type: 'EntityCreateMutation',
    decoder: DatabaseLayer.getDecoderFor('EntityCreateMutation'),
    mutate: (payload: DatabaseLayer.Payload<'EntityCreateMutation'>) => {
      return DatabaseLayer.makeRequest('EntityCreateMutation', payload)
    },
    async updateCache({ userId, input }, newEntity) {
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

        await getUnrevisedEntities._querySpec.setCache({
          payload: undefined,
          getValue(current) {
            if (!current) return
            if (
              !input.needsReview &&
              current.unrevisedEntityIds.includes(newEntity.id)
            ) {
              current.unrevisedEntityIds = current.unrevisedEntityIds.filter(
                (id) => id !== newEntity.id,
              )
            }
            if (
              input.needsReview &&
              !current.unrevisedEntityIds.includes(newEntity.id)
            ) {
              current.unrevisedEntityIds.push(newEntity.id)
            }

            return current
          },
        })

        if (input.subscribeThis) {
          await getSubscriptions._querySpec.setCache({
            payload: { userId },
            getValue(current) {
              if (!current) return

              const newEntry = {
                objectId: castToUuid(newEntity.id),
                sendEmail: input.subscribeThisByEmail,
              }

              return { subscriptions: [...current.subscriptions, newEntry] }
            },
          })
        }
      }
    },
  })

  const addEntityRevision = createMutation({
    type: 'EntityAddRevisionMutation',
    decoder: DatabaseLayer.getDecoderFor('EntityAddRevisionMutation'),
    mutate: (payload: DatabaseLayer.Payload<'EntityAddRevisionMutation'>) => {
      return DatabaseLayer.makeRequest('EntityAddRevisionMutation', payload)
    },
    updateCache: async ({ input, userId }, { success }) => {
      if (success) {
        await getUuid._querySpec.removeCache({
          payload: { id: input.entityId },
        })

        await getUnrevisedEntities._querySpec.setCache({
          payload: undefined,
          getValue(current) {
            if (!current) return
            if (
              !input.needsReview &&
              current.unrevisedEntityIds.includes(input.entityId)
            ) {
              current.unrevisedEntityIds = current.unrevisedEntityIds.filter(
                (id) => id !== input.entityId,
              )
            }
            if (
              input.needsReview &&
              !current.unrevisedEntityIds.includes(input.entityId)
            ) {
              current.unrevisedEntityIds.push(input.entityId)
            }

            return current
          },
        })

        if (input.subscribeThis) {
          await getSubscriptions._querySpec.setCache({
            payload: { userId },
            getValue(current) {
              if (!current) return

              const currentWithoutNew = current.subscriptions.filter(
                ({ objectId }) => input.entityId !== objectId,
              )

              const newEntry = {
                objectId: castToUuid(input.entityId),
                sendEmail: input.subscribeThisByEmail,
              }

              return {
                subscriptions: [...currentWithoutNew, newEntry].sort(
                  (a, b) => a.objectId - b.objectId,
                ),
              }
            },
          })
        }
      }
    },
  })

  const checkoutEntityRevision = createMutation({
    type: 'EntityCheckoutRevisionMutation',
    decoder: DatabaseLayer.getDecoderFor('EntityCheckoutRevisionMutation'),
    async mutate(
      payload: DatabaseLayer.Payload<'EntityCheckoutRevisionMutation'>,
    ) {
      return DatabaseLayer.makeRequest(
        'EntityCheckoutRevisionMutation',
        payload,
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
    type: 'PageCreateMutation',
    decoder: DatabaseLayer.getDecoderFor('PageCreateMutation'),
    mutate: (payload: DatabaseLayer.Payload<'PageCreateMutation'>) => {
      return DatabaseLayer.makeRequest('PageCreateMutation', payload)
    },
  })

  const addPageRevision = createMutation({
    type: 'PageAddRevisionMutation',
    decoder: DatabaseLayer.getDecoderFor('PageAddRevisionMutation'),
    mutate: (payload: DatabaseLayer.Payload<'PageAddRevisionMutation'>) => {
      return DatabaseLayer.makeRequest('PageAddRevisionMutation', payload)
    },
    updateCache: async ({ pageId }, { success }) => {
      if (success) {
        await getUuid._querySpec.removeCache({ payload: { id: pageId } })
      }
    },
  })

  const checkoutPageRevision = createMutation({
    type: 'PageCheckoutRevisionMutation',
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
    type: 'EntityRejectRevisionMutation',
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
    type: 'PageRejectRevisionMutation',
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

  const getDeletedEntities = createRequest({
    type: 'DeletedEntitiesQuery',
    decoder: DatabaseLayer.getDecoderFor('DeletedEntitiesQuery'),
    async getCurrentValue(
      payload: DatabaseLayer.Payload<'DeletedEntitiesQuery'>,
    ) {
      return DatabaseLayer.makeRequest('DeletedEntitiesQuery', payload)
    },
  })

  const getEntitiesMetadata = createRequest({
    type: 'EntitiesMetadataQuery',
    decoder: DatabaseLayer.getDecoderFor('EntitiesMetadataQuery'),
    async getCurrentValue(
      payload: DatabaseLayer.Payload<'EntitiesMetadataQuery'>,
    ) {
      return DatabaseLayer.makeRequest('EntitiesMetadataQuery', payload)
    },
  })

  const linkEntitiesToTaxonomy = createMutation({
    type: 'TaxonomyCreateEntityLinksMutation',
    decoder: DatabaseLayer.getDecoderFor('TaxonomyCreateEntityLinksMutation'),
    mutate: (
      payload: DatabaseLayer.Payload<'TaxonomyCreateEntityLinksMutation'>,
    ) => {
      return DatabaseLayer.makeRequest(
        'TaxonomyCreateEntityLinksMutation',
        payload,
      )
    },
    async updateCache({ taxonomyTermId, entityIds }, { success }) {
      if (success) {
        await Promise.all(
          [...entityIds, taxonomyTermId].map(
            async (id) =>
              await getUuid._querySpec.removeCache({ payload: { id } }),
          ),
        )
      }
    },
  })

  const unlinkEntitiesFromTaxonomy = createMutation({
    type: 'TaxonomyCreateEntityLinksMutation',
    decoder: DatabaseLayer.getDecoderFor('TaxonomyDeleteEntityLinksMutation'),
    mutate: (
      payload: DatabaseLayer.Payload<'TaxonomyDeleteEntityLinksMutation'>,
    ) => {
      return DatabaseLayer.makeRequest(
        'TaxonomyDeleteEntityLinksMutation',
        payload,
      )
    },
    async updateCache({ taxonomyTermId, entityIds }, { success }) {
      if (success) {
        await Promise.all(
          [...entityIds, taxonomyTermId].map(
            async (id) =>
              await getUuid._querySpec.removeCache({ payload: { id } }),
          ),
        )
      }
    },
  })

  const createTaxonomyTerm = createMutation({
    type: 'TaxonomyTermCreateMutation',
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

  const sortEntity = createMutation({
    type: 'EntitySortMutation',
    decoder: DatabaseLayer.getDecoderFor('EntitySortMutation'),
    mutate: (payload: DatabaseLayer.Payload<'EntitySortMutation'>) => {
      return DatabaseLayer.makeRequest('EntitySortMutation', payload)
    },

    async updateCache({ entityId }, { success }) {
      if (success) {
        await getUuid._querySpec.removeCache({ payload: { id: entityId } })
      }
    },
  })

  const sortTaxonomyTerm = createMutation({
    type: 'TaxonomySortMutation',
    decoder: DatabaseLayer.getDecoderFor('TaxonomySortMutation'),
    mutate: (payload: DatabaseLayer.Payload<'TaxonomySortMutation'>) => {
      return DatabaseLayer.makeRequest('TaxonomySortMutation', payload)
    },

    async updateCache({ childrenIds, taxonomyTermId }, { success }) {
      if (success) {
        await getUuid._querySpec.setCache({
          payload: { id: taxonomyTermId },
          getValue(current) {
            if (!current) return

            return { ...current, childrenIds: childrenIds.map(castToUuid) }
          },
        })
      }
    },
  })

  const setEntityLicense = createMutation({
    type: 'EntitySetLicenseMutation',
    decoder: DatabaseLayer.getDecoderFor('EntitySetLicenseMutation'),
    mutate: (payload: DatabaseLayer.Payload<'EntitySetLicenseMutation'>) => {
      return DatabaseLayer.makeRequest('EntitySetLicenseMutation', payload)
    },
    async updateCache({ entityId, licenseId }, { success }) {
      if (success) {
        await getUuid._querySpec.setCache({
          payload: { id: entityId },
          getValue(current) {
            if (!current) return
            return { ...current, licenseId }
          },
        })
      }
    },
  })

  const getPages = createRequest({
    type: 'PagesQuery',
    decoder: DatabaseLayer.getDecoderFor('PagesQuery'),
    async getCurrentValue(payload: DatabaseLayer.Payload<'PagesQuery'>) {
      return DatabaseLayer.makeRequest('PagesQuery', payload)
    },
  })

  const setTaxonomyTermNameAndDescription = createMutation({
    type: 'TaxonomyTermSetNameAndDescriptionMutation',
    decoder: DatabaseLayer.getDecoderFor(
      'TaxonomyTermSetNameAndDescriptionMutation',
    ),
    mutate: (
      payload: DatabaseLayer.Payload<'TaxonomyTermSetNameAndDescriptionMutation'>,
    ) => {
      return DatabaseLayer.makeRequest(
        'TaxonomyTermSetNameAndDescriptionMutation',
        payload,
      )
    },
    async updateCache({ id }, { success }) {
      if (success) {
        await getUuid._querySpec.removeCache({ payload: { id } })
      }
    },
  })

  const addRole = createMutation({
    type: 'UsersByRoleQuery',
    decoder: DatabaseLayer.getDecoderFor('UserAddRoleMutation'),
    mutate: (payload: DatabaseLayer.Payload<'UserAddRoleMutation'>) => {
      return DatabaseLayer.makeRequest('UserAddRoleMutation', payload)
    },
    async updateCache({ username, roleName }, { success }) {
      if (success) {
        const alias = (await DatabaseLayer.makeRequest('AliasQuery', {
          instance: Instance.De,
          path: `user/profile/${username}`,
        })) as { id: number }

        await getUuid._querySpec.setCache({
          payload: { id: alias.id },
          getValue(current) {
            if (!current) return
            if (!UserDecoder.is(current)) return

            if (current.roles.includes(roleName)) return current

            current.roles.push(roleName)

            return current
          },
        })
      }
    },
  })

  const removeRole = createMutation({
    type: 'UserRemoveRoleMutation',
    decoder: DatabaseLayer.getDecoderFor('UserRemoveRoleMutation'),
    mutate: (payload: DatabaseLayer.Payload<'UserRemoveRoleMutation'>) => {
      return DatabaseLayer.makeRequest('UserRemoveRoleMutation', payload)
    },
    async updateCache({ username, roleName }, { success }) {
      if (success) {
        const alias = (await DatabaseLayer.makeRequest('AliasQuery', {
          instance: Instance.De,
          path: `user/profile/${username}`,
        })) as { id: number }

        await getUuid._querySpec.setCache({
          payload: { id: alias.id },
          getValue(current) {
            if (!current) return
            if (!UserDecoder.is(current)) return

            if (!current.roles.includes(roleName)) return current
            current.roles = current.roles.filter(
              (currentRole) => currentRole !== roleName,
            )
            return current
          },
        })
      }
    },
  })

  const getUsersByRole = createRequest({
    type: 'UsersByRoleQuery',
    decoder: DatabaseLayer.getDecoderFor('UsersByRoleQuery'),
    async getCurrentValue(payload: DatabaseLayer.Payload<'UsersByRoleQuery'>) {
      return DatabaseLayer.makeRequest('UsersByRoleQuery', payload)
    },
  })

  return {
    addEntityRevision,
    addPageRevision,
    addRole,
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
    executePrompt,
    getActiveAuthorIds,
    getActiveReviewerIds,
    getActivityByType,
    getAlias,
    getDeletedEntities,
    getEntitiesMetadata,
    getEvents,
    getEventsAfter,
    getNotificationEvent,
    getNotifications,
    getPotentialSpamUsers,
    getSubjects,
    getSubscriptions,
    getThreadIds,
    getUnrevisedEntities,
    getUnrevisedEntitiesPerSubject,
    getUsersByRole,
    getUuid,
    getUuidWithCustomDecoder,
    linkEntitiesToTaxonomy,
    getPages,
    rejectEntityRevision,
    rejectPageRevision,
    removeRole,
    setDescription,
    setEmail,
    setEntityLicense,
    setNotificationState,
    setSubscription,
    setTaxonomyTermNameAndDescription,
    setThreadStatus,
    sortEntity,
    sortTaxonomyTerm,
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
