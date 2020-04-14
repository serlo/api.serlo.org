import { Matchers } from '@pact-foundation/pact'

import { License } from '../../src/graphql/schema/license'
import {
  AliasPayload,
  AppletPayload,
  AppletRevisionPayload,
  ArticlePayload,
  ArticleRevisionPayload,
  CoursePagePayload,
  CoursePageRevisionPayload,
  CoursePayload,
  CourseRevisionPayload,
  EventPayload,
  EventRevisionPayload,
  ExerciseGroupPayload,
  ExerciseGroupRevisionPayload,
  ExercisePayload,
  ExerciseRevisionPayload,
  GroupedExercisePayload,
  GroupedExerciseRevisionPayload,
  PagePayload,
  PageRevisionPayload,
  TaxonomyTermPayload,
  UserPayload,
  VideoPayload,
  VideoRevisionPayload,
} from '../../src/graphql/schema/uuid'
import {
  SolutionPayload,
  SolutionRevisionPayload,
} from '../../src/graphql/schema/uuid/solution'

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

export function addAppletInteraction(payload: AppletPayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entity',
    type: 'applet',
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

export function addAppletRevisionInteraction(payload: AppletRevisionPayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entityRevision',
    type: 'applet',
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    title: Matchers.string(payload.title),
    url: Matchers.string(payload.url),
    content: Matchers.string(payload.content),
    changes: Matchers.string(payload.changes),
  })
}

export function addArticleInteraction(payload: ArticlePayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entity',
    type: 'article',
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

export function addArticleRevisionInteraction(payload: ArticleRevisionPayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entityRevision',
    type: 'article',
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    title: Matchers.string(payload.title),
    content: Matchers.string(payload.content),
    changes: Matchers.string(payload.changes),
  })
}

export function addCourseInteraction(payload: CoursePayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entity',
    type: 'course',
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
    pageIds:
      payload.pageIds.length > 0
        ? Matchers.eachLike(Matchers.like(payload.pageIds[0]))
        : [],
  })
}

export function addCourseRevisionInteraction(payload: CourseRevisionPayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entityRevision',
    type: 'course',
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    title: Matchers.string(payload.title),
    content: Matchers.string(payload.content),
    changes: Matchers.string(payload.changes),
  })
}

export function addCoursePageInteraction(payload: CoursePagePayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entity',
    type: 'coursePage',
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

export function addCoursePageRevisionInteraction(
  payload: CoursePageRevisionPayload
) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entityRevision',
    type: 'coursePage',
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    title: Matchers.string(payload.title),
    content: Matchers.string(payload.content),
    changes: Matchers.string(payload.changes),
  })
}

export function addEventInteraction(payload: EventPayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entity',
    type: 'event',
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

export function addEventRevisionInteraction(payload: EventRevisionPayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entityRevision',
    type: 'event',
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    title: Matchers.string(payload.title),
    content: Matchers.string(payload.content),
    changes: Matchers.string(payload.changes),
  })
}

export function addExerciseInteraction(payload: ExercisePayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entity',
    type: 'exercise',
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
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entityRevision',
    type: 'exercise',
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    content: Matchers.string(payload.content),
    changes: Matchers.string(payload.changes),
  })
}

export function addExerciseGroupInteraction(payload: ExerciseGroupPayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entity',
    type: 'exerciseGroup',
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
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entityRevision',
    type: 'exerciseGroup',
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    content: Matchers.string(payload.content),
    changes: Matchers.string(payload.changes),
  })
}

export function addGroupedExerciseInteraction(payload: GroupedExercisePayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entity',
    type: 'groupedExercise',
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
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entityRevision',
    type: 'groupedExercise',
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    content: Matchers.string(payload.content),
    changes: Matchers.string(payload.changes),
  })
}

export function addPageInteraction(payload: PagePayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'page',
    instance: Matchers.string(payload.instance),
    alias: payload.alias ? Matchers.string(payload.alias) : null,
    currentRevisionId: payload.currentRevisionId
      ? Matchers.integer(payload.currentRevisionId)
      : null,
    licenseId: Matchers.integer(payload.licenseId),
  })
}

export function addPageRevisionInteraction(payload: PageRevisionPayload) {
  return addUuidInteraction({
    id: 35476,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'pageRevision',
    title: Matchers.string(payload.title),
    content: Matchers.string(payload.content),
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
  })
}

export function addSolutionInteraction(payload: SolutionPayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entity',
    type: 'solution',
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
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entityRevision',
    type: 'solution',
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    content: Matchers.string(payload.content),
    changes: Matchers.string(payload.changes),
  })
}

export function addTaxonomyTermInteraction(payload: TaxonomyTermPayload) {
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'taxonomyTerm',
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
  return addUuidInteraction({
    id: payload.id,
    discriminator: 'user',
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
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entity',
    type: 'video',
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
  return addUuidInteraction({
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    discriminator: 'entityRevision',
    type: 'video',
    date: Matchers.iso8601DateTime(payload.date),
    authorId: Matchers.integer(payload.authorId),
    repositoryId: Matchers.integer(payload.repositoryId),
    title: Matchers.string(payload.title),
    url: Matchers.string(payload.url),
    changes: Matchers.string(payload.changes),
  })
}

export function addUuidInteraction<
  T extends {
    id: number
    discriminator: string
  }
>({ id, discriminator, ...data }: T) {
  return addJsonInteraction({
    name: `fetch data of uuid ${id}`,
    given: `uuid ${id} is of discriminator ${discriminator}`,
    path: `/api/uuid/${id}`,
    body: {
      id,
      discriminator,
      ...data,
    },
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
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
