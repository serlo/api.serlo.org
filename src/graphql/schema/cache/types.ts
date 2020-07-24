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
import {
  Mutation_RemoveCacheArgs,
  Mutation_SetCacheArgs,
  Query_CacheKeysArgs,
} from '../../../types'
import { Connection } from '../connection'
import { MutationResolver, QueryResolver } from '../types'

export interface CacheResolvers {
  Query: {
    _cacheKeys: QueryResolver<Query_CacheKeysArgs, Connection<string>>
  }
  Mutation: {
    _setCache: MutationResolver<Mutation_SetCacheArgs>
    _removeCache: MutationResolver<Mutation_RemoveCacheArgs>
  }
}
