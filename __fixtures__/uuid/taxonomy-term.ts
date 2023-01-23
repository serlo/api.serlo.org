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
import { Model } from '~/internals/graphql'
import { castToAlias, castToUuid, DiscriminatorType } from '~/model/decoder'
import { Instance, TaxonomyTermType } from '~/types'

export const taxonomyTermRoot: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: castToUuid(3),
  trashed: false,
  alias: castToAlias('/root/3/root'),
  type: TaxonomyTermType.Root,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 1,
  parentId: null,
  taxonomyId: castToUuid(1),
  childrenIds: [5].map(castToUuid),
}

export const taxonomyTermSubject: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: castToUuid(5),
  trashed: false,
  alias: castToAlias('/mathe/5/mathe'),
  type: TaxonomyTermType.Subject,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 2,
  parentId: taxonomyTermRoot.id,
  taxonomyId: castToUuid(3),
  childrenIds: [16048].map(castToUuid),
}

export const taxonomyTermCurriculumTopic: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: castToUuid(16048),
  trashed: false,
  alias: castToAlias('/mathe/16048/natürliche-zahlen'),
  type: 'curriculumTopic',
  instance: Instance.De,
  name: 'name',
  description: 'description',
  weight: 3,
  taxonomyId: castToUuid(11),
  parentId: taxonomyTermSubject.id,
  childrenIds: [1855].map(castToUuid),
}

export const taxonomyTermTopic: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: castToUuid(1288),
  trashed: false,
  alias: castToAlias('/mathe/1288/geometrie'),
  type: TaxonomyTermType.Topic,
  instance: Instance.De,
  name: 'Geometrie',
  description: null,
  weight: 6,
  taxonomyId: castToUuid(4),
  parentId: castToUuid(5),
  childrenIds: [
    23453, 1454, 1394, 24518, 1380, 24410, 24422, 1381, 1383, 1300, 1413,
  ].map(castToUuid),
}

export const taxonomyTermTopicFolder: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: castToUuid(23662),
  trashed: false,
  alias: castToAlias('/mathe/23662/aufgaben-zu-einfachen-potenzen'),
  type: 'topicFolder',
  instance: Instance.De,
  name: 'Aufgaben zu einfachen Potenzen',
  description: '',
  weight: 1,
  taxonomyId: castToUuid(9),
  parentId: castToUuid(1288),
  childrenIds: [10385, 6925, 6921, 6933, 6917, 7085].map(castToUuid),
}
