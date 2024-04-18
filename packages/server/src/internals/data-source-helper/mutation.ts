import { either as E } from 'fp-ts'
import t from 'io-ts'

import { InvalidCurrentValueError } from "~/errors"
import { AsyncOrSync } from '~/utils'

/**
 * Helper function to create a mutation in a datasource.
 */
export function createMutation<P, R>(spec: MutationSpec<P, R>): Mutation<P, R> {
  async function mutation(payload: P): Promise<R> {
    const result = await spec.mutate(payload)
    const decodedResult = spec.decoder.decode(result)

    if (E.isRight(decodedResult)) {
      if (spec.updateCache !== undefined)
        await spec.updateCache(payload, decodedResult.right)

      return decodedResult.right
    } else {
      throw new InvalidCurrentValueError({
        invalidCurrentValue: result,
        decoder: spec.decoder.name,
        type: spec.type,
        payload,
      })
    }
  }

  mutation._mutationSpec = spec

  return mutation
}

/**
 * Argument type for the function {@link createMutation} with which a mutation
 * in a data source can be created.
 */
interface MutationSpec<Payload, Result> {
  /**
   * io-ts decoder to control the returned value of the
   * mutation during runtime. An error is thrown when the returned value does not
   * match the decoder.
   */
  decoder: t.Type<Result, unknown>

  /**
   * Function which executes the actual mutation.
   */
  mutate: (payload: Payload) => Promise<unknown>

  /**
   * Optional function which updates the API cache when the mutation could be
   * executed and the result of the mutation matches the decoder.
   */
  updateCache?: (payload: Payload, newValue: Result) => AsyncOrSync<void>

  type: string
}

/**
 * Type of a mutation function in a data source.
 */
export type Mutation<Payload, Result> = ((
  payload: Payload,
) => Promise<Result>) & {
  _mutationSpec: MutationSpec<Payload, Result>
}
