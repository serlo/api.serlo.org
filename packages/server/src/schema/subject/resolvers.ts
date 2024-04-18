import { resolveConnection } from '../connection/utils'
import { createNamespace } from '~/internals/graphql'
import { EntityDecoder, TaxonomyTermDecoder } from '~/model/decoder'
import { encodeSubjectId } from '~/schema/subject/utils'
import { type Resolvers } from '~/types'

export const resolvers: Resolvers = {
  Query: {
    subject: createNamespace(),
  },
  SubjectQuery: {
    async subjects(_parent, { instance }, { dataSources }) {
      const { subjects } = await dataSources.model.serlo.getSubjects()

      return subjects.filter((subject) => subject.instance === instance)
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
