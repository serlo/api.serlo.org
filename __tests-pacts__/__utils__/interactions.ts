import { Matchers } from '@pact-foundation/pact'

import { License } from '../../src/graphql/schema/license'
import {
  AliasPayload,
  ArticlePayload,
  ArticleRevisionPayload,
  ExercisePayload,
  ExerciseRevisionPayload,
  PagePayload,
  PageRevisionPayload,
  TaxonomyTermPayload,
  UserPayload,
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
