import { gql } from 'apollo-server'
import { GraphQLResolveInfo } from 'graphql'

import { DateTime } from '../date-time'
import { Context } from '../types'
import { requestsOnlyFields, Schema } from '../utils'
import { resolveAbstractUuid, User, Uuid } from '../uuid'

export const threadSchema = new Schema()

/**
 * type Comment
 */
export class Comment {
  public id: string
  public content: string
  public createdAt: DateTime
  public updatedAt: DateTime
  public authorId: number
  // public parentId: string

  public constructor(payload: CommentPayload) {
    this.id = payload.id
    this.content = payload.content
    this.createdAt = payload.createdAt
    this.updatedAt = payload.updatedAt
    this.authorId = payload.authorId
  }

  public async author(
    _args: undefined,
    { dataSources }: Context,
    info: GraphQLResolveInfo
  ) {
    const partialUser = { id: this.authorId }
    if (requestsOnlyFields('User', ['id'], info)) {
      return partialUser
    }
    const data = await dataSources.serlo.getUuid(partialUser)
    return new User(data)
  }

  // public async thread(
  //     _args: undefined,
  //     { dataSources }: Context,
  //     info: GraphQLResolveInfo
  // ) {
  //   const partialThread = { id: this.parentId }
  //   if (requestsOnlyFields('Thread', ['id'], info)) {
  //     return partialThread
  //   }
  //   const data = await dataSources.comments.getThread(this.parentId)
  //   return new Thread(data)
  // }
}
export interface CommentPayload {
  id: string
  content: string
  createdAt: DateTime
  updatedAt: DateTime
  authorId: number
}
threadSchema.addTypeDef(gql`
  type Comment {
    id: String!
    content: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    author: User!
  }
`)

/**
 * type Thread
 */
export class Thread {
  public id: string
  public title: string
  public archived: boolean
  public createdAt: DateTime
  public updatedAt: DateTime
  public commentIds: string[]
  public parentId: number

  public constructor(payload: ThreadPayload) {
    this.id = payload.id
    this.title = payload.title
    this.archived = payload.archived
    this.createdAt = payload.createdAt
    this.updatedAt = payload.updatedAt
    this.commentIds = payload.commentIds
    this.parentId = payload.parentId
  }

  public async comments(_args: undefined, { dataSources }: Context) {
    return Promise.all(
      this.commentIds.map((id) => {
        return dataSources.comments.getComment(id).then((payload) => {
          return new Comment(payload)
        })
      })
    )
  }

  public async uuid(_args: undefined, { dataSources }: Context) {
    const data = await dataSources.serlo.getUuid({ id: this.parentId })
    return resolveAbstractUuid(data) as Uuid
  }
}
export interface ThreadPayload {
  id: string
  title: string
  archived: boolean
  createdAt: DateTime
  updatedAt: DateTime
  commentIds: string[]
  parentId: number
}
threadSchema.addTypeDef(gql`
  type Thread {
    id: String!
    title: String!
    archived: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    comments: [Comment!]!
    uuid: Uuid!
  }
`)
