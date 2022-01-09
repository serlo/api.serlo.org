/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { TypeResolvers } from '~/internals/graphql'
import {
  ExerciseGroupDecoder,
  GroupedExerciseDecoder,
  GroupedExerciseRevisionDecoder,
} from '~/model/decoder'
import { createEntityResolvers } from '~/schema/uuid/abstract-entity/utils'
import { createExerciseResolvers } from '~/schema/uuid/abstract-exercise/utils'
import { createRevisionResolvers } from '~/schema/uuid/abstract-repository/utils'
import { GroupedExercise, GroupedExerciseRevision } from '~/types'

export const resolvers: TypeResolvers<GroupedExercise> &
  TypeResolvers<GroupedExerciseRevision> = {
  GroupedExercise: {
    ...createEntityResolvers({
      revisionDecoder: GroupedExerciseRevisionDecoder,
    }),
    ...createExerciseResolvers(),
    async exerciseGroup(groupedExercise, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: groupedExercise.parentId,
        decoder: ExerciseGroupDecoder,
      })
    },
  },
  GroupedExerciseRevision: createRevisionResolvers({
    repositoryDecoder: GroupedExerciseDecoder,
  }),
}
