import { option as O } from 'fp-ts'

import { cachedResolvers } from '~/schema'

describe('getPayload() is always the inverse to getKey()', () => {
  const testCases = cachedResolvers.map(
    (resolver) => [resolver.spec.name, resolver.spec] as const,
  )

  test.each(testCases)(
    '%s',
    (_name, { getKey, getPayload, examplePayload }) => {
      expect(getPayload(getKey(examplePayload))).toEqual(O.some(examplePayload))
    },
  )
})
