import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import {
  applet,
  appletRevision,
  comment,
  getAppletDataWithoutSubResolvers,
  getAppletRevisionDataWithoutSubResolvers,
} from '../../../__fixtures__'
import {
  AppletPayload,
  AppletRevisionPayload,
} from '../../../src/graphql/schema'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'
import { CommentPayload } from '../../../src/graphql/schema/uuid/comment/types'

test('Comment', async () => {
  await addUuidInteraction<CommentPayload>({
    __typename: comment.__typename,
    id: comment.id,
    trashed: Matchers.boolean(comment.trashed),
    alias: Matchers.string(applet.instance),
    authorId: applet.alias ? Matchers.string(applet.alias) : null,
    date: Matchers.iso8601DateTime(applet.date),
    archived: applet.currentRevisionId
      ? Matchers.integer(applet.currentRevisionId)
      : null,
    content: Matchers.eachLike(applet.revisionIds[0]),
    parentId: Matchers.integer(applet.licenseId),
    childrenIds:
      applet.taxonomyTermIds.length > 0
        ? Matchers.eachLike(Matchers.like(applet.taxonomyTermIds[0]))
        : [],
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query applet($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on Applet {
            id
            trashed
            instance
            alias
            date
          }
        }
      }
    `,
    variables: applet,
    data: {
      uuid: getAppletDataWithoutSubResolvers(applet),
    },
  })
})

test('AppletRevision', async () => {
  await addUuidInteraction<AppletRevisionPayload>({
    __typename: appletRevision.__typename,
    id: appletRevision.id,
    trashed: Matchers.boolean(appletRevision.trashed),
    date: Matchers.iso8601DateTime(appletRevision.date),
    authorId: Matchers.integer(appletRevision.authorId),
    repositoryId: Matchers.integer(appletRevision.repositoryId),
    title: Matchers.string(appletRevision.title),
    url: Matchers.string(appletRevision.url),
    content: Matchers.string(appletRevision.content),
    changes: Matchers.string(appletRevision.changes),
    metaTitle: Matchers.string(appletRevision.metaTitle),
    metaDescription: Matchers.string(appletRevision.metaDescription),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query appletRevision($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on AppletRevision {
            id
            trashed
            date
            url
            title
            content
            changes
            metaTitle
            metaDescription
          }
        }
      }
    `,
    variables: appletRevision,
    data: {
      uuid: getAppletRevisionDataWithoutSubResolvers(appletRevision),
    },
  })
})
