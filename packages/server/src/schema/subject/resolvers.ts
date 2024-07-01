import { option as O } from 'fp-ts'
import * as t from 'io-ts'

import { resolveConnection } from '../connection/utils'
import { resolveUnrevisedEntityIds } from '../uuid/abstract-entity/resolvers'
import { UuidResolver } from '../uuid/abstract-uuid/resolvers'
import { createCachedResolver } from '~/cached-resolver'
import { createNamespace } from '~/internals/graphql'
import {
  EntityDecoder,
  SubjectDecoder,
  TaxonomyTermDecoder,
} from '~/model/decoder'
import { encodeSubjectId } from '~/schema/subject/utils'
import { type Resolvers } from '~/types'

export const SubjectsResolver = createCachedResolver({
  name: 'SubjectsResolver',
  decoder: t.array(SubjectDecoder),
  enableSwr: true,
  staleAfter: { days: 1 },
  getKey: () => 'serlo.org/subjects',
  getPayload: (key) => {
    return key === 'serlo.org/subjects' ? O.some(undefined) : O.none
  },
  examplePayload: undefined,
  async getCurrentValue(_, { database }) {
    const rows = await database.fetchAll(
      `
        SELECT
          subject.id as taxonomyTermId,
          subject_instance.subdomain as instance
        FROM taxonomy AS subject
        JOIN taxonomy AS root ON root.id = subject.parent_id
        JOIN uuid as subject_uuid ON subject_uuid.id = subject.id
        JOIN type AS subject_type ON subject_type.id = subject.type_id
        JOIN instance AS subject_instance ON subject_instance.id = subject.instance_id
        WHERE
          (root.parent_id IS NULL
            OR root.id = 106081
            OR root.id = 146728)
          AND subject_uuid.trashed = 0
          AND (subject_type.name = "subject" or subject_type.name = "topic")
        ORDER BY subject.id;
      `,
    )

    return rows.filter(SubjectDecoder.is)
  },
})

export const resolvers: Resolvers = {
  Query: {
    subject: createNamespace(),
  },
  SubjectQuery: {
    async subjects(_parent, payload, context) {
      const subjects = await SubjectsResolver.resolve(undefined, context)
      const filteredSubjects = subjects.filter(
        (subject) => subject.instance === payload.instance,
      )
      const unrevisedEntityIds = await resolveUnrevisedEntityIds({}, context)
      const unreviseedEntities = await Promise.all(
        unrevisedEntityIds.map((id) =>
          UuidResolver.resolveWithDecoder(EntityDecoder, { id }, context),
        ),
      )
      return filteredSubjects.map((subject) => ({
        ...subject,
        allUnrevisedEntities: unreviseedEntities.filter(
          (entity) => entity.canonicalSubjectId === subject.taxonomyTermId,
        ),
      }))
    },
  },
  Subject: {
    id(subject) {
      return encodeSubjectId(subject.taxonomyTermId)
    },
    taxonomyTerm(subject, _args, context) {
      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id: subject.taxonomyTermId },
        context,
      )
    },
    unrevisedEntities({ allUnrevisedEntities }, payload, _) {
      return resolveConnection({
        nodes: allUnrevisedEntities,
        payload,
        createCursor: (node) => node.id.toString(),
      })
    },
  },
}

export const SubjectResolver = createCachedResolver({
  name: 'SubjectQuery',
  decoder: t.union([t.null, t.type({ name: t.string, id: t.number })]),
  enableSwr: true,
  staleAfter: { days: 14 },
  maxAge: { days: 90 },
  getKey: ({ taxonomyId }) => {
    return `subject/${taxonomyId}`
  },
  getPayload: (key) => {
    if (!key.startsWith('subject/')) return O.none
    const taxonomyId = parseInt(key.replace('subject/', ''), 10)
    return O.some({ taxonomyId })
  },
  examplePayload: { taxonomyId: 1 },
  async getCurrentValue({ taxonomyId }, { database }) {
    interface Row {
      name: string
      id: number
    }

    return await database.fetchOptional<Row>(
      `
      SELECT
        t1.name as name, t1.id as id
      FROM taxonomy t0
      JOIN taxonomy t1 ON t1.parent_id = t0.id
      LEFT JOIN taxonomy t2 ON t2.parent_id = t1.id
      LEFT JOIN taxonomy t3 ON t3.parent_id = t2.id
      LEFT JOIN taxonomy t4 ON t4.parent_id = t3.id
      LEFT JOIN taxonomy t5 ON t5.parent_id = t4.id
      LEFT JOIN taxonomy t6 ON t6.parent_id = t5.id
      LEFT JOIN taxonomy t7 ON t7.parent_id = t6.id
      LEFT JOIN taxonomy t8 ON t8.parent_id = t7.id
      LEFT JOIN taxonomy t9 ON t9.parent_id = t8.id
      LEFT JOIN taxonomy t10 ON t10.parent_id = t9.id
      LEFT JOIN taxonomy t11 ON t11.parent_id = t10.id
      LEFT JOIN taxonomy t12 ON t12.parent_id = t11.id
      LEFT JOIN taxonomy t13 ON t13.parent_id = t12.id
      LEFT JOIN taxonomy t14 ON t14.parent_id = t13.id
      LEFT JOIN taxonomy t15 ON t15.parent_id = t14.id
      LEFT JOIN taxonomy t16 ON t16.parent_id = t15.id
      LEFT JOIN taxonomy t17 ON t17.parent_id = t16.id
      LEFT JOIN taxonomy t18 ON t18.parent_id = t17.id
      LEFT JOIN taxonomy t19 ON t19.parent_id = t18.id
      LEFT JOIN taxonomy t20 ON t20.parent_id = t19.id
      WHERE
          (
              t0.id = 146728 OR
              t0.id = 106081 OR
              (t0.parent_id IS NULL AND t2.id != 146728 AND t1.id != 106081)
          ) AND (
              t1.id = ? OR t2.id = ? OR t3.id = ? OR t4.id = ? OR t5.id = ? OR
              t6.id = ? OR t7.id = ? OR t8.id = ? OR t9.id = ? OR t10.id = ? OR
              t11.id = ? OR t12.id = ? OR t13.id = ? OR t14.id = ? OR t15.id = ?
              OR t16.id = ? OR t17.id = ? OR t18.id = ? OR t19.id = ? OR t20.id = ?
          )
    `,
      new Array(20).fill(taxonomyId),
    )
  },
})
