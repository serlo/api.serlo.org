import { Configuration, IdentityApi, FrontendApi, OAuth2Api } from '@ory/client'
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
  hydra: OAuth2Api
}

export type Identity = t.TypeOf<typeof IdentityDecoder>

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
  metadata_public: t.intersection([
    t.type({ legacy_id: t.number }),
    t.partial({
      lastLogin: t.union([DateFromISOString, t.string, t.undefined, t.null]),
    }),
  ]),
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
    identifier: string,
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
        new Configuration({
          basePath: process.env.SERVER_KRATOS_PUBLIC_HOST,
        }),
      ),

      admin: new IdentityApi(
        new Configuration({
          basePath: process.env.SERVER_KRATOS_ADMIN_HOST,
        }),
      ),
      db: new KratosDB({
        connectionString: process.env.SERVER_KRATOS_DB_URI,
      }),
    },
    hydra: new OAuth2Api(
      new Configuration({
        basePath: process.env.SERVER_HYDRA_HOST,
        baseOptions: {
          headers: { 'X-Forwarded-Proto': 'https' },
        },
      }),
    ),
  }
}
