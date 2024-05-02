import { resolveConnection } from '../connection/utils'
import { UuidResolver } from '../uuid/abstract-uuid/resolvers'
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
