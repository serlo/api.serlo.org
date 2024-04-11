import { createNamespace, Mutations } from '~/internals/graphql'
import { runSql } from '~/model/database'

export const resolvers: Mutations<'experiment'> = {
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
