import { option as O, pipeable } from 'fp-ts'

import { Environment } from '../environment'

export interface QuerySpec<P, R> {
  getCurrentValue: (payload: P, previousValue: R | null) => Promise<R>
  maxAge: number
  getKey: (payload: P) => string
  getPayload: (key: string) => O.Option<P>
}

export type Query<P, R> = (P extends undefined
  ? () => Promise<R>
  : (payload: P) => Promise<R>) & {
  _querySpec: QuerySpec<P, R>
}

export function createQuery<P, R>(
  spec: QuerySpec<P, R>,
  environment: Environment
): Query<P, R> {
  async function query(payload: P): Promise<R> {
    const key = spec.getKey(payload)
    return await pipeable.pipe(
      await environment.cache.get<R>({ key }),
      O.fold(
        async () => {
          const value = await spec.getCurrentValue(payload, null)
          await environment.cache.set({
            key,
            value,
          })
          return value
        },
        async (cacheEntry) => {
          await environment.swrQueue.queue({
            key,
            // TODO: no longer needed
            maxAge: spec.maxAge,
          })
          return cacheEntry.value
        }
      )
    )
  }
  query._querySpec = spec
  return (query as unknown) as Query<P, R>
}

export function isQuery(query: unknown): query is Query<unknown, unknown> {
  return (query as Query<unknown, unknown>)?._querySpec !== undefined
}
