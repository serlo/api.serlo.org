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
import {
  RestRequest,
  ResponseResolver,
  rest,
  restContext,
  PathParams,
} from 'msw'

import { MajorDimension } from '~/model'

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
