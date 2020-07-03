import * as t from 'io-ts'
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray'
import { RESTDataSource } from 'apollo-datasource-rest'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'

export enum MajorDimension {
  Rows = 'ROWS',
  Columns = 'COLUMNS',
}

export const CellValues = nonEmptyArray(t.array(t.string))
export type CellValues = t.TypeOf<typeof CellValues>

export const ValueRange = t.partial({
  values: CellValues,
})
export type ValueRange = t.TypeOf<typeof ValueRange>

type FetchSignature = typeof fetch

export class GoogleSheetApi extends RESTDataSource {
  private apiKey: string

  constructor({ apiKey, fetch }: { apiKey: string; fetch: FetchSignature }) {
    //@ts-ignore
    super(fetch)

    this.apiKey = apiKey
    this.baseURL = 'https://sheets.googleapis.com/v4/spreadsheets/'
  }

  async getValues({
    spreadsheetId,
    range,
    majorDimension,
  }: {
    spreadsheetId: string
    range: string
    majorDimension: MajorDimension
  }): Promise<E.Either<Event, CellValues>> {
    try {
      return pipe(
        await this.get(`${spreadsheetId}/values/${range}`, {
          majorDimension,
          key: this.apiKey,
        }),
        ValueRange.decode,
        E.mapLeft((_) => {
          return { message: 'Error while parsing' }
        }),
        E.map((v) => v.values),
        E.chain(E.fromNullable({ message: 'empty range' }))
      )
    } catch (exception) {
      return E.left({ exception })
    }
  }
}

interface Event {
  message?: string
  exception?: object
  contexts?: Record<string, any>
}
