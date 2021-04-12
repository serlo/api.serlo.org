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
import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { EntityDecoder, EntityRevisionDecoder } from '~/model/decoder'
import { CreateEntityRevisionNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<CreateEntityRevisionNotificationEvent> = {
  CreateEntityRevisionNotificationEvent: {
    ...createNotificationEventResolvers(),
    async entity(notificationEvent, _args, { dataSources }) {
      const entity = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.entityId,
        decoder: EntityDecoder,
      })

      if (entity === null) throw new Error('entity cannot be null')

      return entity
    },
    async entityRevision(notificationEvent, _args, { dataSources }) {
      const revision = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.entityRevisionId,
        decoder: EntityRevisionDecoder,
      })

      if (revision === null) throw new Error('revision cannot be null')

      return revision
    },
  },
}
