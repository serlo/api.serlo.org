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
import { Model } from '~/internals/graphql'
import { DiscriminatorType } from '~/model/decoder'
import { Instance, TaxonomyTermType } from '~/types'

export const taxonomyTermRoot: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: 3,
  trashed: false,
  alias: '/root/3/root',
  type: TaxonomyTermType.Root,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 1,
  parentId: null,
  childrenIds: [5],
}

export const taxonomyTermSubject: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: 5,
  trashed: false,
  alias: '/mathe/5/mathe',
  type: TaxonomyTermType.Subject,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 2,
  parentId: taxonomyTermRoot.id,
  childrenIds: [16048],
}

export const taxonomyTermCurriculumTopic: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: 16048,
  trashed: false,
  alias: '/mathe/16048/natürliche-zahlen',
  type: TaxonomyTermType.CurriculumTopic,
  instance: Instance.De,
  name: 'name',
  description: 'description',
  weight: 3,
  parentId: taxonomyTermSubject.id,
  childrenIds: [1855],
}
