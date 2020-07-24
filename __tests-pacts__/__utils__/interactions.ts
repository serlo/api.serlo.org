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
import { Matchers } from '@pact-foundation/pact'

import {
  AliasPayload,
  ArticlePayload,
  ExerciseGroupPayload,
  ExerciseGroupRevisionPayload,
  ExercisePayload,
  ExerciseRevisionPayload,
  GroupedExercisePayload,
  GroupedExerciseRevisionPayload,
  NavigationPayload,
  NotificationEventPayload,
  NotificationsPayload,
  PagePayload,
  PageRevisionPayload,
  SolutionPayload,
  SolutionRevisionPayload,
  TaxonomyTermPayload,
  UserPayload,
  UuidPayload,
  VideoPayload,
  VideoRevisionPayload,
} from '../../src/graphql/schema'
import { License } from '../../src/types'

export function addNavigationInteraction(payload: NavigationPayload) {
  return addJsonInteraction({
    name: `fetch data of navigation`,
    given: '',
    path: `/api/navigation`,
    body: {
      data: Matchers.eachLike({
        label: Matchers.string(payload.data[0].label),
        id: Matchers.integer(payload.data[0].id),
        children: Matchers.eachLike({
          label: Matchers.string(payload.data[0].children?.[0].label),
          id: Matchers.integer(payload.data[0].children?.[0].id),
        }),
      }),
    },
  })
}

export function addLicenseInteraction(payload: License) {
  return addJsonInteraction({
    name: `fetch data of license with id ${payload.id}`,
    given: `there exists an license with id ${payload.id}`,
    path: `/api/license/${payload.id}`,
    body: {
      id: 1,
      instance: Matchers.string(payload.instance),
      default: Matchers.boolean(payload.default),
      title: Matchers.string(payload.title),
      url: Matchers.string(payload.url),
      content: Matchers.string(payload.content),
      agreement: Matchers.string(payload.agreement),
      iconHref: Matchers.string(payload.iconHref),
    },
  })
}
export function addNotificationEventInteraction(
  payload: NotificationEventPayload
) {
  return addJsonInteraction({
    name: `fetch data of event with id ${payload.id}`,
    given: `there exists a notification event with id ${payload.id}`,
    path: `/api/event/${payload.id}`,
    body: {
      id: 1,
      type: Matchers.string(payload.type),
      instance: Matchers.string(payload.instance),
      date: Matchers.string(payload.date),
      actorId: Matchers.integer(payload.actorId),
      objectId: Matchers.integer(payload.objectId),
      payload: Matchers.string(payload.payload),
    },
  })
}

export function addNotificationsInteraction(payload: NotificationsPayload) {
  return addJsonInteraction({
    name: `fetch data of all notifications for user with id ${payload.userId}`,
    given: `there exists a notification for user with id ${payload.userId}`,
    path: `/api/notifications/${payload.userId}`,
    body: {
      userId: 2,
      notifications:
        payload.notifications.length > 0
          ? Matchers.eachLike(Matchers.like(payload.notifications[0]))
          : [],
    },
  })
}

export function addAliasInteraction(payload: AliasPayload) {
  return addJsonInteraction({
    name: `fetch data of alias ${payload.path}`,
    given: `${payload.path} is alias of ${payload.source}`,
    path: `/api/alias${payload.path}`,
    body: {
      id: payload.id,
      instance: Matchers.string(payload.instance),
      path: payload.path,
      source: payload.source,
      timestamp: Matchers.iso8601DateTime(payload.timestamp),
    },
  })
}

export function addArticleInteraction(payload: ArticlePayload) {
  return addUuidInteraction<ArticlePayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    instance: Matchers.string(payload.instance),
    alias: payload.alias ? Matchers.string(payload.alias) : null,
    date: Matchers.iso8601DateTime(payload.date),
    currentRevisionId: payload.currentRevisionId
      ? Matchers.integer(payload.currentRevisionId)
      : null,
    licenseId: Matchers.integer(payload.licenseId),
    taxonomyTermIds:
      payload.taxonomyTermIds.length > 0
        ? Matchers.eachLike(Matchers.like(payload.taxonomyTermIds[0]))
        : [],
  })
}

export function addExerciseInteraction(payload: ExercisePayload) {
  return addUuidInteraction<ExercisePayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    instance: Matchers.string(payload.instance),
    alias: payload.alias ? Matchers.string(payload.alias) : null,
    date: Matchers.iso8601DateTime(payload.date),
    currentRevisionId: payload.currentRevisionId
      ? Matchers.integer(payload.currentRevisionId)
      : null,
    licenseId: Matchers.integer(payload.licenseId),
    solutionId: payload.solutionId
      ? Matchers.integer(payload.solutionId)
      : null,
    taxonomyTermIds:
      payload.taxonomyTermIds.length > 0
        ? Matchers.eachLike(Matchers.like(payload.taxonomyTermIds[0]))
        : [],
  })
}

export function addExerciseRevisionInteraction(
  payload: ExerciseRevisionPayload
) {
  return addUuidInteraction<ExerciseRevisionPayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    content: Matchers.string(payload.content),
    changes: Matchers.string(payload.changes),
  })
}

export function addExerciseGroupInteraction(payload: ExerciseGroupPayload) {
  return addUuidInteraction<ExerciseGroupPayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    instance: Matchers.string(payload.instance),
    alias: payload.alias ? Matchers.string(payload.alias) : null,
    date: Matchers.iso8601DateTime(payload.date),
    currentRevisionId: payload.currentRevisionId
      ? Matchers.integer(payload.currentRevisionId)
      : null,
    licenseId: Matchers.integer(payload.licenseId),
    exerciseIds:
      payload.exerciseIds.length > 0
        ? Matchers.eachLike(Matchers.like(payload.exerciseIds[0]))
        : [],
    taxonomyTermIds:
      payload.taxonomyTermIds.length > 0
        ? Matchers.eachLike(Matchers.like(payload.taxonomyTermIds[0]))
        : [],
  })
}

