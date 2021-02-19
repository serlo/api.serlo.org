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

import { InstanceDecoder } from '~/schema/instance/decoder'
import { AbstractUuidPayloadDecoder } from '~/schema/uuid/abstract-uuid/decoder'

export const AbstractEntityPayloadDecoder = t.intersection([
  AbstractUuidPayloadDecoder,
  t.type({
    instance: InstanceDecoder,
    date: t.string,
    licenseId: t.number,
    currentRevisionId: t.union([t.number, t.null]),
    revisionIds: t.array(t.number),
  }),
])

export const AbstractEntityRevisionPayloadDecoder = t.intersection([
  AbstractUuidPayloadDecoder,
  t.type({
    date: t.string,
    authorId: t.number,
    repositoryId: t.number,
    changes: t.string,
  }),
])
