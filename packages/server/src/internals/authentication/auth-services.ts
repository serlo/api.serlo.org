import {
  Configuration as KratosConfig,
  IdentityApi,
  FrontendApi,
} from '@ory/client'
import {
  OAuth2Api as HydraOAuth2Api,
  Configuration as HydraConfig,
} from '@ory/hydra-client'
import * as t from 'io-ts'
import { DateFromISOString } from 'io-ts-types'
import { Pool, DatabaseError } from 'pg'

import { captureErrorEvent } from '../error-event'

export interface Kratos {
  public: FrontendApi
  admin: IdentityApi
  db: KratosDB
}

export interface AuthServices {
  kratos: Kratos
  hydra: HydraOAuth2Api
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
  metadata_public: { legacy_id: number }
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
  metadata_public: t.type({ legacy_id: t.number }),
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

  async getIdByCredentialIdentifier(
    identifier: string
  ): Promise<string | null> {
    const identities = await this.executeSingleQuery({
      query: `SELECT identity_credentials.identity_id
           FROM identity_credentials
           JOIN identity_credential_identifiers
             ON identity_credentials.id = identity_credential_identifiers.identity_credential_id
             WHERE identity_credential_identifiers.identifier = $1`,
      params: [identifier],
    })

    if (
      identities &&
      identities[0] &&
      t.type({ identity_id: t.string }).is(identities[0])
    ) {
      return identities[0].identity_id
    }
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
      public: new FrontendApi(
        new KratosConfig({
          basePath: process.env.SERVER_KRATOS_PUBLIC_HOST,
        })
      ),

      admin: new IdentityApi(
        new KratosConfig({
          basePath: process.env.SERVER_KRATOS_ADMIN_HOST,
        })
      ),
      db: new KratosDB({
        connectionString: process.env.SERVER_KRATOS_DB_URI,
      }),
    },
    hydra: new HydraOAuth2Api(
      new HydraConfig({
        basePath: process.env.SERVER_HYDRA_HOST,
        baseOptions: {
          headers: { 'X-Forwarded-Proto': 'https' },
        },
      })
    ),
  }
}
