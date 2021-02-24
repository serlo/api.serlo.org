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
  AbstractEntityPayloadDecoder,
  AbstractEntityRevisionPayloadDecoder,
} from '~/schema/uuid/abstract-entity/decoder'
import {
  EntityRevisionType,
  EntityType,
} from '~/schema/uuid/abstract-entity/types'
import { VideoPayload, VideoRevisionPayload } from '~/schema/uuid/video/types'

export const VideoDecoder: t.Type<VideoPayload> = t.exact(
  t.intersection([
    AbstractEntityPayloadDecoder,
    t.type({
      __typename: t.literal(EntityType.Video),
      taxonomyTermIds: t.array(t.number),
    }),
  ])
)

export const VideoRevisionDecoder: t.Type<VideoRevisionPayload> = t.exact(
  t.intersection([
    AbstractEntityRevisionPayloadDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.VideoRevision),
      url: t.string,
      title: t.string,
      content: t.string,
    }),
  ])
)
