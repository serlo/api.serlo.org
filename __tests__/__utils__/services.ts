import type {
  FrontendApi,
  IdentityApi,
  IdentityApiDeleteIdentityRequest,
  IdentityApiListIdentitiesRequest,
} from '@ory/client'
import {
  RestRequest,
  ResponseResolver,
  rest,
  restContext,
  PathParams,
  DefaultBodyType,
} from 'msw'
import { v4 as uuidv4 } from 'uuid'

import type { Identity, KratosDB } from '~/internals/authentication'
import { Model } from '~/internals/graphql'
import type { MajorDimension } from '~/model'

export class MockKratos {
  identities: Identity[] = []

  public = {} as unknown as FrontendApi

  admin = {
    deleteIdentity: (requestParameters: IdentityApiDeleteIdentityRequest) => {
      const identity = this.identities.find(
        (identity) => identity.id === requestParameters.id,
      )
      if (identity) {
        const identityIndex = this.identities.indexOf(identity)
        this.identities.splice(identityIndex)
      }
    },
    listIdentities: ({
      credentialsIdentifier,
    }: IdentityApiListIdentitiesRequest) => {
      return Promise.resolve({
        data: [
          this.identities.find(
            (identity) => identity.traits.username === credentialsIdentifier,
          ),
        ],
      })
    },
  } as unknown as IdentityApi

  db = {
    getIdentityByLegacyId: (
      legacyId: number,
    ): Partial<Identity> | undefined => {
      return this.identities.find(
        (identity) => identity.metadata_public.legacy_id === legacyId,
      )
    },
  } as unknown as KratosDB
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
      language: user.language,
      motivation: null,
      profile_image: null,
    },
    metadata_public: {
      legacy_id: user.id,
      lastLogin: user.lastLogin,
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
  args: SpreadsheetQuery & { values: string[][] },
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
  RequestBodyType extends DefaultBodyType = DefaultBodyType,
  RequestParamsType extends PathParams = PathParams,
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
