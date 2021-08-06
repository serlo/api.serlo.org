/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import {
  createNamespace,
  decodeId,
  encodeId,
  Queries,
  TypeResolvers,
} from '~/internals/graphql'
import { TaxonomyTermDecoder } from '~/model/decoder'
import { Subject, SubjectsQuery } from '~/types'

export const resolvers: TypeResolvers<Subject> &
  Queries<'subject'> &
  TypeResolvers<SubjectsQuery> = {
  Query: {
    subject: createNamespace(),
  },
  SubjectsQuery: {
    async subjects(_parent, { instance }, { dataSources }) {
      const { subjectTaxonomyTermIds } =
        await dataSources.model.serlo.getSubjects({ instance })

      return subjectTaxonomyTermIds.map((taxonomyTermId) => {
        return { taxonomyTermId }
      })
    },
    subject(_parent, { id }) {
      return { taxonomyTermId: decodeId({ textId: id, prefix: 's' }) }
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
  },
}
