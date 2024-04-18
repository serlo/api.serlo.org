import { option as O } from 'fp-ts'

import { isLegacyQuery, LegacyQuery } from '~/internals/data-source-helper'
import { emptySwrQueue } from '~/internals/swr-queue'
import { modelFactories } from '~/model'

describe('getPayload() is always inverse to getKey()', () => {
  describe.each(Object.entries(modelFactories))(
    '%s',
    (_name, dataSourceFactoryFunc) => {
      const dataSource = dataSourceFactoryFunc({
        context: { cache: global.cache, swrQueue: emptySwrQueue },
      })
      const queryFunctions = Object.entries(dataSource).filter(isQueryEntry)

      if (queryFunctions.length === 0) return

      test.each(queryFunctions)('%s()', (_funcName, queryFunction) => {
        const { getKey, getPayload, examplePayload } = queryFunction._querySpec

        expect(getPayload(getKey(examplePayload))).toEqual(
          O.some(examplePayload),
        )
      })
    },
  )
})

function isQueryEntry(
  arg: [string, object],
): arg is [string, LegacyQuery<unknown, unknown>] {
  return isLegacyQuery(arg[1])
}
