import { RowDataPacket } from 'mysql2'

import { createNamespace, Mutations, Queries } from '~/internals/graphql'
import { runSql } from '~/model/database'
import { AbSubmission } from '~/types'

interface AbSubmissionData extends RowDataPacket, AbSubmission {
  experiment: string
}

export const resolvers: Queries<'experiment'> & Mutations<'experiment'> = {
  Query: {
    experiment: createNamespace(),
  },
  Mutation: {
    experiment: createNamespace(),
  },
  ExperimentQuery: {
    abSubmissions: async (_parent, { experiment, limit = '100', cursor }) => {
      const subs = await runSql<AbSubmissionData>(
        `
         SELECT * FROM ab_testing_data
         WHERE experiment = ? AND is_production = 1
         AND id > ?
         ORDER BY id ASC
         LIMIT ?;
        `,
        [experiment, cursor || '0', limit.toString()],
      )

      return subs.map((sub) => ({
        ...sub,
        __typename: 'AbSubmission',
      }))
    },
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
          (experiment_group, experiment, entity_id, type, result, session_id, is_production, topic_id, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, current_timestamp(3));`,
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
