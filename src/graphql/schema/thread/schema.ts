import { gql } from 'apollo-server'
import { GraphQLResolveInfo } from 'graphql'

import { DateTime } from '../date-time'
import { Context } from '../types'
import { requestsOnlyFields, Schema } from '../utils'
import { User } from '../uuid'

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
  public trashed: boolean
  public createdAt: DateTime
  public updatedAt: DateTime
  public comments: CommentPayload[]

  public constructor(payload: ThreadPayload) {
    this.id = payload.id
    this.title = payload.title
    this.archived = payload.archived
    this.trashed = payload.trashed
    this.createdAt = payload.createdAt
    this.updatedAt = payload.updatedAt
    this.comments = payload.comments.map((payload) => {
      return new Comment(payload)
    })
  }
}
export interface ThreadPayload {
  id: string
  title: string
  archived: boolean
  trashed: boolean
  createdAt: DateTime
  updatedAt: DateTime
  comments: CommentPayload[]
}
threadSchema.addTypeDef(gql`
  type Thread {
    id: String!
    title: String!
    archived: Boolean!
    trashed: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    comments: [Comment!]!
  }
`)
