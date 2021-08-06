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
import * as t from 'io-ts'

import {
  Model,
  PickResolvers,
  Repository,
  ResolverFunction,
} from '~/internals/graphql'
import { Connection } from '~/schema/connection/types'
import { createRepositoryResolvers } from '~/schema/uuid/abstract-repository/utils'
import { VideoRevisionsArgs } from '~/types'

export function createEntityResolvers<
  R extends Model<'AbstractEntityRevision'>
>({
  revisionDecoder,
}: {
  revisionDecoder: t.Type<R>
}): PickResolvers<
  'AbstractEntity',
  'alias' | 'threads' | 'license' | 'events' | 'subject'
> &
  // TODO: Add threads to "AbstractEntity"
  PickResolvers<'AbstractRepository', 'threads'> & {
    currentRevision: ResolverFunction<R | null, Repository<R['__typename']>>
    revisions: ResolverFunction<
      Connection<R>,
      Repository<R['__typename']>,
      VideoRevisionsArgs
    >
  } {
  return {
    ...createRepositoryResolvers({ revisionDecoder }),
    subject(entity) {
      return entity.canonicalSubjectId
        ? { taxonomyTermId: entity.canonicalSubjectId }
        : null
    },
  }
}
