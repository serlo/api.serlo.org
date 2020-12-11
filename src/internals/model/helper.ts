export interface HelperSpec<P, R> {
  helper: (payload: P) => Promise<R>
}

export type Helper<P, R> = ((payload: P) => Promise<R>) & {
  _spec: HelperSpec<P, R>
}

export function createHelper<P, R>(spec: HelperSpec<P, R>): Helper<P, R> {
  async function helper(payload: P): Promise<R> {
    return await spec.helper(payload)
  }
  helper._spec = spec
  return helper
}
