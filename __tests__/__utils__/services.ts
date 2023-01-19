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
import type { V0alpha2Api } from '@ory/client'
import type { AdminApi } from '@ory/hydra-client'
import {
  RestRequest,
  ResponseResolver,
  rest,
  restContext,
  PathParams,
} from 'msw'
import { v4 as uuidv4 } from 'uuid'

import type { Identity, KratosDB } from '~/internals/authentication'
import { Model } from '~/internals/graphql'
import type { MajorDimension } from '~/model'

export function createFakeAuthServices() {
  let identities: Identity[] = global.kratosIdentities
  return {
    kratos: {
      public: {} as unknown as V0alpha2Api,
      admin: {
        adminDeleteIdentity: (id: string) => {
          const identity = identities.find((identity) => identity.id === id)
          if (identity) {
            const identityIndex = identities.indexOf(identity)
            identities = identities.splice(identityIndex)
          }
        },
      } as unknown as V0alpha2Api,
      db: {
        getIdentityByLegacyId: (
          legacyId: number
        ): Partial<Identity> | undefined => {
          return identities.find(
            (identity) => identity.metadata_public.legacy_id === legacyId
          )
        },
      } as unknown as KratosDB,
    },
    hydra: {} as unknown as AdminApi,
  }
}

export function createFakeIdentity(user: Model<'User'>): Identity {
  return {
    id: uuidv4(),
    created_at: user.date,
    schema_id: 'default',
    state: 'active',
    state_changed_at: user.date,
    updated_at: user.date,
    traits: {
      username: user.username,
      email: `${user.username}@serlo.org`,
      description: user.description,
      language: 'de',
      motivation: null,
      profile_image: null,
    },
    metadata_public: {
      legacy_id: user.id,
    },
  }
}

const spreadsheets: Record<string, string[][] | undefined> = {}

export function givenSpreadheetApi(resolver: SpreadsheetApiResolver) {
  const url =
    'https://sheets.googleapis.com/v4/spreadsheets/:spreadsheetId/values/:range'

  global.server.use(rest.get(url, resolver))
}

export function defaultSpreadsheetApi(): SpreadsheetApiResolver {
  return (req, res, ctx) => {
    const searchParams = req.url.searchParams

    if (searchParams.get('key') !== process.env.GOOGLE_SPREADSHEET_API_SECRET) {
      return res(ctx.status(403))
    }

    const { spreadsheetId } = req.params
    const range = decodeURIComponent(req.params.range)
    const majorDimension = searchParams.get('majorDimension') as MajorDimension

    const values = spreadsheets[toKey({ spreadsheetId, range, majorDimension })]

    if (values === undefined) return res(ctx.status(404))

    return res(ctx.json({ range, majorDimension, values }))
  }
}

export function givenSpreadsheet(
  args: SpreadsheetQuery & { values: string[][] }
) {
  spreadsheets[toKey(args)] = args.values
}

export function returnsJson({
  status = 200,
  json,
}: {
  status?: number
  json: unknown
}): RestResolver {
  return (_req, res, ctx) =>
    res(ctx.status(status), ctx.json(json as Record<string, unknown>))
}

export function returnsMalformedJson(): RestResolver {
  return (_req, res, ctx) => res(ctx.body('MALFORMED JSON'))
}

export function hasInternalServerError(): RestResolver {
  return (_req, res, ctx) => res(ctx.status(500))
}

export type RestResolver<
  RequestBodyType = RestRequest['body'],
  RequestParamsType extends PathParams = PathParams
> = ResponseResolver<
  RestRequest<RequestBodyType, RequestParamsType>,
  typeof restContext
>

function toKey(query: SpreadsheetQuery) {
  return [query.spreadsheetId, query.range, query.majorDimension].join('/')
}

type SpreadsheetApiResolver = RestResolver<never, SpreadsheetQueryBasic>

interface SpreadsheetQueryBasic extends PathParams {
  range: string
  spreadsheetId: string
}

interface SpreadsheetQuery {
  range: string
  spreadsheetId: string
  majorDimension: MajorDimension
}
