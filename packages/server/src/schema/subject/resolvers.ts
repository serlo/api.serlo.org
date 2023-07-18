import { resolveConnection } from '../connection/utils'
import { createNamespace, Queries, TypeResolvers } from '~/internals/graphql'
import { EntityDecoder, TaxonomyTermDecoder } from '~/model/decoder'
import { decodeSubjectId, encodeSubjectId } from '~/schema/subject/utils'
import { Subject } from '~/types'

export const resolvers: TypeResolvers<Subject> & Queries<'subject'> = {
  Query: {
    subject: createNamespace(),
  },
  SubjectQuery: {
    async subjects(_parent, { instance }, { dataSources }) {
      const { subjects } = await dataSources.model.serlo.getSubjects()

      return subjects.filter((subject) => subject.instance === instance)
    },
    async subject(_parent, { id }, { dataSources }) {
      const taxonomyTermId = decodeSubjectId(id)
      const { subjects } = await dataSources.model.serlo.getSubjects()

      return subjects.some((s) => s.taxonomyTermId === taxonomyTermId)
        ? { taxonomyTermId }
        : null
    },
  },
  Subject: {
    id(subject) {
      return encodeSubjectId(subject.taxonomyTermId)
    },
    taxonomyTerm(subject, _args, { dataSources }) {
      return dataSources.model.serlo.getUuidWithCustomDecoder({
        id: subject.taxonomyTermId,
        decoder: TaxonomyTermDecoder,
      })
    },
    async unrevisedEntities(subject, payload, { dataSources }) {
      const entitiesPerSubject =
        await dataSources.model.serlo.getUnrevisedEntitiesPerSubject()
      const entityIds =
        entitiesPerSubject[subject.taxonomyTermId.toString()] ?? []
      const entities = await Promise.all(
        entityIds.map((id) =>
          dataSources.model.serlo.getUuidWithCustomDecoder({
            id,
            decoder: EntityDecoder,
          }),
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
