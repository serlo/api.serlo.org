import { gql } from 'apollo-server'

import { LegacyUuid, resolveAbstractLegacyUuid } from './legacy-uuid'
import { Comment, Thread } from './thread/schema'
import { Schema } from './utils'
import { Uuid, UuidType } from './uuid'

export const nodeSchema = new Schema()

export type Node = LegacyUuid | Uuid

nodeSchema.addQuery<unknown, { id: string }, Node | null>(
  'node',
  async (_parent, { id }, { dataSources }) => {
    const match = /(\d+)/.exec(id)
    if (match === null) {
      const data = await dataSources.uuid.getUuid(id)
      switch (data.type) {
        case UuidType.Thread: {
          const data = await dataSources.comments.getThread(id)
          return new Thread(data)
        }
        case UuidType.Comment: {
          const data = await dataSources.comments.getComment(id)
          return new Comment(data)
        }
      }
    } else {
      const data = await dataSources.serlo.getUuid({
        id: parseInt(match[1], 10),
      })
      return resolveAbstractLegacyUuid(data)
    }
  }
)
nodeSchema.addTypeDef(gql`
  union Node =
      Applet
    | AppletRevision
    | Article
    | ArticleRevision
    | Course
    | CourseRevision
    | CoursePage
    | CoursePageRevision
    | Event
    | EventRevision
    | Exercise
    | ExerciseRevision
    | ExerciseGroup
    | ExerciseGroupRevision
    | GroupedExercise
    | GroupedExerciseRevision
    | Page
    | PageRevision
    | Solution
    | SolutionRevision
    | TaxonomyTerm
    | User
    | Video
    | VideoRevision
    | Thread
    | Comment

  extend type Query {
    node(id: String!): Node
  }
`)
nodeSchema.addTypeResolver<Node>('Node', (node) => {
  return node.__typename
})
