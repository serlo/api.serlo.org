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
import { Schema } from '../utils'
import { abstractEntitySchema } from './abstract-entity'
import { abstractTaxonomyTermChildSchema } from './abstract-taxonomy-term-child'
import { abstractUuidSchema, UnsupportedUuid } from './abstract-uuid'
import { aliasSchema } from './alias'
import { articleSchema, Article, ArticleRevision } from './article'
import { Exercise, ExerciseRevision, exerciseSchema } from './exercise'
import {
  GroupedExercise,
  GroupedExerciseRevision,
  groupedExerciseSchema,
} from './grouped-exercise'
import { pageSchema, Page, PageRevision } from './page'
import { Solution, SolutionRevision, solutionSchema } from './solution'
import { taxonomyTermSchema, TaxonomyTerm } from './taxonomy-term'
import { userSchema, User } from './user'

export * from './abstract-entity'
export * from './abstract-uuid'
export * from './alias'
export * from './article'
export * from './exercise'
export * from './grouped-exercise'
export * from './page'
export * from './taxonomy-term'
export * from './user'

export const uuidSchema = Schema.merge(
  abstractEntitySchema,
  abstractTaxonomyTermChildSchema,
  abstractUuidSchema,
  aliasSchema,
  articleSchema,
  exerciseSchema,
  groupedExerciseSchema,
  pageSchema,
  solutionSchema,
  taxonomyTermSchema,
  userSchema
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveAbstractUuid(data?: any) {
  if (!data) return null

  switch (data.discriminator) {
    case 'entity':
      switch (data.type) {
        case 'article':
          return new Article(data)
        case 'exercise':
          return new Exercise(data)
        case 'groupedExercise':
          return new GroupedExercise(data)
        case 'solution':
          return new Solution(data)
        default:
          return new UnsupportedUuid(data)
      }
    case 'entityRevision':
      switch (data.type) {
        case 'article':
          return new ArticleRevision(data)
        case 'exercise':
          return new ExerciseRevision(data)
        case 'groupedExercise':
          return new GroupedExerciseRevision(data)
        case 'solution':
          return new SolutionRevision(data)
        default:
          return new UnsupportedUuid(data)
      }
    case 'page':
      return new Page(data)
    case 'pageRevision':
      return new PageRevision(data)
    case 'user':
      return new User(data)
    case 'taxonomyTerm':
      return new TaxonomyTerm(data)
    default:
      return new UnsupportedUuid(data)
  }
}
