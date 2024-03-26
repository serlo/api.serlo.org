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
    async createQuickbarStats(_parent, { input }) {
      const { path, query, target, isSubject } = input
      await runSql(
        `
        INSERT INTO 
          test_survey 
          (path, query, target, is_subject)
        VALUES (?, ?, ?)
        `,
        [path, query, target, isSubject],
      )
      return { success: true, query: {} }
    },
    async createAbSubmission(_parent, { input }) {
      const {
        group,
        experiment,
        entityId,
        type,
        result,
        sessionId,
        isProduction,
        topicId,
      } = input
      await runSql(
        `
        INSERT INTO ab_testing_data 
          (experiment_group, experiment, entity_id, type, result, session_id, is_production, topic_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          group,
          experiment,
          entityId,
          type,
          result,
          sessionId,
          isProduction,
          topicId,
        ],
      )
      return { success: true, query: {} }
    },
    async createEquationsAppStats(_parent, { input }) {
      const { event, latex, sessionId } = input
      await runSql(
        `
          INSERT INTO equations_app_stats (event, latex, sessionI_id)
          VALUES (?, ?, ?);
        `,
        [event, latex, sessionId],
      )
      return { success: true, query: {} }
    },
  },
}
