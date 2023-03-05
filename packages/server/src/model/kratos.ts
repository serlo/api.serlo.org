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
import { option as O, function as F } from 'fp-ts'
import * as t from 'io-ts'

import { InstanceDecoder } from './decoder'
import { createQuery } from '~/internals/data-source-helper'
import { Environment } from '~/internals/environment'

export function createKratosModel({
  environment,
}: {
  environment: Environment
}) {
  const getUserLanguage = createQuery(
    {
      decoder: t.union([InstanceDecoder, t.null]),
      enableSwr: true,
      staleAfter: { days: 30 },
      maxAge: { days: 180 },
      async getCurrentValue({ userLegacyId }: { userLegacyId: number }) {
        const kratosIdentity =
          await environment.authServices.kratos.db.getIdentityByLegacyId(
            userLegacyId
          )
        const language = kratosIdentity?.traits?.language

        return InstanceDecoder.is(language) ? language : null
      },
      getKey: ({ userLegacyId }) => {
        return `kratos.serlo.org/user-language/${userLegacyId}`
      },
      getPayload: (key) => {
        if(process.env.ENVIRONMENT === 'local'){
          return O.none
        }
        if (!key.startsWith('kratos.serlo.org/user-language/')) return O.none
        const userLegacyId = parseInt(
          key.replace('kratos.serlo.org/user-language/', '')
        )
        return F.pipe(
          O.some({ userLegacyId }),
          O.filter(
            ({ userLegacyId }) => !isNaN(userLegacyId) && userLegacyId > 0
          )
        )
      },
      examplePayload: { userLegacyId: 1 },
    },
    environment
  )

  return {
    getUserLanguage,
  }
}
