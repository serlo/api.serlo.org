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
import { Configuration as KratosConfig, V0alpha2Api } from '@ory/client'
import { AdminApi, Configuration as HydraConfig } from '@ory/hydra-client'
import * as t from 'io-ts'
import { DateFromISOString } from 'io-ts-types'
import { Pool, DatabaseError } from 'pg'

import { captureErrorEvent } from '../error-event'

export interface AuthServices {
  kratos: {
    public: V0alpha2Api
    admin: V0alpha2Api
    db: KratosDB
  }
  hydra: AdminApi
}

export interface Identity {
  id: string
  traits: {
    username: string
    email: string
  } & Partial<{
    description: string | null
    motivation: string | null
    profile_image: string | null
    language: string | null
  }>
  schema_id: string
  created_at: Date | string
  updated_at: Date | string
  state: 'active' | 'inactive'
  state_changed_at: Date | string
  metadata_public: { legacy_id: number; lastLogin?: Date | string | null }
  metadata_admin?: null
}

export const IdentityDecoder = t.type({
  id: t.string,
  traits: t.intersection([
    t.type({
      username: t.string,
      email: t.string,
    }),
    t.partial({
      description: t.union([t.null, t.string]),
      motivation: t.union([t.undefined, t.null, t.string]),
      profile_image: t.union([t.undefined, t.null, t.string]),
      language: t.union([t.undefined, t.null, t.string]),
    }),
  ]),
  schema_id: t.string,
  created_at: t.union([DateFromISOString, t.string]),
  updated_at: t.union([DateFromISOString, t.string]),
  state: t.union([t.literal('active'), t.literal('inactive')]),
  state_changed_at: t.union([DateFromISOString, t.string]),
  metadata_public: t.type({
    legacy_id: t.number,
    lastLogin: t.union([DateFromISOString, t.string, t.undefined, t.null]),
  }),
})

export class KratosDB extends Pool {
  async getIdentityByLegacyId(legacyId: number): Promise<Identity | null> {
    const identities = await this.executeSingleQuery({
      query:
        "SELECT * FROM identities WHERE metadata_public ->> 'legacy_id' = $1",
      params: [legacyId],
    })
    if (identities && IdentityDecoder.is(identities[0])) return identities[0]
    return null
  }
  async executeSingleQuery<T>({
    query,
    params = [],
  }: {
    query: string
    params?: unknown[]
  }) {
    try {
      return (await this.query(query, params)).rows as T[]
    } catch (error) {
      captureErrorEvent({ error: error as DatabaseError })
    }
  }
}

export function createAuthServices(): AuthServices {
  return {
    kratos: {
      public: new V0alpha2Api(
        new KratosConfig({
          basePath: process.env.SERVER_KRATOS_PUBLIC_HOST,
        })
      ),

      admin: new V0alpha2Api(
        new KratosConfig({
          basePath: process.env.SERVER_KRATOS_ADMIN_HOST,
        })
      ),
      db: new KratosDB({
        connectionString: process.env.SERVER_KRATOS_DB_URI,
      }),
    },
    hydra: new AdminApi(
      new HydraConfig({
        basePath: process.env.SERVER_HYDRA_HOST,
        baseOptions: {
          headers: { 'X-Forwarded-Proto': 'https' },
        },
      })
    ),
  }
}
