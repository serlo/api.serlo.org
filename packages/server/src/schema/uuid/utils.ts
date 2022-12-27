import { UserInputError } from 'apollo-server'
import * as t from 'io-ts'

import { isDateString } from '~/utils'

export function decodeDateOfDeletion(after: string) {
  const afterParsed = JSON.parse(
    Buffer.from(after, 'base64').toString()
  ) as unknown

  const dateOfDeletion = t.type({ dateOfDeletion: t.string }).is(afterParsed)
    ? afterParsed.dateOfDeletion
    : undefined

  if (!dateOfDeletion)
    throw new UserInputError(
      'Field `dateOfDeletion` as string is missing in `after`'
    )

  if (!isDateString(dateOfDeletion))
    throw new UserInputError(
      'The encoded dateOfDeletion in `after` should be a string in date format'
    )

  return new Date(dateOfDeletion).toISOString()
}
