import type {
  FrontendApi,
  IdentityApi,
  IdentityApiDeleteIdentityRequest,
  IdentityApiListIdentitiesRequest,
} from '@ory/client'
import { HttpResponse, ResponseResolver, http } from 'msw'
import { v4 as uuidv4 } from 'uuid'

import type { Identity, KratosDB } from '~/context/auth-services'
import { Model } from '~/internals/graphql'
import { MajorDimension } from '~/schema/uuid/user/resolvers'


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

export function givenSpreadheetApi(resolver: ResponseResolver) {
  const url =
    'https://sheets.googleapis.com/v4/spreadsheets/:spreadsheetId/values/:range'

  global.server.use(http.get(url, resolver))
}

export function defaultSpreadsheetApi(): ResponseResolver {
  return ({ request, params }) => {
    const url = new URL(request.url)
    const { searchParams } = url

    if (searchParams.get('key') !== process.env.GOOGLE_SPREADSHEET_API_SECRET) {
      return new HttpResponse(null, {
        status: 403,
      })
    }

    const typedParams = params as {
      spreadsheetId: string
      range: string
    }

    const { spreadsheetId } = typedParams
    const range = decodeURIComponent(typedParams.range)
    const majorDimension = searchParams.get('majorDimension') as MajorDimension

    const values = spreadsheets[toKey({ spreadsheetId, range, majorDimension })]

    if (values === undefined)
      return new HttpResponse(null, {
        status: 404,
      })

    return HttpResponse.json({ range, majorDimension, values })
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
}): ResponseResolver {
  return () => HttpResponse.json(json as Record<string, unknown>, { status })
}

export function returnsMalformedJson(): ResponseResolver {
  return () => new HttpResponse('MALFORMED JSON')
}

export function hasInternalServerError(): ResponseResolver {
  return () => new HttpResponse(null, { status: 500 })
}

function toKey(query: SpreadsheetQuery) {
  return [query.spreadsheetId, query.range, query.majorDimension].join('/')
}

interface SpreadsheetQuery {
  range: string
  spreadsheetId: string
  majorDimension: MajorDimension
}
