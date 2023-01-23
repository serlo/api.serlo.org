/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { resolveConnection } from '../connection/utils'
import {
  createNamespace,
  decodeId,
  encodeId,
  Queries,
  TypeResolvers,
} from '~/internals/graphql'
import { EntityDecoder, TaxonomyTermDecoder } from '~/model/decoder'
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
      const taxonomyTermId = decodeId({ textId: id, prefix: 's' })
      const { subjects } = await dataSources.model.serlo.getSubjects()

      return subjects.some((s) => s.taxonomyTermId === taxonomyTermId)
        ? { taxonomyTermId }
        : null
    },
  },
  Subject: {
    id(subject) {
      return encodeId({ prefix: 's', id: subject.taxonomyTermId })
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
          })
        )
      )

      return resolveConnection({
        nodes: entities,
        payload,
        createCursor: (node) => node.id.toString(),
      })
    },
  },
}
