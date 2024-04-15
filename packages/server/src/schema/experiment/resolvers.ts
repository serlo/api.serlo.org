import { createNamespace } from '~/internals/graphql'
import { runSql } from '~/model/database'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  Mutation: {
    experiment: createNamespace(),
  },
  ExperimentMutation: {
    async createExerciseSubmission(_parent, { input }) {
      const { path, entityId, revisionId, type, result, sessionId } = input
      await runSql(
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
