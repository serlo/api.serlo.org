import { createNamespace } from '~/internals/graphql'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  Mutation: {
    experiment: createNamespace(),
  },
  ExperimentMutation: {
    async createExerciseSubmission(_parent, { input }, context) {
      const { database } = context
      const { path, entityId, revisionId, type, result, sessionId } = input
      await database.mutate(
        `
        INSERT INTO 
          exercise_submission 
          (path, entity_id, revision_id, type, result, session_id)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [path, entityId, revisionId, type, result, sessionId],
      )
      return { success: true, query: {} }
    },
  },
}
