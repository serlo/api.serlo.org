/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Instance } from '../../instance'
import { MutationResolver, Resolver } from '../../types'
import { Uuid, UuidPayload } from '../abstract-uuid'
import { Navigation } from '../navigation'

export enum TaxonomyTermType {
  Blog = 'blog',
  Curriculum = 'curriculum',
  CurriculumTopic = 'curriculumTopic',
  CurriculumTopicFolder = 'curriculumTopicFolder',
  Forum = 'forum',
  ForumCategory = 'forumCategory',
  Locale = 'locale',
  Root = 'root',
  Subject = 'subject',
  Topic = 'topic',
  TopicFolder = 'topicFolder',
}

export interface TaxonomyTerm extends Uuid {
  type: TaxonomyTermType
  instance: Instance
  alias: string | null
  name: string
  description: string | null
  weight: number
  parentId: number | null
  childrenIds: number[]
}

export interface TaxonomyTermPayload extends UuidPayload {
  alias: string | null
  type: TaxonomyTermType
  instance: Instance
  name: string
  description: string | null
  weight: number
  parentId: number | null
  childrenIds: number[]
}

export interface TaxonomyTermResolvers {
  TaxonomyTerm: {
    parent: Resolver<TaxonomyTerm, never, TaxonomyTerm>
    children: Resolver<TaxonomyTerm, never, Uuid[]>
    navigation: Resolver<TaxonomyTerm, never, Navigation>
  }
}
