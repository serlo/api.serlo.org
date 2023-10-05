import { either as E } from 'fp-ts'
import * as t from 'io-ts'
import reporter from 'io-ts-reporters'

import { InvalidCurrentValueError } from './common'

/**
 * Specification object for a request function.
 */
export interface RequestSpec<Payload, Result> {
  /**
   * io-ts decoder which is used during runtime to check whether the returned
   * value is of the aspected type.
   */
  decoder: t.Type<Result, unknown>

  /**
   * Function which does the actual query operation.
   */
  getCurrentValue: (payload: Payload) => Promise<unknown>
}

/**
 * Type of a request operation in a data source.
 */
export type Request<Payload, Result> = (Payload extends undefined
  ? () => Promise<Result>
  : (payload: Payload) => Promise<Result>) & {
  _querySpec: RequestSpec<Payload, Result>
}

/**
 * Creates a request function for a data source. This is a "read" operation
 * which shall never be cached by the API. Thus it only checks whether the
 * returned value has the right type. It throws an error when the check was not
 * successful.
 */
export function createRequest<P, R>(spec: RequestSpec<P, R>): Request<P, R> {
  async function query(payload: P) {
    const result = await spec.getCurrentValue(payload)
    const decodedResult = spec.decoder.decode(result)

    if (E.isRight(decodedResult)) {
      return decodedResult.right
    } else {
      throw new InvalidCurrentValueError({
        invalidCurrentValue: result,
        decoder: spec.decoder.name,
        validationErrors: reporter.report(decodedResult),
      })
    }
  }

  query._querySpec = spec

  return query as unknown as Request<P, R>
}
