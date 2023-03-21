/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { ModelDataSource } from '~/internals/data-source'
import { decodeId, encodeId } from '~/internals/graphql'

export function encodeSubjectId(id: number) {
  return encodeId({ prefix: 's', id })
}

export function decodeSubjectId(textId: string) {
  return decodeId({ prefix: 's', textId })
}

export async function validateSubjectId(
  dataSources: { model: ModelDataSource },
  textId?: string
) {
  if (!textId) return null
  try {
    const id = decodeSubjectId(textId)
    const { subjects } = await dataSources.model.serlo.getSubjects()

    return subjects.some((subject) => subject.taxonomyTermId === id) ? id : null
  } catch (_) {
    return null
  }
}