export function addExerciseGroupRevisionInteraction(
  payload: ExerciseGroupRevisionPayload
) {
  return addUuidInteraction<ExerciseGroupRevisionPayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    content: Matchers.string(payload.content),
    changes: Matchers.string(payload.changes),
  })
}

export function addGroupedExerciseInteraction(payload: GroupedExercisePayload) {
  return addUuidInteraction<GroupedExercisePayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    instance: Matchers.string(payload.instance),
    alias: payload.alias ? Matchers.string(payload.alias) : null,
    date: Matchers.iso8601DateTime(payload.date),
    currentRevisionId: payload.currentRevisionId
      ? Matchers.integer(payload.currentRevisionId)
      : null,
    licenseId: Matchers.integer(payload.licenseId),
    solutionId: payload.solutionId
      ? Matchers.integer(payload.solutionId)
      : null,
    parentId: payload.parentId,
  })
}

export function addGroupedExerciseRevisionInteraction(
  payload: GroupedExerciseRevisionPayload
) {
  return addUuidInteraction<GroupedExerciseRevisionPayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    content: Matchers.string(payload.content),
    changes: Matchers.string(payload.changes),
  })
}

export function addPageInteraction(payload: PagePayload) {
  return addUuidInteraction<PagePayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    instance: Matchers.string(payload.instance),
    alias: payload.alias ? Matchers.string(payload.alias) : null,
    currentRevisionId: payload.currentRevisionId
      ? Matchers.integer(payload.currentRevisionId)
      : null,
    licenseId: Matchers.integer(payload.licenseId),
  })
}

export function addPageRevisionInteraction(payload: PageRevisionPayload) {
  return addUuidInteraction<PageRevisionPayload>({
    __typename: payload.__typename,
    id: 35476,
    trashed: Matchers.boolean(payload.trashed),
    title: Matchers.string(payload.title),
    content: Matchers.string(payload.content),
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
  })
}

export function addSolutionInteraction(payload: SolutionPayload) {
  return addUuidInteraction<SolutionPayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    instance: Matchers.string(payload.instance),
    alias: payload.alias ? Matchers.string(payload.alias) : null,
    date: Matchers.iso8601DateTime(payload.date),
    currentRevisionId: payload.currentRevisionId
      ? Matchers.integer(payload.currentRevisionId)
      : null,
    licenseId: Matchers.integer(payload.licenseId),
    parentId: Matchers.integer(payload.parentId),
  })
}

export function addSolutionRevisionInteraction(
  payload: SolutionRevisionPayload
) {
  return addUuidInteraction<SolutionRevisionPayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    content: Matchers.string(payload.content),
    changes: Matchers.string(payload.changes),
  })
}

export function addTaxonomyTermInteraction(payload: TaxonomyTermPayload) {
  return addUuidInteraction<TaxonomyTermPayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    alias: payload.alias ? Matchers.string(payload.alias) : null,
    type: Matchers.string(payload.type),
    instance: Matchers.string(payload.instance),
    name: Matchers.string(payload.name),
    description: payload.description
      ? Matchers.string(payload.description)
      : null,
    weight: Matchers.integer(payload.weight),
    parentId: payload.parentId ? Matchers.integer(payload.parentId) : null,
    childrenIds:
      payload.childrenIds.length > 0
        ? Matchers.eachLike(Matchers.integer(payload.childrenIds[0]))
        : [],
  })
}

export function addUserInteraction(payload: UserPayload) {
  return addUuidInteraction<UserPayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    username: Matchers.string(payload.username),
    date: Matchers.iso8601DateTime(payload.date),
    lastLogin: payload.lastLogin
      ? Matchers.iso8601DateTime(payload.lastLogin)
      : null,
    description: payload.description
      ? Matchers.string(payload.description)
      : null,
  })
}

export function addVideoInteraction(payload: VideoPayload) {
  return addUuidInteraction<VideoPayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    instance: Matchers.string(payload.instance),
    alias: payload.alias ? Matchers.string(payload.alias) : null,
    date: Matchers.iso8601DateTime(payload.date),
    currentRevisionId: payload.currentRevisionId
      ? Matchers.integer(payload.currentRevisionId)
      : null,
    licenseId: Matchers.integer(payload.licenseId),
    taxonomyTermIds:
      payload.taxonomyTermIds.length > 0
        ? Matchers.eachLike(Matchers.like(payload.taxonomyTermIds[0]))
        : [],
  })
}

export function addVideoRevisionInteraction(payload: VideoRevisionPayload) {
  return addUuidInteraction<VideoRevisionPayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    title: Matchers.string(payload.title),
    content: Matchers.string(payload.content),
    url: Matchers.string(payload.url),
    changes: Matchers.string(payload.changes),
  })
}

export function addUuidInteraction<T extends UuidPayload>(
  data: Record<keyof T, unknown> & { __typename: string; id: number }
) {
  return addJsonInteraction({
    name: `fetch data of uuid ${data.id}`,
    given: `uuid ${data.id} is of type ${data.__typename}`,
    path: `/api/uuid/${data.id}`,
    body: data,
  })
}

function addJsonInteraction({
  name,
  given,
  path,
  body,
}: {
  name: string
  given: string
  path: string
  body: unknown
}) {
  return global.pact.addInteraction({
    uponReceiving: name,
    state: given,
    withRequest: {
      method: 'GET',
      path,
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body,
    },
  })
}
