import { option as O } from 'fp-ts'
import * as t from 'io-ts'

import { resolveConnection } from '../connection/utils'
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
    interface Row {
      id: number
      instance: string
    }

    const rows = await database.fetchAll<Row>(
      `
        SELECT
          subject.id,
          subject_instance.subdomain as instance
        FROM term_taxonomy AS subject
        JOIN term_taxonomy AS root ON root.id = subject.parent_id
        JOIN uuid as subject_uuid ON subject_uuid.id = subject.id
        JOIN taxonomy AS subject_taxonomy ON subject_taxonomy.id = subject.taxonomy_id
        JOIN type AS subject_type ON subject_type.id = subject_taxonomy.type_id
        JOIN term AS subject_term ON subject_term.id = subject.term_id
        JOIN instance AS subject_instance ON subject_instance.id = subject_term.instance_id
        WHERE
          (root.parent_id IS NULL
            OR root.id = 106081
            OR root.id = 146728)
          AND subject_uuid.trashed = 0
          AND (subject_type.name = "subject" or subject_type.name = "topic")
        ORDER BY subject.id;
      `,
    )

    return rows
      .map((row) => {
        const { id, instance } = row
        return {
          taxonomyTermId: id,
          instance,
        }
      })
      .filter(SubjectDecoder.is)
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
      return filteredSubjects
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
    async unrevisedEntities(subject, payload, context) {
      const entitiesPerSubject =
        await context.dataSources.model.serlo.getUnrevisedEntitiesPerSubject()
      const entityIds =
        entitiesPerSubject[subject.taxonomyTermId.toString()] ?? []
      const entities = await Promise.all(
        entityIds.map((id) =>
          UuidResolver.resolveWithDecoder(EntityDecoder, { id }, context),
        ),
      )

      return resolveConnection({
        nodes: entities,
        payload,
        createCursor: (node) => node.id.toString(),
      })
    },
  },
}
