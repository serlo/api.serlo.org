import * as assertions from '../../__tests__/__utils__/assertions'

export async function assertSuccessfulGraphQLQuery(
  args: Omit<
    Parameters<typeof assertions.assertSuccessfulGraphQLQuery>[0],
    'client'
  >
) {
  return assertions.assertSuccessfulGraphQLQuery({
    ...args,
    client: global.client,
  })
}
