import { either as E } from 'fp-ts'

import { ErrorEvent } from '../../src/error-event'

export function expectToBeLeftEventWith<A>(
  value: E.Either<ErrorEvent, A>,
  expectedEvent: ErrorEvent
) {
  expect(E.isLeft(value)).toBe(true)

  if (E.isLeft(value))
    expect(value.left).toEqual(expect.objectContaining(expectedEvent))
}
