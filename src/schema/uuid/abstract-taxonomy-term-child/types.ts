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
import { AbstractEntityPayload } from '../abstract-entity'
import { AppletPayload } from '../applet'
import { ArticlePayload } from '../article'
import { CoursePayload } from '../course'
import { EventPayload } from '../event'
import { ExercisePayload } from '../exercise'
import { ExerciseGroupPayload } from '../exercise-group'
import { VideoPayload } from '../video'
import { TypeResolver } from '~/internals/graphql'

export type TaxonomyTermChildPayload =
  | AppletPayload
  | ArticlePayload
  | CoursePayload
  | EventPayload
  | ExercisePayload
  | ExerciseGroupPayload
  | VideoPayload
export interface AbstractTaxonomyTermChildPayload
  extends AbstractEntityPayload {
  taxonomyTermIds: number[]
}

export interface AbstractTaxonomyTermChildResolvers {
  AbstractTaxonomyTermChild: {
    __resolveType: TypeResolver<TaxonomyTermChildPayload>
  }
}
